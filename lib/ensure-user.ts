import type { User } from "@supabase/supabase-js";
import db from "@/lib/db";

export async function ensureDbUserFromSupabaseUser(supabaseUser: User) {
  if (!supabaseUser.email) {
    return null;
  }

  return db.user.upsert({
    where: { email: supabaseUser.email },
    create: {
      email: supabaseUser.email,
      name:
        (supabaseUser.user_metadata?.full_name as string | undefined) ||
        (supabaseUser.user_metadata?.name as string | undefined) ||
        supabaseUser.email,
      image: (supabaseUser.user_metadata?.avatar_url as string | undefined) || null,
    },
    update: {},
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      createdAt: true,
    },
  });
}