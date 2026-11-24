CREATE TABLE public_chat_messages (
    id bigint primary key generated always as identity,
    sender_id uuid not null references auth.users (id),
    email text,
    body text,
    created_at timestamptz default now()
);

-- Habilitamos "realtime" a la tabla que creamos.
ALTER PUBLICATION supabase_realtime ADD TABLE public_chat_messages;

REVOKE all ON public_chat_messages FROM anon, authenticated;
GRANT select, insert ON public_chat_messages TO authenticated;

ALTER TABLE public_chat_messages ENABLE ROW LEVEL SECURITY;

/*
    Para esta tabla queremos que:
    - Los usuarios autenticados puedan leer los mensajes de chat público.
    - Los usuarios autenticados pueden insertar nuevos mensajes con su id.
*/
CREATE POLICY "Authenticated users can see public chat messages"
ON public_chat_messages
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert their own public chat messages"
ON public_chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.uid()) = sender_id
);