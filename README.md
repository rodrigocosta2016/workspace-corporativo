# Workspace Corporativo

Portal de acesso (SSO interno) para a plataforma SaaS multiempresas — tela de login.

## Stack

- Next.js 15 (App Router)
- React + TypeScript
- Tailwind CSS
- Lucide Icons
- Supabase Auth (`@supabase/ssr`)

## Como rodar

```bash
npm install
cp .env.example .env.local
# preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Acesse `http://localhost:3000` — você será redirecionado para `/login`.

## Estrutura

```
app/
  layout.tsx        # layout raiz, fontes Inter (corpo) e Sora (display)
  globals.css       # tema, import de fontes
  page.tsx          # redireciona para /login
  login/
    page.tsx        # tela de login (split-screen)
lib/
  supabase/
    client.ts       # cliente Supabase para o browser
.env.example         # variáveis de ambiente do Supabase
```

## Design

- Painel esquerdo: institucional, com visual de "hub" — ícones de módulos
  orbitando um nó central, representando o conceito de portal único.
- Painel direito: formulário de login (e-mail, senha, lembrar-me, SSO com
  Microsoft/Google, link para SSO da empresa).
- Paleta: índigo `#1B1F3B` / `#14152B`, accent violeta `#6C5CE7`, fundo
  `#F7F7FB`.
- Tipografia: Sora (títulos) + Inter (corpo).

## Próximos passos

- Conectar `signInWithPassword` ao schema RBAC (companies, users, modules,
  permissions) descrito no prompt original.
- Implementar redirecionamento por perfil (Super Admin / Admin da Empresa /
  Usuário Comum) após login.
- Middleware de proteção de rotas via `@supabase/ssr` (server-side).
