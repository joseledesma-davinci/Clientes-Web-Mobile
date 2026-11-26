/*
    User Profiles Table
*/
create table user_profiles (
    id uuid primary key references auth.users (id),
    email text not null,
    bio text,
    display_name text,
    favorite_platform text,
    avatar_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

REVOKE all ON public.user_profiles FROM anon, authenticated;
GRANT select, insert, update ON public.user_profiles TO authenticated;

ALTER TABLE public.user_profiles enable row level security;

CREATE POLICY "Auth users can view profiles" -- Noten que son comillas dobles, porque es el nombre de la estructura, no un valor.
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Auth users can create their profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.uid()) = id
);

CREATE POLICY "Auth users can update their profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
    (select auth.uid()) = id
)
WITH CHECK (
    (select auth.uid()) = id
);