"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthContextValue = {
  session: Session | null;
  user: Session["user"] | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useSupabaseAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useSupabaseAuth must be used inside SupabaseAuthProvider");
  }
  return ctx;
}

export default function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const value = useMemo(
    () => ({ session, user: session?.user || null, loading, signOut }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
