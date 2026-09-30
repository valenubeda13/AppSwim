-- =========================================================
-- Género del perfil: define si el header dice "Nadador" o
-- "Nadadora" en vez del genérico "Nadador/a". Editable desde
-- Editar perfil (lápiz).
-- =========================================================

alter table public.profiles
  add column gender text check (gender in ('nadador', 'nadadora'));

comment on column public.profiles.gender is
  'Opcional. Si es NULL, el header muestra el genérico "Nadador/a desde <año>".';
