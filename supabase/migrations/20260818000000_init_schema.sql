-- =========================================================
-- SwimApp — esquema inicial (Supabase / Postgres)
--
-- Cubre: perfiles, entrenamientos (con series), marcas
-- personales, frases del día, y las vistas/funciones que
-- alimentan el resumen de la Home (metros y minutos del mes,
-- racha de días consecutivos).
--
-- Asume Supabase Auth: cada usuario es una fila en auth.users
-- y public.profiles es su perfil 1:1, creado automáticamente
-- al registrarse (trigger handle_new_user más abajo).
-- =========================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------
-- 1. profiles — perfil de cada usuario
-- ---------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Nadador/a',
  avatar_url text,
  goal_meters_per_week integer check (goal_meters_per_week >= 0),
  preferred_pool_length smallint check (preferred_pool_length in (25, 50)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Perfil de usuario. Se crea automáticamente al registrarse (trigger on_auth_user_created).';

-- ---------------------------------------------------------
-- 2. workouts — un entrenamiento completo
-- ---------------------------------------------------------
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  pool_length smallint not null check (pool_length in (25, 50)),
  total_meters integer not null check (total_meters >= 0),
  total_time_minutes integer not null check (total_time_minutes >= 0),
  calories integer check (calories >= 0),
  intensity text not null check (intensity in ('suave', 'moderada', 'alta')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workouts_user_date_idx on public.workouts (user_id, date desc);

comment on table public.workouts is
  'total_meters/total_time_minutes son la fuente de verdad del entrenamiento (cargados por el usuario); workout_sets es el detalle opcional de series.';

-- ---------------------------------------------------------
-- 3. workout_sets — series dentro de un entrenamiento (ej: 8x100 crol)
-- ---------------------------------------------------------
create table public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts (id) on delete cascade,
  order_index integer not null default 0,
  repetitions integer not null check (repetitions > 0),
  distance_meters integer not null check (distance_meters > 0),
  style text not null check (style in ('crol', 'espalda', 'pecho', 'mariposa', 'combinado')),
  rest_seconds integer check (rest_seconds >= 0),
  created_at timestamptz not null default now()
);

create index workout_sets_workout_idx on public.workout_sets (workout_id, order_index);

-- ---------------------------------------------------------
-- 4. personal_records — historial completo de marcas
-- ---------------------------------------------------------
create table public.personal_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  workout_id uuid references public.workouts (id) on delete set null,
  style text not null check (style in ('crol', 'espalda', 'pecho', 'mariposa', 'combinado')),
  distance_meters integer not null check (distance_meters > 0),
  pool_length smallint not null check (pool_length in (25, 50)),
  time_seconds numeric(7, 2) not null check (time_seconds > 0),
  date date not null,
  created_at timestamptz not null default now()
);

create index personal_records_user_idx
  on public.personal_records (user_id, style, distance_meters, pool_length);

comment on table public.personal_records is
  'Historial completo (no solo la mejor marca). La marca vigente por estilo+distancia+pileta es la de menor time_seconds — ver vista personal_bests.';

-- ---------------------------------------------------------
-- 5. daily_tips — frases motivacionales ("Consejo del día")
-- ---------------------------------------------------------
create table public.daily_tips (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  caption text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.daily_tips is
  'No es información de usuario: lectura pública para todos los usuarios logueados, escritura solo desde el dashboard (service_role).';

-- =========================================================
-- Vistas de resumen — lo que hoy calcula useHomeStats.ts
-- `security_invoker` hace que respeten el RLS del usuario que
-- consulta, no del dueño de la vista (necesario en Postgres 15+).
-- =========================================================

create view public.monthly_workout_summary
with (security_invoker = true) as
select
  user_id,
  date_trunc('month', date)::date as month,
  count(*) as workouts_count,
  sum(total_meters) as total_meters,
  sum(total_time_minutes) as total_minutes
from public.workouts
group by user_id, date_trunc('month', date);

comment on view public.monthly_workout_summary is
  'Un row por usuario/mes. Para el mes actual: where month = date_trunc(''month'', current_date).';

create view public.personal_bests
with (security_invoker = true) as
select distinct on (user_id, style, distance_meters, pool_length)
  id, user_id, style, distance_meters, pool_length, time_seconds, date
from public.personal_records
order by user_id, style, distance_meters, pool_length, time_seconds asc;

-- =========================================================
-- Racha de días consecutivos (equivalente a computeStreakDays
-- en src/hooks/useHomeStats.ts)
-- =========================================================
create or replace function public.get_streak_days(p_user_id uuid)
returns integer
language sql
stable
as $$
  with days as (
    select distinct date from public.workouts where user_id = p_user_id
  ),
  islands as (
    select date, date - (row_number() over (order by date))::integer as grp
    from days
  ),
  streaks as (
    select max(date) as end_date, count(*) as len
    from islands
    group by grp
  )
  select coalesce(
    (select len from streaks where end_date >= current_date - 1 order by end_date desc limit 1),
    0
  );
$$;

-- =========================================================
-- Triggers
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.workouts
  for each row execute function public.set_updated_at();

-- Crea el perfil automáticamente cuando alguien se registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', 'Nadador/a'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- Row Level Security — cada usuario solo ve/edita sus propios datos
-- =========================================================
alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;
alter table public.personal_records enable row level security;
alter table public.daily_tips enable row level security;

create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);
-- Sin policy de insert/delete: el insert lo hace el trigger
-- handle_new_user (corre con security definer, no como el usuario).

create policy "workouts: crud own" on public.workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workout_sets: crud own" on public.workout_sets
  for all
  using (exists (
    select 1 from public.workouts w
    where w.id = workout_sets.workout_id and w.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workouts w
    where w.id = workout_sets.workout_id and w.user_id = auth.uid()
  ));

create policy "personal_records: crud own" on public.personal_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "daily_tips: read all" on public.daily_tips
  for select using (true);
-- Sin policy de insert/update/delete: se administra desde el
-- dashboard de Supabase (service_role) o un panel interno.
