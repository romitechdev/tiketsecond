import { NextResponse } from "next/server";
import { runMaintenanceCleanup } from "@/lib/maintenance";

function isAuthorized(req: Request) {
  const secret = process.env.MAINTENANCE_CRON_SECRET;
  if (!secret) {
    return { ok: false, reason: "MAINTENANCE_CRON_SECRET belum diset" };
  }

  const auth = req.headers.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const direct = req.headers.get("x-maintenance-secret") || "";

  if (bearer === secret || direct === secret) {
    return { ok: true, reason: "" };
  }

  return { ok: false, reason: "Unauthorized" };
}

export async function POST(req: Request) {
  const auth = isAuthorized(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: 401 });
  }

  const result = await runMaintenanceCleanup();
  return NextResponse.json({
    ok: true,
    ...result,
    cleanedAt: new Date().toISOString(),
  });
}

export async function GET(req: Request) {
  return POST(req);
}