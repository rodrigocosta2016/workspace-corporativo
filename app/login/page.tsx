"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Eye,
  EyeOff,
  ArrowRight,
  LayoutGrid,
  ShieldCheck,
  Building2,
  Users,
  BarChart3,
  FileText,
  Truck,
  Calendar,
  ClipboardCheck,
  Package,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Informe e-mail e senha para continuar.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("E-mail ou senha incorretos. Tente novamente.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Não foi possível entrar. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  const modules = [
    { icon: Building2, label: "Obras" },
    { icon: ClipboardCheck, label: "Auditoria" },
    { icon: BarChart3, label: "Comercial" },
    { icon: Package, label: "Almoxarifado" },
    { icon: Truck, label: "Frota" },
    { icon: FileText, label: "Documentos" },
    { icon: Calendar, label: "Agenda" },
    { icon: Users, label: "Pessoas" },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#F7F7FB] font-sans">
      {/* LADO ESQUERDO — Institucional / Hub visual */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden bg-[#14152B]">
        {/* Fundo gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B1F3B] via-[#23264A] to-[#3A2E6E]" />

        {/* Glow accent */}
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#6C5CE7]/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-[#00D2D3]/15 blur-[140px]" />

        <div className="relative z-10 flex flex-col justify-between w-full px-14 py-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C5CE7]">
              <LayoutGrid className="h-5 w-5 text-white" strokeWidth={2.25} />
            </div>
            <span className="text-white font-semibold text-[1.05rem] tracking-tight font-display">
              Workspace Corporativo
            </span>
          </div>

          {/* Conteúdo central */}
          <div className="max-w-md">
            <p className="text-[#A5B4FC] text-sm font-medium tracking-wide uppercase mb-4 font-display">
              Um único acesso. Todos os sistemas.
            </p>
            <h1 className="text-white font-display text-[2.75rem] leading-[1.1] font-semibold tracking-tight">
              O hub central da
              <br />
              sua operação.
            </h1>
            <p className="mt-5 text-[#C7CBE8] text-base leading-relaxed">
              Acesse obras, comercial, frota, almoxarifado e mais — tudo
              dentro de um único login, com permissões e dados isolados por
              empresa.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Login único para todos os módulos contratados",
                "Permissões por usuário com isolamento total por empresa",
                "Auditoria completa de acessos e alterações",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#E4E6FA] text-sm">
                  <ShieldCheck className="h-4.5 w-4.5 mt-0.5 text-[#6C5CE7] flex-shrink-0" strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hub visual — módulos convergindo para o centro */}
          <div className="relative h-56 flex items-center justify-center">
            <div className="absolute h-44 w-44 rounded-full border border-white/10" />
            <div className="absolute h-72 w-72 rounded-full border border-white/[0.06]" />

            {/* Nó central */}
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6C5CE7] shadow-[0_0_40px_rgba(108,92,231,0.55)]">
              <LayoutGrid className="h-6 w-6 text-white" strokeWidth={2.25} />
            </div>

            {/* Módulos orbitando */}
            {modules.map((m, i) => {
              const angle = (i / modules.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 112;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="absolute flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  title={m.label}
                >
                  <Icon className="h-4.5 w-4.5 text-[#C7CBE8]" strokeWidth={2} />
                </div>
              );
            })}
          </div>

          <p className="text-[#7C82AD] text-xs">
            © {new Date().getFullYear()} Workspace Corporativo. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* LADO DIREITO — Formulário */}
      <div className="flex flex-1 flex-col">
        {/* Header mobile/topo */}
        <div className="flex items-center justify-between px-6 sm:px-12 py-6">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C5CE7]">
              <LayoutGrid className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
            </div>
            <span className="text-[#14152B] font-semibold text-sm font-display">
              Workspace Corporativo
            </span>
          </div>
          <div className="ml-auto text-sm text-[#6B7094]">
            Precisa de ajuda?{" "}
            <a href="#" className="text-[#6C5CE7] font-medium hover:underline">
              Fale com o suporte
            </a>
          </div>
        </div>

        {/* Formulário centralizado */}
        <div className="flex flex-1 items-center justify-center px-6 sm:px-12 py-8">
          <div className="w-full max-w-[400px]">
            <h2 className="font-display text-[1.75rem] font-semibold text-[#14152B] tracking-tight">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-sm text-[#6B7094]">
              Entre com sua conta para acessar o workspace.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* E-mail */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#14152B] mb-1.5"
                >
                  E-mail corporativo
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E3E5F0] bg-white px-4 py-2.5 text-sm text-[#14152B] placeholder:text-[#A6ABC8] outline-none transition focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                />
              </div>

              {/* Senha */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#14152B]"
                  >
                    Senha
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-[#6C5CE7] hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#E3E5F0] bg-white px-4 py-2.5 pr-11 text-sm text-[#14152B] placeholder:text-[#A6ABC8] outline-none transition focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6ABC8] hover:text-[#6B7094] transition"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" strokeWidth={1.75} />
                    ) : (
                      <Eye className="h-4.5 w-4.5" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
              </div>

              {/* Lembrar-me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded-md border-[#E3E5F0] text-[#6C5CE7] focus:ring-[#6C5CE7]/30"
                />
                <span className="text-sm text-[#6B7094]">
                  Manter conectado por 14 dias
                </span>
              </label>

              {/* Erro */}
              {error && (
                <div className="rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] px-4 py-2.5 text-sm text-[#DC2626]">
                  {error}
                </div>
              )}

              {/* Botão principal */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#14152B] px-4 py-2.75 text-sm font-semibold text-white transition hover:bg-[#23264A] disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
                {!loading && (
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2} />
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E3E5F0]" />
              <span className="text-xs text-[#A6ABC8]">ou continue com</span>
              <div className="h-px flex-1 bg-[#E3E5F0]" />
            </div>

            {/* SSO */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E3E5F0] bg-white px-4 py-2.5 text-sm font-medium text-[#14152B] transition hover:bg-[#F7F7FB]"
              >
                <MicrosoftIcon />
                Microsoft
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E3E5F0] bg-white px-4 py-2.5 text-sm font-medium text-[#14152B] transition hover:bg-[#F7F7FB]"
              >
                <GoogleIcon />
                Google
              </button>
            </div>

            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E3E5F0] px-4 py-2.5 text-sm font-medium text-[#6B7094] transition hover:border-[#6C5CE7]/40 hover:text-[#6C5CE7]"
            >
              <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
              Entrar com SSO da empresa
            </button>

            <p className="mt-6 text-center text-sm text-[#6B7094]">
              Ainda não tem uma conta?{" "}
              <Link href="/signup" className="font-medium text-[#6C5CE7] hover:underline">
                Criar conta
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-[#A6ABC8]">
              Ao continuar, você concorda com os{" "}
              <a href="#" className="text-[#6B7094] hover:underline">
                Termos de Uso
              </a>{" "}
              e a{" "}
              <a href="#" className="text-[#6B7094] hover:underline">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="0" y="0" width="7" height="7" fill="#F25022" />
      <rect x="9" y="0" width="7" height="7" fill="#7FBA00" />
      <rect x="0" y="9" width="7" height="7" fill="#00A4EF" />
      <rect x="9" y="9" width="7" height="7" fill="#FFB900" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.96 4 4 12.96 4 24s8.96 20 20 20 20-8.96 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.5 35 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.6 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3 5.3-5.6 6.9l6.5 5.5C39.9 37.1 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}
