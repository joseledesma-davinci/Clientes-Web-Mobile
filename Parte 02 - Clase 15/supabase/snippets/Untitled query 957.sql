-- CREATE POLICY "Authenticated users can upload their profile photo"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--     bucket_id = 'avatars'
--     AND
--     (select auth.uid())::text = (storage.foldername(name))[1]
-- );

ALTER TABLE public.user_profiles
ADD COLUMN photo_url text;