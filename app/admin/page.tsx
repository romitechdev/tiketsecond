import { redirect } from "next/navigation";
import db from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";
import Link from "next/link";
import AdminUserManager from "@/components/AdminUserManager";
import AdminLogManager from "@/components/AdminLogManager";
import { getCurrentUser } from "@/lib/session";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getCurrentUser();

  if (!session?.email || !isAdminEmail(session.email)) {
    redirect("/");
  }

  const [
    totalUsers,
    totalTickets,
    availableTickets,
    soldTickets,
    recentTickets,
    recentUsers,
    ticketClassGroups,
    topSellerGroups,
  ] = await Promise.all([
    db.user.count(),
    db.ticket.count(),
    db.ticket.count({ where: { status: "available" } }),
    db.ticket.count({ where: { status: "sold" } }),
    db.ticket.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    }),
    db.user.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    }),
    db.ticket.groupBy({
      by: ["kelas"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
    db.ticket.groupBy({
      by: ["userId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ]);

  const sellerIds = topSellerGroups.map((g) => g.userId);
  const topSellerUsers = sellerIds.length
    ? await db.user.findMany({
        where: { id: { in: sellerIds } },
        select: { id: true, name: true, email: true },
      })
    : [];

  const sellerMap = new Map(topSellerUsers.map((u) => [u.id, u]));

  return (
    <div className="space-y-10 mt-8 p-4 md:p-8">
      <div className="border-[3px] border-black bg-white shadow-kinetic p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Pusat Kontrol
            </p>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              Dashboard Admin
            </h1>
            <p className="text-xs font-semibold text-gray-600 mt-3">
              Monitor aktivitas pengguna, performa listing tiket, dan operasional TiketSecond.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-start">
            <Link
              href="/search"
              className="border-[2px] border-black px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition"
            >
              Lihat Marketplace
            </Link>
            <Link
              href="/upload"
              className="bg-black text-white px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-kinetic"
            >
              Upload Tiket
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Pengguna" value={totalUsers.toLocaleString("id-ID")} />
        <StatCard label="Total Listing" value={totalTickets.toLocaleString("id-ID")} />
        <StatCard label="Tiket Tersedia" value={availableTickets.toLocaleString("id-ID")} />
        <StatCard label="Tiket Terjual" value={soldTickets.toLocaleString("id-ID")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border-[3px] border-black bg-white shadow-kinetic p-6 md:p-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Listing Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-black text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <th className="py-3 pr-4">Rute</th>
                  <th className="py-3 pr-4">Penjual</th>
                  <th className="py-3 pr-4">Kelas</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Harga</th>
                  <th className="py-3 pr-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-200 text-sm font-semibold">
                    <td className="py-3 pr-4 uppercase tracking-wide">
                      {ticket.asal} → {ticket.tujuan}
                    </td>
                    <td className="py-3 pr-4 text-xs">
                      {ticket.user.name || "Tanpa Nama"}
                    </td>
                    <td className="py-3 pr-4 text-xs uppercase">
                      {ticket.kelas || "N/A"}
                    </td>
                    <td className="py-3 pr-4 text-xs uppercase font-black">
                      {ticket.status === "sold" ? "Terjual" : "Tersedia"}
                    </td>
                    <td className="py-3 pr-4 text-xs">
                      Rp {ticket.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 pr-4">
                      <Link
                        href={`/ticket/${ticket.id}`}
                        className="text-[10px] font-black uppercase tracking-widest underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-[3px] border-black bg-white shadow-kinetic p-6">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Kelas Populer</h3>
            <div className="space-y-3">
              {ticketClassGroups.length === 0 ? (
                <p className="text-xs font-semibold text-gray-500">Belum ada data kelas tiket.</p>
              ) : (
                ticketClassGroups.map((group) => (
                  <div key={group.kelas || "N/A"} className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                    <span>{group.kelas || "Tanpa Kelas"}</span>
                    <span>{group._count.id}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-[3px] border-black bg-white shadow-kinetic p-6">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Top Seller</h3>
            <div className="space-y-4">
              {topSellerGroups.length === 0 ? (
                <p className="text-xs font-semibold text-gray-500">Belum ada data seller.</p>
              ) : (
                topSellerGroups.map((group, idx) => {
                  const seller = sellerMap.get(group.userId);
                  return (
                    <div key={group.userId} className="border-b border-gray-200 pb-3 last:border-none last:pb-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        #{idx + 1}
                      </p>
                      <p className="text-sm font-black uppercase tracking-tight">
                        {seller?.name || "Tanpa Nama"}
                      </p>
                      <p className="text-[11px] font-semibold text-gray-500 truncate">
                        {seller?.email || "Tanpa Email"}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest mt-1">
                        {group._count.id} Listing
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-[3px] border-black bg-white shadow-kinetic p-6 md:p-8">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Pengguna Terbaru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentUsers.map((user) => (
            <div key={user.id} className="border-[2px] border-black p-4 bg-gray-50">
              <p className="text-sm font-black uppercase tracking-tight truncate">{user.name || "Tanpa Nama"}</p>
              <p className="text-[11px] font-semibold text-gray-500 truncate mt-1">{user.email || "Tanpa Email"}</p>
              <p className="text-[10px] font-black uppercase tracking-widest mt-3">
                {user.phone || "No phone"}
              </p>
              <p className="text-[10px] font-semibold text-gray-500 mt-2">
                Bergabung: {new Date(user.createdAt).toLocaleDateString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AdminUserManager />
        <AdminLogManager />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-[3px] border-black bg-white shadow-kinetic p-6">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{label}</p>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
  );
}
