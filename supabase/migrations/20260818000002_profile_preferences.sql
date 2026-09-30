-- =========================================================
-- Preferencias y datos de perfil + recordatorios.
--
-- Agrega a `profiles` los campos que se piden al iniciar
-- (usuario, bio, año/fecha en que arrancó a nadar) y las
-- preferencias editables de la pantalla Perfil (pileta ya
-- existía; se suma unidad de distancia, unidad de tiempo y
-- estilo favorito). También agrega `reminders`, la tabla
-- detrás de "Recordatorios: N activos".
-- =========================================================

alter table public.profiles
  add column username text,
  add column bio text,
  add column swimming_since date,
  add column distance_unit text not null default 'metros'
    check (distance_unit in ('metros', 'yardas')),
  add column time_format text not null default 'min:seg'
    check (time_format in ('min:seg', 'segundos')),
  add column favorite_style text
    check (favorite_style in ('crol', 'espalda', 'pecho', 'mariposa'));

comment on column public.profiles.username is
  'Alias único, opcional (no todos los perfiles existentes lo tienen todavía).';
comment on column public.profiles.bio is
  'Descripción corta que el usuario elige mostrar en su perfil (ej: una frase motivacional).';
comment on column public.profiles.swimming_since is
  'Desde cuándo nada la persona (no confundir con created_at, que es cuándo se registró en la app). Se muestra como "Nadador/a desde <año>".';

-- Alias único, pero solo cuando está definido: distintos NULL no chocan entre sí.
create unique index profiles_username_key on public.profiles (username) where username is not null;

-- ---------------------------------------------------------
-- handle_new_user: ahora también toma username/bio/swimming_since
-- si el signup los manda en raw_user_meta_data (opcional; si no
-- vienen, quedan NULL y se completan después desde el perfil).
-- ---------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, username, bio, swimming_since)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'Nadador/a'),
    nullif(new.raw_user_meta_data ->> 'username', ''),
    nullif(new.raw_user_meta_data ->> 'bio', ''),
    nullif(new.raw_user_meta_data ->> 'swimming_since', '')::date
  );
  return new;
end;
$$;

-- ---------------------------------------------------------
-- reminders — recordatorios de entrenamiento configurables
-- ---------------------------------------------------------
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null,
  time_of_day time not null,
  -- días de la semana en que suena: 0 = domingo ... 6 = sábado
  days_of_week smallint[] not null default '{1,2,3,4,5,6,0}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reminders_user_idx on public.reminders (user_id);

comment on table public.reminders is
  'Recordatorios locales/push configurados por el usuario. "Recordatorios: N activos" en Perfil = count(*) where is_active.';

create trigger set_updated_at before update on public.reminders
  for each row execute function public.set_updated_at();

alter table public.reminders enable row level security;

create policy "reminders: crud own" on public.reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------
-- lifetime_workout_summary — totales de toda la vida por usuario,
-- para el header de Perfil (equivalente a monthly_workout_summary
-- pero sin agrupar por mes).
-- ---------------------------------------------------------
create view public.lifetime_workout_summary
with (security_invoker = true) as
select
  user_id,
  count(*) as workouts_count,
  sum(total_meters) as total_meters,
  sum(total_time_minutes) as total_minutes
from public.workouts
group by user_id;

comment on view public.lifetime_workout_summary is
  'Un row por usuario con al menos un entrenamiento: totales desde que arrancó a usar la app (para el header de Perfil, junto con get_streak_days).';
