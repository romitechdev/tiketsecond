import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { ensureDbUserFromSupabaseUser } from '@/lib/ensure-user';

export async function GET() {
  try {
    const supabaseUser = await getCurrentUser();
    if (!supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await ensureDbUserFromSupabaseUser(supabaseUser);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Auto-delete expired tickets for this user
    const today = new Date().toISOString().split('T')[0];
    await db.ticket.deleteMany({
      where: {
        userId: user.id,
        tanggal: { lt: today },
        status: 'available',
      }
    });

    const tickets = await db.ticket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}
