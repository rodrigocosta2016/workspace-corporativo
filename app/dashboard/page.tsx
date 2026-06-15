import { createClient } from "@/lib/supabase/server";
import {
  Building2,
  ClipboardCheck,
  BarChart3,
  Target,
  Package,
  Truck,
  PieChart,
  Shield,
  FileText,
  Calendar,
  ArrowUpRight,
  Users,
  Activity,
  Boxes,
  Ban,
} from "lucide-react";

const moduleIcons: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  building: Building2,
  "clipboard-check": ClipboardCheck,
  "bar-chart-3": BarChart3,
  target: Target,
  package: Package,
  truck: Truck,
  "pie-chart": PieChart,
  shield: Shield,
  "file-text": FileText,
  calendar: Calendar,
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("name, company_id, role")
    .eq("id", authData.user?.id ?? "")
    .single();

  const isSuperAdmin = profile?.role === "super_admin";

  // Módulos habilitados para a empresa do usuário
  const { data: companyModules } = await supabase
    .from("company_modules")
    .select("active, modules(id, name, description, icon, route)")
    .eq("company_id", profile?.company_id ?? "")
    .eq("active", true);

  const modules =
    companyModules?.map((cm) => cm.modules).filter(Boolean).flat() ?? [];

  // Indicadores executivos (apenas Super Admin)
  let stats = {
    activeCompanies: 0,
    activeUsers: 0,
    loginsToday: 0,
    blockedCompanies: 0,
  };

  if (isSuperAdmin) {
    const [companiesRes, usersRes, blockedRes] = await Promise.all([
      supabase.from("companies").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("companies").select("id", { count: "exact", head: true }).eq("status", "suspended"),
    ]);

    stats = {
      activeCompanies: companiesRes.count ?? 0,
      activeUsers: usersRes.count ?? 0,
      loginsToday: 0,
      blockedCompanies: blockedRes.count ?? 0,
    };
  }

  return (
    <div className="space-y-8">
      {/* Saudação */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-[#14152B]">
          Olá, {profile?.name ?? "bem-vindo"} 👋
        </h2>
        <p className="mt-1 text-sm text-[#6B7094]">
          Aqui está um resumo do seu workspace hoje.
        </p>
      </div>

      {/* Indicadores executivos — Super Admin */}
      {isSuperAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Building2}
            label="Empresas ativas"
            value={stats.activeCompanies}
          />
          <StatCard
            icon={Users}
            label="Usuários ativos"
            value={stats.activeUsers}
          />
          <StatCard
            icon={Activity}
            label="Logins hoje"
            value={stats.loginsToday}
          />
          <StatCard
            icon={Ban}
            label="Empresas bloqueadas"
            value={stats.blockedCompanies}
          />
        </div>
      )}

      {/* Central de Aplicações */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-[#14152B]">
              Meus Sistemas
            </h3>
            <p className="text-sm text-[#6B7094]">
              Acesse os módulos liberados para sua empresa.
            </p>
          </div>
        </div>

        {modules.length === 0 ? (
          <EmptyModulesState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {modules.map((mod: any) => {
              const Icon = moduleIcons[mod.icon as string] ?? Boxes;
              return (
                <a
                  key={mod.id}
                  href={mod.route}
                  className="group flex flex-col gap-3 rounded-2xl border border-[#E3E5F0] bg-white p-5 transition hover:border-[#6C5CE7]/40 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EEFE]">
                      <Icon className="h-5 w-5 text-[#6C5CE7]" strokeWidth={2} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#A6ABC8] transition group-hover:text-[#6C5CE7]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#14152B]">{mod.name}</p>
                    <p className="mt-1 text-xs text-[#6B7094] line-clamp-2">
                      {mod.description}
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EAF3DE] px-2.5 py-1 text-xs font-medium text-[#27500A]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#639922]" />
                    Ativo
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-[#E3E5F0] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#6B7094]">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0EEFE]">
          <Icon className="h-4 w-4 text-[#6C5CE7]" strokeWidth={2} />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-[#14152B]">
        {value}
      </p>
    </div>
  );
}

function EmptyModulesState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E3E5F0] bg-white px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EEFE]">
        <Boxes className="h-6 w-6 text-[#6C5CE7]" strokeWidth={2} />
      </div>
      <p className="mt-4 font-medium text-sm text-[#14152B]">
        Nenhum sistema liberado ainda
      </p>
      <p className="mt-1 max-w-sm text-sm text-[#6B7094]">
        Fale com o administrador da sua empresa para liberar acesso aos
        módulos do workspace.
      </p>
    </div>
  );
}
