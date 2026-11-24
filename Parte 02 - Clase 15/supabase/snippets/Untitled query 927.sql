-- REVOKE all ON public.user_profiles FROM anon, authenticated;
-- GRANT select, insert, update ON public.user_profiles TO authenticated;
-- ALTER TABLE public.user_profiles enable row level security;
-- CREATE POLICY "Auth users can view profiles"
-- ON public.user_profiles
-- FOR SELECT
-- TO authenticated
-- USING (true);

-- CREATE POLICY "Auth users can create their profile"
-- ON public.user_profiles
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--     (select auth.uid()) = id
-- );

-- CREATE POLICY "Auth users can update their profile"
-- ON public.user_profiles
-- FOR UPDATE
-- TO authenticated
-- USING (
--     (select auth.uid()) = id
-- )
-- WITH CHECK (
--     (select auth.uid()) = id
-- );

-- REVOKE all ON public_chat_messages FROM anon, authenticated;
-- GRANT select, insert ON public_chat_messages TO authenticated;

-- ALTER TABLE public_chat_messages ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Authenticated users can see public chat messages"
-- ON public_chat_messages
-- FOR SELECT
-- TO authenticated
-- USING (true);

-- CREATE POLICY "Authenticated users can insert their own public chat messages"
-- ON public_chat_messages
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--     (select auth.uid()) = sender_id
-- );

-- REVOKE all ON private_chats FROM anon, authenticated;
-- GRANT select, insert ON private_chats TO authenticated;

-- ALTER TABLE private_chats ENABLE ROW LEVEL SECURITY;

/*
    Para esta tabla queremos:
    - Los usuarios autenticados puedan ver sus conversaciones.
    - Los usuarios autenticados puedan crear sus conversaciones.
*/

-- CREATE POLICY "Authenticated users can see their private chats"
-- ON private_chats
-- FOR select
-- TO authenticated
-- USING (
--     (select auth.uid()) = user_id1
--     OR
--     (select auth.uid()) = user_id2
-- );

-- CREATE POLICY "Authenticated users can create their private chats"
-- ON private_chats
-- FOR insert
-- TO authenticated
-- WITH CHECK (
--     (select auth.uid()) = user_id1
--     OR
--     (select auth.uid()) = user_id2
-- );

-- REVOKE all ON private_chats_messages FROM anon, authenticated;
-- GRANT select, insert ON private_chats_messages TO authenticated;
-- ALTER TABLE private_chats_messages ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Authenticated users can see the messages of private chats they belongs to"
-- ON private_chats_messages
-- FOR select
-- TO authenticated
-- USING (
--     /*
--         No tenemos en esta tabla los datos de quiénes participan en la conversación.
--         Solo tenemos el id de la conversación.
--         Para poder verificar si el usuario pertenece a la conversación del mensaje, vamos a necesitar
--         hacer un EXISTS que verifique con un "subquery" si el usuario es parte de la conversación del
--         mensaje.
--     */
--     EXISTS (
--         SELECT 1 FROM private_chats
--         WHERE private_chats.id = private_chats_messages.chat_id
--         AND
--         (
--             (select auth.uid()) = private_chats.user_id1
--             OR
--             (select auth.uid()) = private_chats.user_id2
--         )
--     )
-- );

-- CREATE POLICY "Authenticated users can send their own messages to private chats they belongs to"
-- ON private_chats_messages
-- FOR insert
-- TO authenticated
-- WITH CHECK (
--     EXISTS (
--         SELECT 1 FROM private_chats
--         WHERE private_chats.id = private_chats_messages.chat_id
--         AND
--         (
--             (select auth.uid()) = private_chats.user_id1
--             OR
--             (select auth.uid()) = private_chats.user_id2
--         )
--     )
--     AND
--     (select auth.uid()) = sender_id
-- );

CREATE INDEX "private_chats_user_id2_idx" ON private_chats (user_id2);