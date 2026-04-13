"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

type ProfileFormProps = {
  name: string;
  email: string;
  phone: string;
  image: string;
};

export default function ProfileForm({ name, email, phone, image }: ProfileFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [phoneValue, setPhoneValue] = useState(phone);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("phone", phoneValue);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });

      const data = (await res.json()) as { error?: string; message?: string };

      if (!res.ok) {
        const message = data.error || "Gagal memperbarui profil";
        setError(message);
        showToast(message, "error");
        setSaving(false);
        return;
      }

      const message = data.message || "Profil berhasil diperbarui";
      setSuccess(message);
      showToast(message, "success");
      router.refresh();
    } catch {
      const message = "Terjadi kesalahan jaringan";
      setError(message);
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest">Foto Profil (JPG/PNG, Max 2MB)</label>
        {image && (
          <div className="w-24 h-24 border-[2px] border-black overflow-hidden bg-gray-100 mb-2">
            <img src={image} alt="Foto profil saat ini" className="w-full h-full object-cover" />
          </div>
        )}
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black bg-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest">Full Name</label>
        <input
          disabled
          value={name}
          className="w-full border-[2px] border-black p-3 text-sm font-bold bg-gray-100 text-gray-500"
        />
        <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
          Full name tidak bisa diubah setelah onboarding.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest">Email</label>
        <input
          disabled
          value={email}
          className="w-full border-[2px] border-black p-3 text-sm font-bold bg-gray-100 text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest">Nomor Telepon</label>
        <input
          required
          value={phoneValue}
          onChange={(e) => setPhoneValue(e.target.value)}
          className="w-full border-[2px] border-black p-3 text-sm font-bold focus:outline-none focus:ring-2 ring-black"
          placeholder="Contoh: 081234567890"
        />
      </div>

      {error && <p className="text-xs font-black text-red-600 uppercase tracking-widest">{error}</p>}
      {success && <p className="text-xs font-black text-green-700 uppercase tracking-widest">{success}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-kinetic disabled:opacity-50"
      >
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
