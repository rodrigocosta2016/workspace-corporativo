-- ============================================================
-- WORKSPACE CORPORATIVO — SINCRONIZAÇÃO auth.users -> public.users
-- ============================================================

-- Quando um novo usuário é criado no Supabase Auth, cria
-- automaticamente o perfil correspondente em public.users.
--
-- Espera receber, via raw_user_meta_data, os campos:
--   name, surname, company_id (opcional), role (opcional)
--
-- Caso company_id/role não sejam informados, o usuário é
-- criado sem empresa e com o papel padrão 'leitor' — um
-- admin precisa associá-lo a uma empresa depois.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, company_id, name, surname, email, role, status)
  values (
    new.id,
    (new.raw_user_meta_data->>'company_id')::uuid,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'surname',
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'leitor'),
    'active'
  );
  return new;
end;
$$;

create trigger trg_handle_new_auth_user
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ------------------------------------------------------------
-- Atualiza last_login a cada novo login (chamado pelo app)
-- ------------------------------------------------------------
create or replace function public.update_last_login(user_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.users set last_login = now() where id = user_id;
$$;
