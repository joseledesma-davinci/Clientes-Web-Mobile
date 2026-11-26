/*
    Creamos una función para crear un usuario con su perfil.
*/
CREATE OR REPLACE FUNCTION public.create_user_with_profile(
    email text,
    password text,
    bio text,
    display_name text,
    favorite_platform text
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

  INSERT INTO public.user_profiles (id, email, bio, display_name, favorite_platform)
  VALUES 
    (user_id, email, bio, display_name, favorite_platform);

  RETURN user_id;
END;
$$ LANGUAGE plpgsql;

/*
    Para usar la función que creamos con plpgsql, necesitamos llamarla desde un bloque de plpgsql.
*/
DO $$
  DECLARE
    sara_id uuid;
    pepe_id uuid;
  BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('avatars', 'avatars', TRUE, 524288, '{"image/jpeg", "image/pjpeg", "image/png", "image/webp", "image/gif"}');
    
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('post-images', 'post-images', TRUE, 524288, '{"image/jpeg", "image/pjpeg", "image/png", "image/webp", "image/gif"}');

    sara_id := public.create_user_with_profile('sara@za.com', 'asdasd', '¡Hola! Me llamo Sara za', 'Saraza', 'PS5');
    pepe_id := public.create_user_with_profile('pepe@trueno.com', 'asdasd', NULL, 'Pepe Trueno', NULL);

  INSERT INTO game_posts (user_id, game_title, platform, rating, content, created_at)
  VALUES (sara_id, 'The Last of Us Part II', 'PS5', 5, 'The Last of Us Part II es un videojuego de terror de acción y aventura de disparos en tercera persona de 2020 desarrollado por Naughty Dog y publicado por Sony Interactive Entertainment.', '2026-09-17 10:12:13+00:00'),
    (pepe_id, 'Halo Infinite', 'Xbox Series X', 4, 'Halo Infinite es un videojuego de disparos en tercera persona desarrollado por 343 Industries y publicado por Xbox Game Studios.', '2026-09-17 10:13:54+00:00'),
    (sara_id, 'God of War Ragnarök', 'PS5', 5, 'God of War Ragnarök es un videojuego de acción y aventura desarrollado por SIE Santa Monica Studio y publicado por Sony Interactive Entertainment.', '2026-09-17 10:14:37+00:00');

  END;
$$;

/*
    Comentarios de ejemplo para probar la funcionalidad.
*/
DO $$
  DECLARE
    sara_id uuid;
    pepe_id uuid;
    tlou_post_id bigint;
  BEGIN
    SELECT id INTO sara_id FROM user_profiles WHERE email = 'sara@za.com' LIMIT 1;
    SELECT id INTO pepe_id FROM user_profiles WHERE email = 'pepe@trueno.com' LIMIT 1;
    SELECT id INTO tlou_post_id FROM game_posts WHERE game_title = 'The Last of Us Part II' LIMIT 1;

    IF sara_id IS NOT NULL AND pepe_id IS NOT NULL AND tlou_post_id IS NOT NULL THEN
      INSERT INTO post_comments (post_id, user_id, content)
      VALUES
        (tlou_post_id, pepe_id, 'Gran reseña. Me dieron ganas de volver a jugarlo.'),
        (tlou_post_id, sara_id, '¡Gracias! El modo historia me encantó.');
    END IF;
  END;
$$;