"use client";

import ToastProvider from "@/components/ToastProvider";
import SupabaseAuthProvider from "@/components/SupabaseAuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </SupabaseAuthProvider>
  );
}
