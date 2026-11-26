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

REVOKE all ON public.game_posts FROM anon, authenticated;
GRANT select, insert, update ON public.game_posts TO authenticated;

ALTER TABLE game_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read game posts" ON game_posts;
CREATE POLICY "Anyone can read game posts"
ON game_posts
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert their own game posts" ON game_posts;
CREATE POLICY "Authenticated users can insert their own game posts"
ON game_posts
FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.uid()) = user_id
);

DROP POLICY IF EXISTS "Authenticated users can update their own game posts" ON game_posts;
CREATE POLICY "Authenticated users can update their own game posts"
ON game_posts
FOR UPDATE
TO authenticated
USING (
    (select auth.uid()) = user_id
)
WITH CHECK (
    (select auth.uid()) = user_id
);

DROP POLICY IF EXISTS "Authenticated users can delete their own game posts" ON game_posts;
CREATE POLICY "Authenticated users can delete their own game posts"
ON game_posts
FOR DELETE
TO authenticated
USING (
    (select auth.uid()) = user_id
);