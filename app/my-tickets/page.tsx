"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Trash2, Edit3, Eye, Plus, AlertCircle } from "lucide-react";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";

interface Ticket {
  id: string;
  asal: string;
  tujuan: string;
  tanggal: string;
  jam: string;
  harga: number;
  coach: string | null;
  seat: string | null;
  kelas: string | null;
  image: string;
  status: string;
  createdAt: string;
}

export default function MyTicketsPage() {
  const { user, loading: authLoading } = useSupabaseAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchMyTickets = useCallback(async () => {
    try {
      const res = await fetch("/api/tickets/my");
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      setError("Gagal memuat tiket");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyTickets();
    }
  }, [user, fetchMyTickets]);

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus tiket ini?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/tickets/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTickets((prev) => prev.filter((t) => t.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus");
      }
    } catch (err) {
      alert("Gagal menghapus tiket");
    } finally {
      setDeleting(null);
    }
  }

  async function handleMarkSold(id: string) {
    if (!confirm("Tandai tiket ini sebagai TERJUAL?")) return;
    try {
      const form = new FormData();
      form.append("status", "sold");
      const res = await fetch(`/api/tickets/${id}`, { method: "PUT", body: form });
      if (res.ok) {
        setTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: "sold" } : t))
        );
      } else {
        const data = await res.json();
        alert(data.error || "Gagal update status");
      }
    } catch (err) {
      alert("Gagal update status");
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-8 px-4 md:px-8 pb-32">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b-4 border-black pb-6 gap-4">
        <div>
          <span className="bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest mb-4 inline-block">
            Dashboard
          </span>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Tiket Saya</h1>
          <p className="text-xs font-medium text-gray-500 mt-2">
            Kelola semua tiket yang Anda jual. Hapus atau tandai sebagai terjual.
          </p>
        </div>
        <Link
          href="/upload"
          className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-kinetic flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Jual Tiket Baru
        </Link>
      </div>

      {error && (
        <div className="border-[3px] border-[#cc0000] bg-[#fff0f0] p-4 flex items-center gap-3 mb-8">
          <AlertCircle className="h-5 w-5 shrink-0 text-[#cc0000]" />
          <span className="text-xs font-black uppercase tracking-widest text-[#cc0000]">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="border-kinetic p-16 text-center bg-white shadow-kinetic max-w-2xl mx-auto my-16">
          <div className="text-3xl font-black uppercase tracking-tighter mb-4">Belum Ada Tiket.</div>
          <p className="text-sm font-medium opacity-70 mb-8">Anda belum menjual tiket apapun.</p>
          <Link
            href="/upload"
            className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition inline-block"
          >
            Jual Tiket Pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.map((t) => (
            <div
              key={t.id}
              className={`border-[3px] border-black bg-white shadow-kinetic p-6 md:p-8 flex flex-col md:flex-row gap-6 relative ${
                t.status === "sold" ? "opacity-60" : ""
              }`}
            >
              {/* Status badge */}
              {t.status === "sold" && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest z-10">
                  Terjual
                </div>
              )}

              {/* Image */}
              <div className="w-full md:w-56 h-36 border-[2px] border-black bg-gray-50 shrink-0 overflow-hidden">
                <img
                  src={t.image}
                  alt={`${t.asal} - ${t.tujuan}`}
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
                  {t.asal} <span className="text-gray-300">→</span> {t.tujuan}
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[9px] font-black uppercase tracking-widest text-gray-500 mb-4">
                  <span>📅 {t.tanggal}</span>
                  <span>🕒 {t.jam}</span>
                  {t.coach && <span>🚃 Coach {t.coach}</span>}
                  {t.seat && <span>💺 Seat {t.seat}</span>}
                  {t.kelas && <span>🏷️ {t.kelas}</span>}
                </div>
                <div className="text-xl font-black tracking-tighter">
                  Rp {t.harga.toLocaleString("id-ID")}
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-3 shrink-0 md:justify-center">
                <Link
                  href={`/ticket/${t.id}`}
                  className="border-[2px] border-black px-4 py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-gray-100 transition flex items-center gap-2 justify-center"
                >
                  <Eye className="w-3 h-3" /> Lihat
                </Link>

                {t.status === "available" && (
                  <>
                    <Link
                      href={`/my-tickets/${t.id}/edit`}
                      className="border-[2px] border-black px-4 py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-gray-100 transition flex items-center gap-2 justify-center"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </Link>

                    <button
                      onClick={() => handleMarkSold(t.id)}
                      className="bg-black text-white px-4 py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 transition flex items-center gap-2 justify-center"
                    >
                      ✓ Terjual
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deleting === t.id}
                  className="border-[2px] border-red-600 text-red-600 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-red-50 transition flex items-center gap-2 justify-center disabled:opacity-50"
                >
                  <Trash2 className="w-3 h-3" />
                  {deleting === t.id ? "..." : "Hapus"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
