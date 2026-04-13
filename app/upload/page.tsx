"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Train, Calendar, Clock, DollarSign, MapPin, Upload as UploadIcon, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";

export default function UploadPage() {
  const { user, loading: authLoading } = useSupabaseAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest">Mengautentifikasi...</p>
        </div>
      </div>
    );
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal upload tiket");
      }

      setSuccess(true);
      showToast("Tiket berhasil diposting", "success");
      
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal upload tiket";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto pt-8 px-4 md:px-8 pb-32">
      <div className="mb-8 border-b-4 border-black pb-6">
        <span className="bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest mb-4 inline-block">
          Publikasikan Manifest
        </span>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Jual Tiket Kereta</h1>
        <p className="text-xs font-medium text-gray-500 mt-2">
          Masukkan detail perjalanan dengan akurat. Pengguna akan menghubungi Anda via WhatsApp jika berminat.
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

          {success && (
            <div className="border-[3px] border-[#00aa00] bg-[#f0fff0] p-4 flex items-center gap-3 animate-pulse">
              <div className="h-6 w-6 rounded-full bg-[#00aa00] flex items-center justify-center shrink-0">
                <span className="text-white font-black text-sm">✓</span>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#00aa00]">Tiket berhasil diposting! Mengalihkan...</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Stasiun Asal
              </label>
              <input name="asal" required type="text" placeholder="GAMBIR (GMR)" className="w-full border-[2px] border-black p-3 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 ring-black uppercase" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Stasiun Tujuan
              </label>
              <input name="tujuan" required type="text" placeholder="BANDUNG (BD)" className="w-full border-[2px] border-black p-3 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 ring-black uppercase" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Tanggal Keberangkatan
              </label>
              <input name="tanggal" required type="date" className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Clock className="h-3 w-3" /> Jam Keberangkatan
              </label>
              <input name="jam" required type="time" className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                🚃 Gerbong
              </label>
              <input name="coach" type="text" placeholder="09" className="w-full border-[2px] border-black p-3 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 ring-black uppercase" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                💺 Kursi
              </label>
              <input name="seat" type="text" placeholder="42A" className="w-full border-[2px] border-black p-3 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 ring-black uppercase" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                🏷️ Kelas
              </label>
              <select name="kelas" className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black uppercase bg-white">
                <option value="">-- Pilih Kelas --</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="Bisnis">Bisnis</option>
                <option value="Eksekutif">Eksekutif</option>
                <option value="Business Premier">Business Premier</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <DollarSign className="h-3 w-3" /> Harga Sesuai Tiket Asli (Rp)
              </label>
              <input name="harga" required type="number" min="0" placeholder="150000" className="w-full border-[2px] border-black p-3 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 ring-black" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                📱 Nomor WhatsApp
              </label>
              <input name="phone" required type="tel" placeholder="08123456789" className="w-full border-[2px] border-black p-3 text-sm font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 ring-black" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              🚂 Bukti Tiket (Max 2MB)
            </label>
            {preview && (
              <div className="border-[3px] border-green-500 bg-green-50 p-4 rounded mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-700">✓ Preview Gambar</span>
                </div>
                <img src={preview} alt="Preview tiket" className="w-full max-h-64 object-contain rounded border-[2px] border-green-500" />
              </div>
            )}
            <div className="border-[3px] border-dashed border-black p-10 text-center cursor-pointer relative hover:bg-gray-50 transition">
              <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <div className="text-xs font-bold">
                <span className="font-black uppercase tracking-widest">Klik untuk upload</span>
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2">Hanya JPG / PNG</p>
              <input name="image" required type="file" accept=".jpg,.jpeg,.png" onChange={onFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-black text-white font-black uppercase tracking-widest p-4 text-sm hover:bg-gray-800 transition disabled:opacity-50 shadow-kinetic"
          >
            {success ? "✓ Tiket Berhasil Diposting" : loading ? "Menyimpan Info Tiket..." : "Posting Tiket ke Marketplace"}
          </button>
        </form>
      </div>
    </div>
  );
}
