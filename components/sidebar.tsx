"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Home,
  Building2,
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Workspace", icon: Home },
  { href: "/dashboard/empresas", label: "Empresas", icon: Building2, superAdminOnly: true },
  { href: "/dashboard/usuarios", label: "Usuários", icon: Users },
  { href: "/dashboard/permissoes", label: "Permissões", icon: ShieldCheck },
  { href: "/dashboard/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col border-r border-[#E3E5F0] bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C5CE7]">
          <LayoutGrid className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
        </div>
        <span className="text-[#14152B] font-semibold text-sm font-display">
          Workspace Corporativo
        </span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems
          .filter((item) => !item.superAdminOnly || isSuperAdmin)
          .map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#F0EEFE] text-[#6C5CE7]"
                    : "text-[#6B7094] hover:bg-[#F7F7FB] hover:text-[#14152B]"
                }`}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="px-3 py-4 border-t border-[#E3E5F0]">
        <p className="px-3 text-xs text-[#A6ABC8]">
          © {new Date().getFullYear()} Workspace Corporativo
        </p>
      </div>
    </aside>
  );
}
