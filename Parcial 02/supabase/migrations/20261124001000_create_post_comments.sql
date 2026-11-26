/*
    Comentarios de publicaciones.
*/

CREATE TABLE post_comments (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id bigint NOT NULL REFERENCES game_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (char_length(trim(content)) BETWEEN 2 AND 500),
  created_at timestamptz DEFAULT now()
);

ALTER PUBLICATION supabase_realtime ADD TABLE post_comments;

REVOKE all ON post_comments FROM anon, authenticated;
GRANT select, insert ON post_comments TO authenticated;

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read post comments"
ON post_comments
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert their own comments"
ON post_comments
FOR INSERT
TO authenticated
WITH CHECK (
  (select auth.uid()) = user_id
);

CREATE POLICY "Authenticated users can delete their own comments"
ON post_comments
FOR DELETE
TO authenticated
USING (
  (select auth.uid()) = user_id
);
