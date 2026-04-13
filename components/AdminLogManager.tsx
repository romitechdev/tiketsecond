"use client";

import { useEffect, useState } from "react";

type AdminLog = {
  id: string;
  action: string;
  targetType: "user" | "ticket" | "system";
  targetId?: string;
  actorEmail: string;
  message: string;
  createdAt: string;
};

export default function AdminLogManager() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLogs() {
    setError("");
    try {
      const res = await fetch("/api/admin/logs", { cache: "no-store" });
      const data = (await res.json()) as { logs?: AdminLog[]; error?: string };
      if (!res.ok) {
        setError(data.error || "Gagal mengambil log");
        return;
      }
      setLogs(data.logs || []);
    } catch {
      setError("Gagal mengambil log");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="border-[3px] border-black bg-white shadow-kinetic p-6 md:p-8">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Activity Log</p>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Aktivitas Web</h2>
        </div>
        <button
          onClick={loadLogs}
          className="border-[2px] border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition"
        >
          Refresh
        </button>
      </div>

      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
        Audit trail immutable: log tidak dapat dihapus.
      </p>

      {error && <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Memuat log...</p>
      ) : logs.length === 0 ? (
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Belum ada aktivitas web tercatat.</p>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
          {logs.map((log) => (
            <div key={log.id} className="border-[2px] border-black p-4 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {new Date(log.createdAt).toLocaleString("id-ID")}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {log.action} • {log.targetType}
                </p>
              </div>
              <p className="text-xs font-semibold text-gray-700 mb-2">{log.message}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                Actor: {log.actorEmail}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Log terkunci</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
