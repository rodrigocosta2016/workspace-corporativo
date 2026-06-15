"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight, LayoutGrid } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Preencha nome, e-mail e senha para continuar.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            surname,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Não foi possível criar a conta. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F7FB] px-6 font-sans">
        <div className="w-full max-w-[420px] rounded-2xl border border-[#E3E5F0] bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3DE]">
            <LayoutGrid className="h-6 w-6 text-[#27500A]" strokeWidth={2} />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-[#14152B]">
            Conta criada com sucesso
          </h2>
          <p className="mt-2 text-sm text-[#6B7094]">
            Se a confirmação por e-mail estiver habilitada no seu projeto
            Supabase, verifique sua caixa de entrada antes de entrar.
            Caso contrário, já pode acessar com seu e-mail e senha.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#14152B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#23264A]"
          >
            Ir para o login
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F7FB] px-6 font-sans">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C5CE7]">
            <LayoutGrid className="h-5 w-5 text-white" strokeWidth={2.25} />
          </div>
          <span className="font-display font-semibold text-[1.05rem] text-[#14152B] tracking-tight">
            Workspace Corporativo
          </span>
        </div>

        <div className="rounded-2xl border border-[#E3E5F0] bg-white p-8">
          <h2 className="font-display text-[1.75rem] font-semibold text-[#14152B] tracking-tight">
            Criar conta
          </h2>
          <p className="mt-2 text-sm text-[#6B7094]">
            Crie sua conta para acessar o workspace.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#14152B] mb-1.5">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#E3E5F0] bg-white px-4 py-2.5 text-sm text-[#14152B] placeholder:text-[#A6ABC8] outline-none transition focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                />
              </div>
              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-[#14152B] mb-1.5">
                  Sobrenome
                </label>
                <input
                  id="surname"
                  type="text"
                  placeholder="Seu sobrenome"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full rounded-xl border border-[#E3E5F0] bg-white px-4 py-2.5 text-sm text-[#14152B] placeholder:text-[#A6ABC8] outline-none transition focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#14152B] mb-1.5">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#14152B] mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo de 6 caracteres"
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

            {error && (
              <div className="rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] px-4 py-2.5 text-sm text-[#DC2626]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#14152B] px-4 py-2.75 text-sm font-semibold text-white transition hover:bg-[#23264A] disabled:opacity-60"
            >
              {loading ? "Criando conta..." : "Criar conta"}
              {!loading && (
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2} />
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B7094]">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium text-[#6C5CE7] hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
