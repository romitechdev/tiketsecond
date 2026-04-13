import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { getCurrentUser } from "@/lib/session";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const email = user?.email;

  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  return NextResponse.json(
    { error: `Log ${id} bersifat immutable dan tidak bisa dihapus` },
    { status: 405 }
  );
}
