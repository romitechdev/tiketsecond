import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  const email = user?.email;

  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: {
        select: { tickets: true },
      },
    },
  });

  return NextResponse.json({ users });
}
