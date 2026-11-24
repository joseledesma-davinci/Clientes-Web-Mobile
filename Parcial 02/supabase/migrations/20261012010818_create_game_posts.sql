/*
    Game Posts Table
*/

CREATE TABLE game_posts (

  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  game_title text NOT NULL,
  platform   text NOT NULL,
  rating     smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content    text NOT NULL,
  image_url  text, -- URL de la imagen asociada al post (para un futuro, campo opcional)
  created_at timestamptz DEFAULT now()
);

ALTER PUBLICATION supabase_realtime ADD TABLE game_posts;