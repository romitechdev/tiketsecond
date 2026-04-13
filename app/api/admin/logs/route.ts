import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { readAdminLogs } from "@/lib/admin-log";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  const email = user?.email;

  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const logs = await readAdminLogs();
  const sorted = logs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ logs: sorted });
}

export async function DELETE() {
  const user = await getCurrentUser();
  const email = user?.email;

  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(
    { error: "Audit log bersifat immutable dan tidak bisa dihapus" },
    { status: 405 }
  );
}
