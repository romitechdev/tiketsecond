import db from "@/lib/db";

export async function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = new Date();
  const nowMs = now.getTime();
  const nextReset = new Date(nowMs + windowMs);

  const existing = await db.rateLimitBucket.findUnique({ where: { key } });

  if (!existing || existing.resetAt.getTime() <= nowMs) {
    const reset = await db.rateLimitBucket.upsert({
      where: { key },
      update: {
        count: 1,
        resetAt: nextReset,
      },
      create: {
        key,
        count: 1,
        resetAt: nextReset,
      },
    });

    return {
      allowed: true,
      remaining: Math.max(0, limit - reset.count),
      retryAfter: 0,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(0, Math.ceil((existing.resetAt.getTime() - nowMs) / 1000)),
    };
  }

  const updated = await db.rateLimitBucket.update({
    where: { key },
    data: { count: { increment: 1 } },
  });

  return {
    allowed: true,
    remaining: Math.max(0, limit - updated.count),
    retryAfter: 0,
  };
}

export function getClientKey(req: Request, fallback: string) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim();
  return ip || fallback;
}
