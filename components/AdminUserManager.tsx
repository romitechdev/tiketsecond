"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ToastProvider";

type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  _count: {
    tickets: number;
  };
};

export default function AdminUserManager() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  async function loadUsers() {
    setError("");
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = (await res.json()) as { users?: AdminUser[]; error?: string };
      if (!res.ok) {
        const message = data.error || "Gagal mengambil data user";
        setError(message);
        showToast(message, "error");
        return;
      }
      setUsers(data.users || []);
    } catch {
      const message = "Gagal mengambil data user";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleDelete(user: AdminUser) {
    if (
      !confirm(
        `Anda yakin ingin menghapus user ${user.email || user.name || user.id}?\n\nAksi ini akan menghapus akun dan data terkait milik user tersebut secara permanen.`
      )
    )
      return;

    setDeletingId(user.id);
    setError("");

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        const message = data.error || "Gagal menghapus user";
        setError(message);
        showToast(message, "error");
        setDeletingId("");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      showToast("User berhasil dihapus", "success");
    } catch {
      const message = "Gagal menghapus user";
      setError(message);
      showToast(message, "error");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="border-[3px] border-black bg-white shadow-kinetic p-6 md:p-8">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">User Management</p>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Kelola User</h2>
        </div>
        <button
          onClick={loadUsers}
          className="border-[2px] border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition"
        >
          Refresh
        </button>
      </div>

      {error && <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Memuat data user...</p>
      ) : users.length === 0 ? (
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Belum ada user.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-black text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="py-3 pr-4">Nama</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">No. Telepon</th>
                <th className="py-3 pr-4">Listing</th>
                <th className="py-3 pr-4">Bergabung</th>
                <th className="py-3 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 text-sm font-semibold">
                  <td className="py-3 pr-4 uppercase tracking-wide">{user.name || "Tanpa Nama"}</td>
                  <td className="py-3 pr-4 text-xs">{user.email || "Tanpa Email"}</td>
                  <td className="py-3 pr-4 text-xs">{user.phone || "-"}</td>
                  <td className="py-3 pr-4 text-xs">{user._count.tickets}</td>
                  <td className="py-3 pr-4 text-xs">{new Date(user.createdAt).toLocaleDateString("id-ID")}</td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={deletingId === user.id}
                      className="border-[2px] border-red-600 text-red-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {deletingId === user.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
