import { NextResponse } from "next/server";
import db from "@/lib/db";
import { appendAdminLog } from "@/lib/admin-log";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/session";
import { ensureDbUserFromSupabaseUser } from "@/lib/ensure-user";
import { syncSupabaseUserProfile } from "@/lib/supabase/sync-user";

function normalizePhone(rawPhone: string) {
  return rawPhone.replace(/\s+/g, "").trim();
}

function isValidPhone(phone: string) {
  return /^\+?[0-9]{9,15}$/.test(phone);
}

export async function POST(req: Request) {
  const supabaseUser = await getCurrentUser();
  const actorEmail = supabaseUser?.email || "unknown@user";

  const rl = await checkRateLimit(`onboarding:${getClientKey(req, actorEmail)}`, 6, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Terlalu banyak percobaan. Coba lagi dalam ${rl.retryAfter} detik.` },
      { status: 429 }
    );
  }

  if (!supabaseUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = (await ensureDbUserFromSupabaseUser(supabaseUser)) ||
    (await db.user.findUnique({
      where: { email: supabaseUser.email },
      select: { phone: true },
    }));

  if (!currentUser) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  if (currentUser.phone) {
    return NextResponse.json(
      { error: "Onboarding sudah selesai. Nama tidak bisa diubah lagi." },
      { status: 409 }
    );
  }

  const body = (await req.json()) as { name?: string; phone?: string };
  const name = body.name?.trim() || "";
  const phone = body.phone ? normalizePhone(body.phone) : "";

  if (name.length < 3) {
    return NextResponse.json({ error: "Nama minimal 3 karakter" }, { status: 400 });
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Format nomor telepon tidak valid" }, { status: 400 });
  }

  try {
    await syncSupabaseUserProfile(supabaseUser.id, supabaseUser.user_metadata || {}, {
      name,
      phone,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal sinkronisasi ke Supabase Auth" },
      { status: 502 }
    );
  }

  const updated = await db.user.update({
    where: { email: supabaseUser.email },
    data: {
      name,
      phone,
    },
    select: {
      name: true,
      email: true,
      phone: true,
      image: true,
    },
  });

  await appendAdminLog({
    action: "onboarding_complete",
    targetType: "user",
    targetId: updated.email || supabaseUser.email,
    actorEmail,
    message: `User ${actorEmail} menyelesaikan onboarding`,
  });

  return NextResponse.json({
    message: "Onboarding selesai",
    user: updated,
  });
}
