import db from "@/lib/db";

export type AdminLogEntry = {
  id: string;
  action: string;
  targetType: "user" | "ticket" | "system";
  targetId?: string;
  actorEmail: string;
  message: string;
  createdAt: string;
};

function toEntry(row: {
  id: string;
  action: string;
  targetType: string;
  targetId: string | null;
  actorEmail: string;
  message: string;
  createdAt: Date;
}): AdminLogEntry {
  return {
    id: row.id,
    action: row.action,
    targetType: row.targetType as AdminLogEntry["targetType"],
    targetId: row.targetId || undefined,
    actorEmail: row.actorEmail,
    message: row.message,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function readAdminLogs(): Promise<AdminLogEntry[]> {
  const logs = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return logs.map(toEntry);
}

export async function appendAdminLog(input: Omit<AdminLogEntry, "id" | "createdAt">) {
  const created = await db.activityLog.create({
    data: {
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId || null,
      actorEmail: input.actorEmail,
      message: input.message,
    },
  });

  return toEntry(created);
}

export async function removeAdminLog(id: string) {
  await db.activityLog.delete({ where: { id } });
}

export async function clearAdminLogs() {
  await db.activityLog.deleteMany();
}
