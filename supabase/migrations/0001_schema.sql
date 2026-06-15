-- ============================================================
-- WORKSPACE CORPORATIVO — SCHEMA INICIAL
-- Multiempresas (multi-tenant) com isolamento por company_id
-- ============================================================

-- ------------------------------------------------------------
-- EXTENSÕES
-- ------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
create type company_status as enum ('active', 'suspended', 'cancelled');
create type company_plan as enum ('free', 'starter', 'pro', 'enterprise');
create type user_status as enum ('active', 'inactive', 'pending');
create type user_role as enum ('super_admin', 'admin', 'gestor', 'operador', 'leitor');
create type audit_action as enum (
  'login', 'logout', 'create', 'update', 'delete',
  'permission_change', 'password_change', 'plan_change'
);

-- ------------------------------------------------------------
-- TABELA: companies
-- ------------------------------------------------------------
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,                 -- Razão Social
  trade_name text,                    -- Nome Fantasia
  cnpj text unique,
  address text,
  city text,
  state text,
  phone text,
  email text,
  logo_url text,
  plan company_plan not null default 'free',
  status company_status not null default 'active',
  max_users integer not null default 5,
  max_modules integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.companies is 'Empresas cadastradas na plataforma (tenants)';

-- ------------------------------------------------------------
-- TABELA: users (perfil estendido, vinculado a auth.users)
-- ------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  name text not null,
  surname text,
  email text not null,
  phone text,
  position text,                      -- Cargo
  photo_url text,
  role user_role not null default 'leitor',
  status user_status not null default 'active',
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.users is 'Perfis de usuários, vinculados a auth.users e a uma empresa';

-- ------------------------------------------------------------
-- TABELA: modules (catálogo global de sistemas/módulos)
-- ------------------------------------------------------------
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,                          -- nome do ícone (lucide)
  route text not null,                -- rota/URL do módulo
  status text not null default 'active',
  created_at timestamptz not null default now()
);

comment on table public.modules is 'Catálogo global de módulos/sistemas disponíveis no hub';

-- ------------------------------------------------------------
-- TABELA: company_modules (módulos habilitados por empresa)
-- ------------------------------------------------------------
create table public.company_modules (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (company_id, module_id)
);

comment on table public.company_modules is 'Módulos contratados/habilitados por cada empresa';

-- ------------------------------------------------------------
-- TABELA: permissions (RBAC por usuário e módulo)
-- ------------------------------------------------------------
create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  can_view boolean not null default false,
  can_create boolean not null default false,
  can_edit boolean not null default false,
  can_delete boolean not null default false,
  can_export boolean not null default false,
  can_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);

comment on table public.permissions is 'Permissões RBAC granulares por usuário e módulo';

-- ------------------------------------------------------------
-- TABELA: audit_logs
-- ------------------------------------------------------------
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  company_id uuid references public.companies(id) on delete cascade,
  action audit_action not null,
  table_name text,
  record_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

comment on table public.audit_logs is 'Trilha de auditoria de ações relevantes na plataforma';

-- ------------------------------------------------------------
-- ÍNDICES
-- ------------------------------------------------------------
create index idx_users_company_id on public.users(company_id);
create index idx_company_modules_company_id on public.company_modules(company_id);
create index idx_permissions_user_id on public.permissions(user_id);
create index idx_audit_logs_company_id on public.audit_logs(company_id);
create index idx_audit_logs_user_id on public.audit_logs(user_id);
create index idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- ------------------------------------------------------------
-- TRIGGER: updated_at automático
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_companies_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger trg_permissions_updated_at
  before update on public.permissions
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- SEED: módulos do "Meus Sistemas"
-- ------------------------------------------------------------
insert into public.modules (name, description, icon, route) values
  ('Obras', 'Gestão de obras e canteiros', 'building', '/modulos/obras'),
  ('Auditoria', 'Checklists e auditorias internas', 'clipboard-check', '/modulos/auditoria'),
  ('Comercial', 'Funil de vendas e clientes', 'bar-chart-3', '/modulos/comercial'),
  ('Prospect', 'Prospecção e leads', 'target', '/modulos/prospect'),
  ('Almoxarifado', 'Controle de estoque e materiais', 'package', '/modulos/almoxarifado'),
  ('Frota', 'Gestão de veículos e manutenção', 'truck', '/modulos/frota'),
  ('BI Corporativo', 'Indicadores e dashboards executivos', 'pie-chart', '/modulos/bi'),
  ('Segurança', 'Controle de acessos e segurança', 'shield', '/modulos/seguranca'),
  ('Documentos', 'Gestão documental', 'file-text', '/modulos/documentos'),
  ('Agenda', 'Calendário e compromissos', 'calendar', '/modulos/agenda');
