"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

type OnboardingFormProps = {
  initialName: string;
  initialPhone: string;
};

export default function OnboardingForm({ initialName, initialPhone }: OnboardingFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        const message = data.error || "Gagal menyimpan onboarding";
        setError(message);
        showToast(message, "error");
        setSaving(false);
        return;
      }

      showToast("Onboarding berhasil disimpan", "success");
      router.push("/");
      router.refresh();
    } catch {
      const message = "Terjadi kesalahan jaringan";
      setError(message);
      showToast(message, "error");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-[3px] border-red-600 bg-[#fff5f5] p-4 text-[10px] font-black uppercase tracking-widest text-red-700">
        Perhatian: Full name hanya bisa diubah sekali saat onboarding ini.
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest">Full Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black"
          placeholder="Nama lengkap"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest">Nomor Telepon</label>
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black"
          placeholder="Contoh: 081234567890"
        />
      </div>

      {error && <p className="text-xs font-black text-red-600 uppercase tracking-widest">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-kinetic disabled:opacity-50"
      >
        {saving ? "Menyimpan..." : "Simpan Dan Lanjut"}
      </button>
    </form>
  );
}
