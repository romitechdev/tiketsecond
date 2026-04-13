import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import db from "@/lib/db";
import { appendAdminLog } from "@/lib/admin-log";
import { getCurrentUser } from "@/lib/session";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const actorEmail = user?.email;

  if (!actorEmail || !isAdminEmail(actorEmail)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const target = await db.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true },
  });

  if (!target) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  if (isAdminEmail(target.email)) {
    return NextResponse.json({ error: "Akun admin tidak bisa dihapus" }, { status: 400 });
  }

  await db.user.delete({ where: { id } });

  await appendAdminLog({
    action: "delete_user",
    targetType: "user",
    targetId: target.id,
    actorEmail,
    message: `Admin ${actorEmail} menghapus user ${target.email || target.name || target.id}`,
  });

  return NextResponse.json({ message: "User berhasil dihapus" });
}
