/*
    User Profiles Table
*/
create table user_profiles (
    id uuid primary key references auth.users (id),
    email text not null,
    bio text,
    display_name text,
    favorite_platform text,
    avatar_url text, -- para el futuro
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);