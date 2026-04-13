import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Prisma } from '@prisma/client';
import { appendAdminLog } from '@/lib/admin-log';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';
import { getCurrentUser } from '@/lib/session';
import { ensureDbUserFromSupabaseUser } from '@/lib/ensure-user';
import { deleteImageFromStorageByUrl, uploadImageToStorage } from '@/lib/storage';

// GET single ticket
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ticket = await db.ticket.findUnique({
      where: { id },
      include: { user: { select: { name: true, image: true, phone: true } } }
    });
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    return NextResponse.json(ticket);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}

// UPDATE ticket
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabaseUser = await getCurrentUser();
    const actorEmail = supabaseUser?.email || 'unknown@user';
        const rl = await checkRateLimit(`ticket-update:${getClientKey(req, actorEmail)}`, 15, 60_000);
        if (!rl.allowed) {
          return NextResponse.json({ error: `Terlalu banyak request. Coba lagi dalam ${rl.retryAfter} detik.` }, { status: 429 });
        }

    if (!supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const user = await ensureDbUserFromSupabaseUser(supabaseUser);

    // Verify ownership
    const existing = await db.ticket.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    if (!user || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: bukan pemilik tiket' }, { status: 403 });
    }

    const formData = await req.formData();
    const asal = formData.get('asal') as string;
    const tujuan = formData.get('tujuan') as string;
    const tanggal = formData.get('tanggal') as string;
    const jam = formData.get('jam') as string;
    const harga = formData.get('harga') as string;
    const coach = formData.get('coach') as string;
    const seat = formData.get('seat') as string;
    const kelas = formData.get('kelas') as string;
    const status = formData.get('status') as string;
    const file = formData.get('image') as File | null;

    const updateData: Prisma.TicketUpdateInput = {};
    if (asal) updateData.asal = asal;
    if (tujuan) updateData.tujuan = tujuan;
    if (tanggal) updateData.tanggal = tanggal;
    if (jam) updateData.jam = jam;
    if (harga) updateData.harga = parseInt(harga);
    if (coach !== null) updateData.coach = coach || null;
    if (seat !== null) updateData.seat = seat || null;
    if (kelas !== null) updateData.kelas = kelas || null;
    if (status) updateData.status = status;

    // Handle new image upload if provided
    if (file && file.size > 0) {
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
      updateData.image = uploaded.publicUrl;

      await deleteImageFromStorageByUrl(existing.image);
    }

    const ticket = await db.ticket.update({
      where: { id },
      data: updateData,
    });

    await appendAdminLog({
      action: status === 'sold' ? 'mark_ticket_sold' : 'update_ticket',
      targetType: 'ticket',
      targetId: ticket.id,
      actorEmail,
      message: `User ${actorEmail} memperbarui tiket ${ticket.id}`,
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}

// DELETE ticket
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabaseUser = await getCurrentUser();
    const actorEmail = supabaseUser?.email || 'unknown@user';
        const rl = await checkRateLimit(`ticket-delete:${getClientKey(req, actorEmail)}`, 10, 60_000);
        if (!rl.allowed) {
          return NextResponse.json({ error: `Terlalu banyak request. Coba lagi dalam ${rl.retryAfter} detik.` }, { status: 429 });
        }

    if (!supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const user = await ensureDbUserFromSupabaseUser(supabaseUser);

    const existing = await db.ticket.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    if (!user || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: bukan pemilik tiket' }, { status: 403 });
    }

    await deleteImageFromStorageByUrl(existing.image);

    await db.ticket.delete({ where: { id } });

    await appendAdminLog({
      action: 'delete_ticket',
      targetType: 'ticket',
      targetId: id,
      actorEmail,
      message: `User ${actorEmail} menghapus tiket ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 });
  }
}
