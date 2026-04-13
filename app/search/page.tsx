import Link from "next/link";
import db from "@/lib/db";
import { ChevronLeft, Search } from "lucide-react";
import { Prisma } from "@prisma/client";

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ asal?: string; tujuan?: string; kelas?: string }>;
}) {
  const params = await searchParams;
  const asal = params.asal?.toUpperCase() || "";
  const tujuan = params.tujuan?.toUpperCase() || "";
  const kelas = params.kelas || "";

  const today = new Date().toISOString().split("T")[0];
  let results: Awaited<ReturnType<typeof db.ticket.findMany>> = [];

  try {
    await db.ticket.deleteMany({
      where: { tanggal: { lt: today }, status: "available" },
    });

    const where: Prisma.TicketWhereInput = {
      status: "available",
      ...(asal && { asal: { contains: asal } }),
      ...(tujuan && { tujuan: { contains: tujuan } }),
      ...(kelas && { kelas }),
    };

    results = await db.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, image: true } },
      },
    });
  } catch {
    results = [];
  }

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  return (
    <div className="space-y-8 mt-8 p-4 md:p-8">
      {/* Search Bar */}
      <div className="border-[3px] border-black bg-white p-8 shadow-kinetic">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:opacity-60 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>

        <form method="GET" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 block">
                Stasiun Asal
              </label>
              <input
                type="text"
                name="asal"
                placeholder="contoh: GAMBIR"
                defaultValue={asal}
                className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black uppercase"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 block">
                Stasiun Tujuan
              </label>
              <input
                type="text"
                name="tujuan"
                placeholder="contoh: BANDUNG"
                defaultValue={tujuan}
                className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black uppercase"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 block">
                Kelas Tiket
              </label>
              <select
                name="kelas"
                defaultValue={kelas}
                className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black uppercase bg-white"
              >
                <option value="">-- Semua Kelas --</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="Bisnis">Bisnis</option>
                <option value="Eksekutif">Eksekutif</option>
                <option value="Business Premier">Business Premier</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-kinetic"
            >
              <Search className="w-4 h-4" />
              Cari Tiket
            </button>
            <Link
              href="/search"
              className="border-[2px] border-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
          Hasil Pencarian
        </h1>
        <p className="text-xs font-semibold text-gray-600">
          {asal || tujuan || kelas
            ? `Mencari: ${[asal && `Asal: ${asal}`, tujuan && `Tujuan: ${tujuan}`, kelas && `Kelas: ${kelas}`]
                .filter(Boolean)
                .join(" • ")}`
            : "Semua tiket tersedia"}
        </p>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="border-kinetic p-16 text-center bg-white shadow-kinetic-lg max-w-2xl mx-auto my-16">
          <div className="text-4xl font-black uppercase tracking-tighter mb-4">
            Tiket Tidak Ditemukan
          </div>
          <p className="text-sm font-medium opacity-70 mb-8">
            Tidak ada tiket yang sesuai dengan kriteria pencarian Anda.
          </p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {results.map((t) => (
            <div
              key={t.id}
              className="border-[3px] border-black bg-white shadow-kinetic p-6 lg:p-8 flex flex-col group hover:-translate-y-1 hover:shadow-kinetic-lg transition-all duration-200"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-black">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                  Express-{t.id.substring(t.id.length - 3)}
                </span>
                <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-1">
                  {t.kelas || "N/A"}
                </span>
              </div>

              <h3 className="text-[1.75rem] font-black uppercase tracking-tighter leading-[1.1] mb-8">
                {t.asal} <br />
                <span className="opacity-30">→</span>
                <br /> {t.tujuan}
              </h3>

              <div className="space-y-4 mb-10 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 border-[2px] border-black"></div>
                  {months[parseInt(t.tanggal.split("-")[1]) - 1] || "N/A"}{" "}
                  {t.tanggal.split("-")[2] || "01"}, {t.tanggal.split("-")[0] || "2024"}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full border-[2px] border-black"></div>
                  {t.jam} <span className="opacity-40 ml-1">→ Perkiraan</span>
                </div>
              </div>

              <div className="mt-auto border-t-2 border-black pt-5 flex items-end justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                    Harga Standar
                  </span>
                  <span className="text-2xl font-black tracking-tighter">
                    Rp {t.harga.toLocaleString("id-ID")}
                  </span>
                </div>
                <Link
                  href={`/ticket/${t.id}`}
                  className="bg-black text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-sm"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
