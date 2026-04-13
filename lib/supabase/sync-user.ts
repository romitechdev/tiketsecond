import { supabaseAdmin } from "@/lib/supabase/admin";

type SyncSupabaseUserProfileInput = {
  name?: string | null;
  phone?: string | null;
  image?: string | null;
};

export async function syncSupabaseUserProfile(
  userId: string,
  currentMetadata: Record<string, unknown>,
  updates: SyncSupabaseUserProfileInput
) {
  const nextMetadata = {
    ...currentMetadata,
    ...(updates.name !== undefined ? { name: updates.name } : {}),
    ...(updates.name !== undefined ? { full_name: updates.name } : {}),
    ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
    ...(updates.image !== undefined ? { avatar_url: updates.image } : {}),
  };

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: nextMetadata,
  });

  if (error) {
    throw new Error(error.message);
  }
}