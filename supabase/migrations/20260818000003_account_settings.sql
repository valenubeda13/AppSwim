-- =========================================================
-- Soporte para la pantalla "Cuenta y sesión" (ícono de rueda
-- en Perfil) y el límite de cambio de nombre de usuario de la
-- pantalla "Editar perfil" (ícono de lápiz).
-- =========================================================

-- ---------------------------------------------------------
-- Rate limit de `username`: 1 cambio cada 30 días.
-- ---------------------------------------------------------
alter table public.profiles add column username_updated_at timestamptz;

comment on column public.profiles.username_updated_at is
  'Cuándo se guardó el username actual por última vez. Lo actualiza enforce_username_rate_limit(); no se toca a mano.';

create or replace function public.enforce_username_rate_limit()
returns trigger
language plpgsql
as $$
begin
  if new.username is distinct from old.username then
    if old.username_updated_at is not null and now() - old.username_updated_at < interval '30 days' then
      raise exception
        'Podés cambiar tu nombre de usuario una vez por mes. Probá de nuevo a partir del %.',
        to_char(old.username_updated_at + interval '30 days', 'DD/MM/YYYY');
    end if;
    new.username_updated_at = now();
  end if;
  return new;
end;
$$;

create trigger enforce_username_rate_limit before update on public.profiles
  for each row execute function public.enforce_username_rate_limit();

-- ---------------------------------------------------------
-- Borrar cuenta: el cliente usa la anon key, que no tiene permiso
-- para tocar auth.users, así que el borrado se hace acá adentro
-- con una función security definer (corre con los privilegios de
-- quien la creó, no del usuario que la llama). El cascade ya
-- definido en profiles/workouts/personal_records/reminders se
-- encarga de borrar todo lo demás.
-- ---------------------------------------------------------
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

comment on function public.delete_own_account() is
  'Borra la cuenta (auth.users) del usuario logueado y, en cascada, su profile/workouts/personal_records/reminders. Irreversible.';

grant execute on function public.delete_own_account() to authenticated;
