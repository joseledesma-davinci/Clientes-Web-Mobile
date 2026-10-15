-- ============================================
-- Schema SQL para Gaming Social
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

-- Tabla de perfiles de usuario (vinculada a auth.users)
create table if not exists user_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  bio text,
  avatar_url text,
  favorite_platform text,
  updated_at timestamp with time zone default now()
);

-- Tabla de posts (reseñas de videojuegos)
create table if not exists game_posts (
  id bigint generated always as identity primary key,
  user_id uuid references user_profiles(id) on delete cascade not null,
  game_title text not null,
  platform text,
  rating smallint check (rating >= 1 and rating <= 5),
  content text not null,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Habilitar Row Level Security
alter table user_profiles enable row level security;
alter table game_posts enable row level security;

-- Políticas RLS para user_profiles
create policy "Perfiles visibles para todos"
  on user_profiles for select
  using (true);

create policy "Usuarios pueden editar su propio perfil"
  on user_profiles for update
  using (auth.uid() = id);

create policy "Usuarios pueden insertar su propio perfil"
  on user_profiles for insert
  with check (auth.uid() = id);

-- Políticas RLS para game_posts
create policy "Posts visibles para todos"
  on game_posts for select
  using (true);

create policy "Usuarios autenticados pueden crear posts"
  on game_posts for insert
  with check (auth.uid() = user_id);

create policy "Usuarios pueden borrar sus propios posts"
  on game_posts for delete
  using (auth.uid() = user_id);

-- Habilitar Realtime para game_posts
alter publication supabase_realtime add table game_posts;
