"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Train, Calendar, Clock, DollarSign, MapPin, Upload as UploadIcon, AlertCircle } from "lucide-react";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";

type EditableTicket = {
  asal: string;
  tujuan: string;
  tanggal: string;
  jam: string;
  coach: string | null;
  seat: string | null;
  kelas: string | null;
  harga: number;
  image: string;
};

export default function EditTicketPage() {
  const { user, loading: authLoading } = useSupabaseAuth();
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState<EditableTicket | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && ticketId) {
      fetch(`/api/tickets/${ticketId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setTicket(data);
          }
        })
        .catch(() => setError("Gagal memuat tiket"))
        .finally(() => setLoading(false));
    }
  }, [user, ticketId]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal update tiket");
      }

      router.push("/my-tickets");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal update tiket";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-kinetic p-12 bg-white shadow-kinetic text-center">
          <p className="text-xl font-black uppercase tracking-tighter">{error || "Tiket tidak ditemukan"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-8 px-4 md:px-8 pb-32">
      <div className="mb-8 border-b-4 border-black pb-6">
        <span className="bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest mb-4 inline-block">
          Edit Manifest
        </span>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Edit Tiket</h1>
        <p className="text-xs font-medium text-gray-500 mt-2">
          Perbarui detail tiket Anda. Biarkan gambar kosong jika tidak ingin mengganti foto.
        </p>
      </div>

      <div className="border-[3px] border-black bg-white p-8 md:p-10 shadow-kinetic">
        <form onSubmit={onSubmit} className="space-y-8">
          {error && (
            <div className="border-[3px] border-[#cc0000] bg-[#fff0f0] p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-[#cc0000]" />
              <span className="text-xs font-black uppercase tracking-widest text-[#cc0000]">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Stasiun Asal
              </label>
              <input name="asal" required type="text" defaultValue={ticket.asal} className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black uppercase" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Stasiun Tujuan
              </label>
              <input name="tujuan" required type="text" defaultValue={ticket.tujuan} className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black uppercase" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Tanggal Keberangkatan
              </label>
              <input name="tanggal" required type="date" defaultValue={ticket.tanggal} className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Clock className="h-3 w-3" /> Jam Keberangkatan
              </label>
              <input name="jam" required type="time" defaultValue={ticket.jam} className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                🚃 Gerbong
              </label>
              <input name="coach" type="text" defaultValue={ticket.coach || ""} placeholder="09" className="w-full border-[2px] border-black p-3 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 ring-black uppercase" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                💺 Kursi
              </label>
              <input name="seat" type="text" defaultValue={ticket.seat || ""} placeholder="42A" className="w-full border-[2px] border-black p-3 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 ring-black uppercase" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                🏷️ Kelas
              </label>
              <select name="kelas" defaultValue={ticket.kelas || ""} className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black uppercase bg-white">
                <option value="">-- Pilih Kelas --</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="Bisnis">Bisnis</option>
                <option value="Eksekutif">Eksekutif</option>
                <option value="Business Premier">Business Premier</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <DollarSign className="h-3 w-3" /> Harga (Rp)
            </label>
            <input name="harga" required type="number" min="0" defaultValue={ticket.harga} className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              🚂 Ganti Foto Tiket (Opsional)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 border-[2px] border-black bg-gray-50 overflow-hidden shrink-0">
                <img src={ticket.image} className="w-full h-full object-cover grayscale" />
              </div>
              <div className="flex-1 border-[3px] border-dashed border-black p-6 text-center cursor-pointer relative hover:bg-gray-50 transition">
                <UploadIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Upload baru (JPG / PNG)</p>
                <input name="image" type="file" accept=".jpg,.jpeg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-black text-white font-black uppercase tracking-widest p-4 text-sm hover:bg-gray-800 transition disabled:opacity-50 shadow-kinetic"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/my-tickets")}
              className="border-[2px] border-black px-6 py-4 text-sm font-black uppercase tracking-widest hover:bg-gray-100 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
