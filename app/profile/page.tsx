import { redirect } from "next/navigation";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { ensureDbUserFromSupabaseUser } from "@/lib/ensure-user";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const supabaseUser = await getCurrentUser();

  if (!supabaseUser) {
    redirect("/login");
  }

  let user: {
    name: string | null;
    email: string | null;
    phone: string | null;
    image: string | null;
  } | null = null;

  try {
    user = await db.user.findUnique({
      where: { email: supabaseUser.email || "" },
      select: {
        name: true,
        email: true,
        phone: true,
        image: true,
      },
    });

    if (!user) {
      user = await ensureDbUserFromSupabaseUser(supabaseUser);
    }
  } catch (error) {
    console.error("Profile page failed to load DB user", error);
  }

  const fallbackUser = {
    name:
      (supabaseUser.user_metadata?.full_name as string | undefined) ||
      (supabaseUser.user_metadata?.name as string | undefined) ||
      supabaseUser.email ||
      null,
    email: supabaseUser.email || null,
    phone: null,
    image: (supabaseUser.user_metadata?.avatar_url as string | undefined) || null,
  };

  const resolvedUser = user || fallbackUser;

  if (!resolvedUser.email) {
    redirect("/login");
  }

  return (
    <div className="max-w-[700px] mx-auto pt-12 px-4 md:px-8 pb-32">
      <div className="border-[3px] border-black bg-white p-8 md:p-10 shadow-kinetic">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-3">
          Edit Profile
        </h1>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-8">
          Ubah foto profil dan nomor telepon Anda.
        </p>

        <ProfileForm
          name={resolvedUser.name || ""}
          email={resolvedUser.email || ""}
          phone={resolvedUser.phone || ""}
          image={resolvedUser.image || ""}
        />
      </div>
    </div>
  );
}
