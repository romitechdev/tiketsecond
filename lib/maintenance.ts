import db from "@/lib/db";

function parseNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getMaintenanceConfig() {
  const logRetentionDays = parseNumber(process.env.ACTIVITY_LOG_RETENTION_DAYS, 90);
  const rateLimitRetentionHours = parseNumber(process.env.RATE_LIMIT_RETENTION_HOURS, 24);

  return {
    logRetentionDays,
    rateLimitRetentionHours,
  };
}

export async function runMaintenanceCleanup() {
  const { logRetentionDays, rateLimitRetentionHours } = getMaintenanceConfig();

  const logCutoff = new Date(Date.now() - logRetentionDays * 24 * 60 * 60 * 1000);
  const rateLimitCutoff = new Date(Date.now() - rateLimitRetentionHours * 60 * 60 * 1000);

  const [activityLogs, rateLimitBuckets] = await Promise.all([
    db.activityLog.deleteMany({
      where: {
        createdAt: { lt: logCutoff },
      },
    }),
    db.rateLimitBucket.deleteMany({
      where: {
        resetAt: { lt: rateLimitCutoff },
      },
    }),
  ]);

  return {
    deletedActivityLogs: activityLogs.count,
    deletedRateLimitBuckets: rateLimitBuckets.count,
    logRetentionDays,
    rateLimitRetentionHours,
  };
}