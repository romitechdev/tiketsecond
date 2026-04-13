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

  const user = (await ensureDbUserFromSupabaseUser(supabaseUser)) ||
    (await db.user.findUnique({
      where: { email: supabaseUser.email || "" },
      select: {
        name: true,
        email: true,
        phone: true,
        image: true,
      },
    }));

  if (!user) {
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
          name={user.name || ""}
          email={user.email || ""}
          phone={user.phone || ""}
          image={user.image || ""}
        />
      </div>
    </div>
  );
}
