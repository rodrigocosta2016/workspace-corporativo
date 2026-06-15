-- ============================================================
-- WORKSPACE CORPORATIVO — ROW LEVEL SECURITY (RLS)
-- Isolamento multi-tenant por company_id + RBAC por perfil
-- ============================================================

-- ------------------------------------------------------------
-- HABILITAR RLS EM TODAS AS TABELAS
-- ------------------------------------------------------------
alter table public.companies enable row level security;
alter table public.users enable row level security;
alter table public.modules enable row level security;
alter table public.company_modules enable row level security;
alter table public.permissions enable row level security;
alter table public.audit_logs enable row level security;

-- ------------------------------------------------------------
-- FUNÇÕES AUXILIARES (security definer)
-- Evitam recursão infinita ao consultar public.users dentro
-- das próprias policies de public.users.
-- ------------------------------------------------------------

-- Retorna o company_id do usuário autenticado
create or replace function public.current_company_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select company_id from public.users where id = auth.uid();
$$;

-- Retorna o role do usuário autenticado
create or replace function public.current_user_role()
returns user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

-- Verifica se o usuário autenticado é super_admin
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'super_admin'
  );
$$;

-- Verifica se o usuário autenticado é admin (ou super_admin) da empresa
create or replace function public.is_company_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role in ('super_admin', 'admin')
  );
$$;

-- ============================================================
-- COMPANIES
-- ============================================================

-- Super admin vê todas as empresas; demais usuários veem
-- apenas a própria empresa.
create policy "companies_select"
  on public.companies for select
  using (
    public.is_super_admin()
    or id = public.current_company_id()
  );

-- Apenas super admin pode criar empresas
create policy "companies_insert"
  on public.companies for insert
  with check (public.is_super_admin());

-- Super admin edita qualquer empresa; admin da empresa edita a própria
create policy "companies_update"
  on public.companies for update
  using (
    public.is_super_admin()
    or (public.is_company_admin() and id = public.current_company_id())
  );

-- Apenas super admin exclui empresas
create policy "companies_delete"
  on public.companies for delete
  using (public.is_super_admin());

-- ============================================================
-- USERS
-- ============================================================

-- Super admin vê todos; demais veem apenas usuários da própria empresa
create policy "users_select"
  on public.users for select
  using (
    public.is_super_admin()
    or company_id = public.current_company_id()
  );

-- Super admin cria qualquer usuário; admin da empresa cria usuários
-- dentro da própria empresa
create policy "users_insert"
  on public.users for insert
  with check (
    public.is_super_admin()
    or (public.is_company_admin() and company_id = public.current_company_id())
  );

-- Usuário pode editar o próprio perfil (campos básicos);
-- admin da empresa edita usuários da própria empresa;
-- super admin edita qualquer um.
create policy "users_update"
  on public.users for update
  using (
    public.is_super_admin()
    or (public.is_company_admin() and company_id = public.current_company_id())
    or id = auth.uid()
  );

-- Apenas super admin ou admin da empresa removem usuários
create policy "users_delete"
  on public.users for delete
  using (
    public.is_super_admin()
    or (public.is_company_admin() and company_id = public.current_company_id())
  );

-- ============================================================
-- MODULES (catálogo global)
-- ============================================================

-- Todos os usuários autenticados podem ler o catálogo de módulos
create policy "modules_select"
  on public.modules for select
  using (auth.uid() is not null);

-- Apenas super admin gerencia o catálogo global
create policy "modules_insert"
  on public.modules for insert
  with check (public.is_super_admin());

create policy "modules_update"
  on public.modules for update
  using (public.is_super_admin());

create policy "modules_delete"
  on public.modules for delete
  using (public.is_super_admin());

-- ============================================================
-- COMPANY_MODULES
-- ============================================================

-- Usuários veem os módulos habilitados para a própria empresa;
-- super admin vê de todas.
create policy "company_modules_select"
  on public.company_modules for select
  using (
    public.is_super_admin()
    or company_id = public.current_company_id()
  );

-- Apenas super admin habilita/desabilita módulos por empresa
create policy "company_modules_insert"
  on public.company_modules for insert
  with check (public.is_super_admin());

create policy "company_modules_update"
  on public.company_modules for update
  using (public.is_super_admin());

create policy "company_modules_delete"
  on public.company_modules for delete
  using (public.is_super_admin());

-- ============================================================
-- PERMISSIONS
-- ============================================================

-- Usuário vê as próprias permissões; admin da empresa vê as
-- permissões de usuários da própria empresa; super admin vê tudo.
create policy "permissions_select"
  on public.permissions for select
  using (
    public.is_super_admin()
    or user_id = auth.uid()
    or (
      public.is_company_admin()
      and user_id in (
        select id from public.users where company_id = public.current_company_id()
      )
    )
  );

-- Apenas admins (da empresa ou super) atribuem permissões
create policy "permissions_insert"
  on public.permissions for insert
  with check (
    public.is_super_admin()
    or (
      public.is_company_admin()
      and user_id in (
        select id from public.users where company_id = public.current_company_id()
      )
    )
  );

create policy "permissions_update"
  on public.permissions for update
  using (
    public.is_super_admin()
    or (
      public.is_company_admin()
      and user_id in (
        select id from public.users where company_id = public.current_company_id()
      )
    )
  );

create policy "permissions_delete"
  on public.permissions for delete
  using (
    public.is_super_admin()
    or (
      public.is_company_admin()
      and user_id in (
        select id from public.users where company_id = public.current_company_id()
      )
    )
  );

-- ============================================================
-- AUDIT_LOGS
-- ============================================================

-- Usuários veem logs da própria empresa; super admin vê tudo.
-- Usuário comum não vê logs de outros usuários da empresa,
-- apenas admins.
create policy "audit_logs_select"
  on public.audit_logs for select
  using (
    public.is_super_admin()
    or (
      company_id = public.current_company_id()
      and (public.is_company_admin() or user_id = auth.uid())
    )
  );

-- Qualquer usuário autenticado pode gerar logs das próprias ações,
-- restritos à própria empresa.
create policy "audit_logs_insert"
  on public.audit_logs for insert
  with check (
    public.is_super_admin()
    or (
      company_id = public.current_company_id()
      and (user_id = auth.uid() or user_id is null)
    )
  );

-- Logs não podem ser editados ou excluídos (imutabilidade) —
-- nenhuma policy de update/delete é criada, portanto ambas
-- operações são bloqueadas por padrão sob RLS.
