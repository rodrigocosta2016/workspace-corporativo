"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Bell, Settings, LogOut, ChevronDown } from "lucide-react";

export function Topbar({
  userName,
  userRole,
}: {
  userName: string;
  userRole: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const roleLabels: Record<string, string> = {
    super_admin: "Super Administrador",
    admin: "Administrador",
    gestor: "Gestor",
    operador: "Operador",
    leitor: "Leitor",
  };

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-[#E3E5F0] bg-white px-6 py-4">
      <div>
        <h1 className="font-display text-lg font-semibold text-[#14152B]">
          Visão geral
        </h1>
        <p className="text-xs text-[#A6ABC8]">
          {roleLabels[userRole] ?? userRole}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#6B7094] transition hover:bg-[#F7F7FB]"
          aria-label="Notificações"
        >
          <Bell className="h-4.5 w-4.5" strokeWidth={1.75} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#6C5CE7]" />
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7094] transition hover:bg-[#F7F7FB]"
          aria-label="Configurações"
        >
          <Settings className="h-4.5 w-4.5" strokeWidth={1.75} />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-[#F7F7FB]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0EEFE] text-xs font-semibold text-[#6C5CE7]">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-[#14152B]">
              {userName}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[#A6ABC8]" strokeWidth={2} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#E3E5F0] bg-white py-1.5 shadow-lg">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[#DC2626] transition hover:bg-[#FEF2F2]"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
