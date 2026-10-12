/*
    Creamos una función para crear un usuario con su perfil.

    TODO: Explicar la sintaxis de plpgsql :) Editar perfil. Combinar usuarios con el chat. 
        Ver perfiles de otros usuarios.
*/
CREATE OR REPLACE FUNCTION public.create_user_with_profile(
    email text,
    password text,
    bio text,
    display_name text,
    career text
) RETURNS uuid AS $$
  declare
  user_id uuid;
  encrypted_pw text;
BEGIN
  user_id := gen_random_uuid();
  encrypted_pw := crypt(password, gen_salt('bf', 12));
  
  INSERT INTO auth.users
    (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES
    ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', email, encrypted_pw, now() at time zone 'utc', now() at time zone 'utc', now() at time zone 'utc', '{"provider":"email","providers":["email"]}', '{}', now() at time zone 'utc', now() at time zone 'utc', '', '', '', '');
  
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES
    (gen_random_uuid(), user_id, user_id, format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 'email', now() at time zone 'utc', now() at time zone 'utc', now() at time zone 'utc');

  INSERT INTO public.user_profiles (id, email, bio, display_name, career)
  VALUES 
    (user_id, email, bio, display_name, career);

  RETURN user_id;
END;
$$ LANGUAGE plpgsql;

/*
    Para usar la función que creamos con plpgsql, necesitamos llamarla desde un bloque de plpgsql.
*/
DO $$
  BEGIN
    PERFORM public.create_user_with_profile('sara@za.com', 'asdasd', '¡Hola! Me llamo Sara za', 'Saraza', 'Diseño y programación web');
    PERFORM public.create_user_with_profile('pepe@trueno.com', 'asdasd', NULL, 'Pepe Trueno', NULL);
  END;
$$;

INSERT INTO public_chat_messages (email, body, created_at)
VALUES ('sara@za.com', '¡Hola de nuevo, pero desde un seed!', '2026-09-17 10:12:13+00:00'),
    ('pepe@trueno.com', 'holaaaa saraaaa q tal???', '2026-09-17 10:13:54+00:00'),
    ('sara@za.com', '¿Cómo estás, Pepe?', '2026-09-17 10:14:37+00:00');