import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";
import { appendAdminLog } from "@/lib/admin-log";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/session";
import { ensureDbUserFromSupabaseUser } from "@/lib/ensure-user";
import { deleteImageFromStorageByUrl, uploadImageToStorage } from "@/lib/storage";
import { syncSupabaseUserProfile } from "@/lib/supabase/sync-user";

function normalizePhone(rawPhone: string) {
  return rawPhone.replace(/\s+/g, "").trim();
}

function isValidPhone(phone: string) {
  return /^\+?[0-9]{9,15}$/.test(phone);
}

function buildFallbackUser(supabaseUser: Awaited<ReturnType<typeof getCurrentUser>>) {
  return {
    name:
      (supabaseUser?.user_metadata?.full_name as string | undefined) ||
      (supabaseUser?.user_metadata?.name as string | undefined) ||
      supabaseUser?.email ||
      "",
    email: supabaseUser?.email || "",
    image: (supabaseUser?.user_metadata?.avatar_url as string | undefined) || "",
    phone: "",
  };
}

export async function GET() {
  const supabaseUser = await getCurrentUser();

  if (!supabaseUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    phone: string | null;
    createdAt: Date;
  } | null = await ensureDbUserFromSupabaseUser(supabaseUser);

  if (!user) {
    try {
      user = await db.user.findUnique({
        where: { email: supabaseUser.email || "" },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
          createdAt: true,
        },
      });
    } catch (error) {
      console.error("GET /api/profile DB lookup failed", error);
    }
  }

  if (!user) {
    const fallbackUser = buildFallbackUser(supabaseUser);
    if (!fallbackUser.email) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: fallbackUser,
      needsOnboarding: true,
      isAdmin: isAdminEmail(fallbackUser.email),
      degraded: true,
      warning: "Database sedang tidak tersedia, menampilkan data akun dasar.",
    });
  }

  return NextResponse.json({
    user,
    needsOnboarding: !user.phone,
    isAdmin: isAdminEmail(user.email),
  });
}

export async function PATCH(req: Request) {
  const supabaseUser = await getCurrentUser();
  const actorEmail = supabaseUser?.email || "unknown@user";

  const rl = await checkRateLimit(`profile:${getClientKey(req, actorEmail)}`, 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Terlalu banyak request. Coba lagi dalam ${rl.retryAfter} detik.` },
      { status: 429 }
    );
  }

  if (!supabaseUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const phone = normalizePhone((formData.get("phone") as string) || "");
  const file = formData.get("image") as File | null;

  if (!phone) {
    return NextResponse.json({ error: "Nomor telepon wajib diisi" }, { status: 400 });
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Format nomor telepon tidak valid" }, { status: 400 });
  }

  const ensuredUser = await ensureDbUserFromSupabaseUser(supabaseUser);
  let user: { id: string; image: string | null } | null = ensuredUser
    ? { id: ensuredUser.id, image: ensuredUser.image }
    : null;

  if (!user) {
    try {
      user = await db.user.findUnique({
        where: { email: supabaseUser.email },
        select: { id: true, image: true },
      });
    } catch (error) {
      console.error("PATCH /api/profile DB lookup failed", error);
      return NextResponse.json(
        { error: "Layanan database sementara tidak tersedia. Coba lagi sebentar." },
        { status: 503 }
      );
    }
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const previousImage = user.image;
  let nextImage = user.image;
  let uploadedImageUrl: string | null = null;

  if (file && file.size > 0) {
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran foto maksimal 2MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!["jpg", "jpeg", "png"].includes(ext)) {
      return NextResponse.json({ error: "Ekstensi file harus JPG atau PNG" }, { status: 400 });
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      return NextResponse.json({ error: "Foto profil harus JPG atau PNG" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploaded = await uploadImageToStorage({
      folder: "profiles",
      buffer,
      contentType: file.type,
      extension: ext || "jpg",
    });

    uploadedImageUrl = uploaded.publicUrl;
    nextImage = uploaded.publicUrl;
  }

  try {
    await syncSupabaseUserProfile(supabaseUser.id, supabaseUser.user_metadata || {}, {
      phone,
      image: nextImage || null,
    });
  } catch (error) {
    if (uploadedImageUrl) {
      await deleteImageFromStorageByUrl(uploadedImageUrl);
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal sinkronisasi ke Supabase Auth" },
      { status: 502 }
    );
  }

  let updated;

  try {
    updated = await db.user.update({
      where: { email: supabaseUser.email },
      data: {
        phone,
        image: nextImage || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
      },
    });
  } catch (error) {
    if (uploadedImageUrl) {
      await deleteImageFromStorageByUrl(uploadedImageUrl);
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memperbarui profil" },
      { status: 500 }
    );
  }

  if (previousImage && previousImage !== nextImage) {
    await deleteImageFromStorageByUrl(previousImage);
  }

  await appendAdminLog({
    action: "profile_update",
    targetType: "user",
    targetId: updated.id,
    actorEmail,
    message: `User ${actorEmail} memperbarui profil`,
  });

  return NextResponse.json({
    message: "Profil berhasil diperbarui",
    user: updated,
  });
}
