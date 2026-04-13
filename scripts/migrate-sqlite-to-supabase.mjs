import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const sqlitePath = process.env.SQLITE_DB_PATH || path.join(process.cwd(), "prisma", "dev.db");

function toDateOrNull(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function tableExists(db, tableName) {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName);
  return Boolean(row);
}

async function main() {
  if (!fs.existsSync(sqlitePath)) {
    console.error(`SQLite source not found at ${sqlitePath}`);
    process.exit(1);
  }

  const sqlite = new DatabaseSync(sqlitePath, { readonly: true });
  const counters = {
    users: 0,
    tickets: 0,
    accounts: 0,
    sessions: 0,
    verificationTokens: 0,
  };

  try {
    if (tableExists(sqlite, "User")) {
      const users = sqlite
        .prepare(
          'SELECT "id", "name", "email", "emailVerified", "image", "phone", "createdAt" FROM "User"'
        )
        .all();

      for (const user of users) {
        await prisma.user.upsert({
          where: { id: user.id },
          create: {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: toDateOrNull(user.emailVerified),
            image: user.image,
            phone: user.phone,
            createdAt: toDateOrNull(user.createdAt) || new Date(),
          },
          update: {
            name: user.name,
            email: user.email,
            emailVerified: toDateOrNull(user.emailVerified),
            image: user.image,
            phone: user.phone,
          },
        });
        counters.users += 1;
      }
    }

    const existingUsers = new Set((await prisma.user.findMany({ select: { id: true } })).map((u) => u.id));

    if (tableExists(sqlite, "Ticket")) {
      const tickets = sqlite
        .prepare(
          'SELECT "id", "userId", "asal", "tujuan", "tanggal", "jam", "harga", "coach", "seat", "kelas", "image", "status", "createdAt" FROM "Ticket"'
        )
        .all();

      for (const ticket of tickets) {
        if (!existingUsers.has(ticket.userId)) continue;
        await prisma.ticket.upsert({
          where: { id: ticket.id },
          create: {
            id: ticket.id,
            userId: ticket.userId,
            asal: ticket.asal,
            tujuan: ticket.tujuan,
            tanggal: ticket.tanggal,
            jam: ticket.jam,
            harga: Number(ticket.harga),
            coach: ticket.coach,
            seat: ticket.seat,
            kelas: ticket.kelas,
            image: ticket.image,
            status: ticket.status || "available",
            createdAt: toDateOrNull(ticket.createdAt) || new Date(),
          },
          update: {
            userId: ticket.userId,
            asal: ticket.asal,
            tujuan: ticket.tujuan,
            tanggal: ticket.tanggal,
            jam: ticket.jam,
            harga: Number(ticket.harga),
            coach: ticket.coach,
            seat: ticket.seat,
            kelas: ticket.kelas,
            image: ticket.image,
            status: ticket.status || "available",
          },
        });
        counters.tickets += 1;
      }
    }

    if (tableExists(sqlite, "Account")) {
      const accounts = sqlite
        .prepare(
          'SELECT "id", "userId", "type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state" FROM "Account"'
        )
        .all();

      for (const account of accounts) {
        if (!existingUsers.has(account.userId)) continue;
        await prisma.account.upsert({
          where: { id: account.id },
          create: {
            id: account.id,
            userId: account.userId,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at ? Number(account.expires_at) : null,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state,
          },
          update: {
            userId: account.userId,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at ? Number(account.expires_at) : null,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state,
          },
        });
        counters.accounts += 1;
      }
    }

    if (tableExists(sqlite, "Session")) {
      const sessions = sqlite
        .prepare('SELECT "id", "sessionToken", "userId", "expires" FROM "Session"')
        .all();

      for (const session of sessions) {
        if (!existingUsers.has(session.userId)) continue;
        const expires = toDateOrNull(session.expires) || new Date();
        await prisma.session.upsert({
          where: { id: session.id },
          create: {
            id: session.id,
            sessionToken: session.sessionToken,
            userId: session.userId,
            expires,
          },
          update: {
            sessionToken: session.sessionToken,
            userId: session.userId,
            expires,
          },
        });
        counters.sessions += 1;
      }
    }

    if (tableExists(sqlite, "VerificationToken")) {
      const tokens = sqlite
        .prepare('SELECT "identifier", "token", "expires" FROM "VerificationToken"')
        .all();

      for (const tokenRow of tokens) {
        await prisma.verificationToken.upsert({
          where: { token: tokenRow.token },
          create: {
            identifier: tokenRow.identifier,
            token: tokenRow.token,
            expires: toDateOrNull(tokenRow.expires) || new Date(),
          },
          update: {
            identifier: tokenRow.identifier,
            expires: toDateOrNull(tokenRow.expires) || new Date(),
          },
        });
        counters.verificationTokens += 1;
      }
    }

    console.log("SQLite -> Supabase migration completed");
    console.table(counters);
  } finally {
    sqlite.close();
    await prisma.$disconnect();
  }
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});