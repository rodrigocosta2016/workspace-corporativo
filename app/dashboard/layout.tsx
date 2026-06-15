import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("name, surname, role, company_id")
    .eq("id", authData.user.id)
    .single();

  const userName = profile
    ? `${profile.name}${profile.surname ? " " + profile.surname : ""}`
    : authData.user.email ?? "Usuário";

  const userRole = profile?.role ?? "leitor";
  const isSuperAdmin = userRole === "super_admin";

  return (
    <div className="flex min-h-screen bg-[#F7F7FB]">
      <Sidebar isSuperAdmin={isSuperAdmin} />
      <div className="flex flex-1 flex-col">
        <Topbar userName={userName} userRole={userRole} />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
