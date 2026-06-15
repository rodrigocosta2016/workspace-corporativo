# Banco de dados — Workspace Corporativo

## Como aplicar as migrations

No painel do Supabase (SQL Editor), execute na ordem:

1. `migrations/0001_schema.sql` — cria enums, tabelas, índices, triggers e
   popula o catálogo de módulos ("Meus Sistemas").
2. `migrations/0002_rls.sql` — habilita Row Level Security e cria as
   policies de isolamento multi-tenant + RBAC.
3. `migrations/0003_auth_sync.sql` — sincroniza `auth.users` com
   `public.users` automaticamente no cadastro.

Ou, via CLI do Supabase:

```bash
supabase db push
```

## Modelo de dados

- **companies** — empresas (tenants). Campos: razão social, nome fantasia,
  CNPJ, contato, plano, status, limites de usuários/módulos.
- **users** — perfil estendido de cada usuário, vinculado 1:1 a
  `auth.users` e a uma `company_id`. Papéis: `super_admin`, `admin`,
  `gestor`, `operador`, `leitor`.
- **modules** — catálogo global de sistemas do hub (Obras, Auditoria,
  Comercial, Frota, etc).
- **company_modules** — relação N:N entre empresas e módulos habilitados.
- **permissions** — RBAC granular por usuário e módulo (visualizar, criar,
  editar, excluir, exportar, administrar).
- **audit_logs** — trilha de auditoria imutável (login, logout, criação,
  edição, exclusão, troca de permissões/senha/plano).

## Isolamento multi-tenant (RLS)

Toda consulta é filtrada por `company_id` através de funções auxiliares
`security definer`:

- `current_company_id()` — empresa do usuário autenticado
- `current_user_role()` — papel do usuário autenticado
- `is_super_admin()` — true se o usuário for super admin
- `is_company_admin()` — true se for admin (ou super admin) da empresa

Essas funções evitam recursão infinita nas policies de `public.users` e
concentram a lógica de autorização em um único lugar.

## Primeiro Super Admin

Como o trigger `handle_new_auth_user` cria usuários novos como `leitor`
sem empresa, o primeiro Super Admin precisa ser promovido manualmente
após o cadastro:

```sql
update public.users
set role = 'super_admin', company_id = null
where email = 'seu-email@empresa.com';
```

## Criando a primeira empresa e vinculando usuários

```sql
insert into public.companies (name, trade_name, plan, status)
values ('Minha Empresa LTDA', 'Minha Empresa', 'pro', 'active')
returning id;

-- depois, vincule o usuário à empresa retornada acima:
update public.users
set company_id = '<id-da-empresa>', role = 'admin'
where email = 'admin@minhaempresa.com';
```

## Habilitando módulos para uma empresa

```sql
insert into public.company_modules (company_id, module_id, active)
select '<id-da-empresa>', id, true
from public.modules
where name in ('Obras', 'Comercial', 'Documentos');
```
