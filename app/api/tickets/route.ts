import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { appendAdminLog } from '@/lib/admin-log';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';
import { getCurrentUser } from '@/lib/session';
import { ensureDbUserFromSupabaseUser } from '@/lib/ensure-user';
import { uploadImageToStorage } from '@/lib/storage';

export async function GET() {
  try {
    // Auto-delete expired tickets (tanggal is YYYY-MM-DD format)
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    await db.ticket.deleteMany({
      where: {
        tanggal: { lt: today },
        status: 'available',
      }
    });

    const tickets = await db.ticket.findMany({
      where: { status: 'available' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, image: true }
        }
      }
    });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabaseUser = await getCurrentUser();
    const actorEmail = supabaseUser?.email || 'unknown@user';
        const rl = await checkRateLimit(`ticket-create:${getClientKey(req, actorEmail)}`, 12, 60_000);
        if (!rl.allowed) {
          return NextResponse.json({ error: `Terlalu banyak request. Coba lagi dalam ${rl.retryAfter} detik.` }, { status: 429 });
        }

    if (!supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const asal = formData.get('asal') as string;
    const tujuan = formData.get('tujuan') as string;
    const tanggal = formData.get('tanggal') as string;
    const jam = formData.get('jam') as string;
    const harga = formData.get('harga') as string;
    const file = formData.get('image') as File | null;

    const phone = formData.get('phone') as string;
    const coach = formData.get('coach') as string;
    const seat = formData.get('seat') as string;
    const kelas = formData.get('kelas') as string;

    if (!asal || !tujuan || !tanggal || !jam || !harga || !phone) {
      return NextResponse.json({ error: 'Harap isi semua field termasuk nomor WhatsApp' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Mohon upload gambar tiket' }, { status: 400 });
    }

    const typeofFile = file.type;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      return NextResponse.json({ error: 'Ekstensi file harus jpg/png' }, { status: 400 });
    }

    if (typeofFile !== 'image/jpeg' && typeofFile !== 'image/jpg' && typeofFile !== 'image/png') {
      return NextResponse.json({ error: 'Hanya jpg/png yang diperbolehkan' }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file maksimal 2MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await uploadImageToStorage({
      folder: 'tickets',
      buffer,
      contentType: file.type,
      extension: ext || 'jpg',
    });

    // Get or create user based on email
    const user = await ensureDbUserFromSupabaseUser(supabaseUser);

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 400 });
    }

    await db.user.update({
      where: { id: user.id },
      data: { phone },
    });

    const ticket = await db.ticket.create({
      data: {
        userId: user.id,
        asal,
        tujuan,
        tanggal,
        jam,
        harga: parseInt(harga),
        coach: coach || null,
        seat: seat || null,
        kelas: kelas || null,
        image: uploaded.publicUrl,
      }
    });

    await appendAdminLog({
      action: 'create_ticket',
      targetType: 'ticket',
      targetId: ticket.id,
      actorEmail,
      message: `User ${actorEmail} membuat tiket ${ticket.asal} -> ${ticket.tujuan}`,
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
