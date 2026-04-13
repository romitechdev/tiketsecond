import { redirect } from "next/navigation";
import { readAdminLogs } from "@/lib/admin-log";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

export const revalidate = 0;

const allowedActions = new Set([
  "create_ticket",
  "update_ticket",
  "mark_ticket_sold",
  "delete_ticket",
  "profile_update",
  "onboarding_complete",
]);

export default async function ActivityPage() {
  const user = await getCurrentUser();
  const email = user?.email;

  if (!email) {
    redirect("/login");
  }

  const logs = await readAdminLogs();
  const myLogs = logs
    .filter((log) => log.actorEmail === email && allowedActions.has(log.action))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="max-w-[1000px] mx-auto pt-8 px-4 md:px-8 pb-32 space-y-8">
      <div className="border-[3px] border-black bg-white shadow-kinetic p-8 md:p-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Riwayat Aktivitas</p>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Aktivitas Saya</h1>
        <p className="text-xs font-semibold text-gray-600 mt-3">
          Log upload, edit, sold, delete tiket, dan update profil akun Anda.
        </p>
      </div>

      {myLogs.length === 0 ? (
        <div className="border-[3px] border-black bg-white shadow-kinetic p-10 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-3">Belum Ada Aktivitas</h2>
          <p className="text-sm font-semibold text-gray-600 mb-6">
            Mulai dengan upload tiket pertama atau perbarui profil untuk melihat riwayat aktivitas di sini.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/upload"
              className="bg-black text-white px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition"
            >
              Upload Tiket
            </Link>
            <Link
              href="/profile"
              className="border-[2px] border-black px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {myLogs.map((log) => (
            <div key={log.id} className="border-[2px] border-black bg-white p-5 shadow-kinetic">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{new Date(log.createdAt).toLocaleString("id-ID")}</p>
                <p className="text-[10px] font-black uppercase tracking-widest">{log.action.replace(/_/g, " ")}</p>
              </div>
              <p className="text-sm font-semibold text-gray-700">{log.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
