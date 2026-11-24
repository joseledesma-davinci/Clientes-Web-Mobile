CREATE TABLE private_chats (
    id bigint primary key generated always as identity,
    user_id1 uuid not null references auth.users (id),
    user_id2 uuid not null references auth.users (id),
    created_at timestamptz default now()
);

REVOKE all ON private_chats FROM anon, authenticated;
GRANT select, insert ON private_chats TO authenticated;

ALTER TABLE private_chats ENABLE ROW LEVEL SECURITY;

/*
    Para esta tabla queremos:
    - Los usuarios autenticados puedan ver sus conversaciones.
    - Los usuarios autenticados puedan crear sus conversaciones.
*/

CREATE POLICY "Authenticated users can see their private chats"
ON private_chats
FOR select
TO authenticated
USING (
    (select auth.uid()) = user_id1
    OR
    (select auth.uid()) = user_id2
);

CREATE POLICY "Authenticated users can create their private chats"
ON private_chats
FOR insert
TO authenticated
WITH CHECK (
    (select auth.uid()) = user_id1
    OR
    (select auth.uid()) = user_id2
);

/*
    Los índices en SQL cumplen la misma función que los índices en un libro:
    - Aumentar inmensamente la velocidad para encontrar los resultados (velocidad de lectura) a medida que
        la tabla crece.

    Y, al igual que un libro, tienen un costo:
    - Hacen más pesados los registros.
    - Ralentizan las consultas de escritura (INSERT, UPDATE, DELETE).

    En SQL, es común que las FKs las queramos indexar.
    En MySQL y MariaDB a las FKs se las indexa automáticamente.

    En Postgres no. Los índices de las FKs, si los queremos, los tenemos que agregar manualmente.
*/
CREATE INDEX "private_chats_user_id1_idx" ON private_chats (user_id1);
CREATE INDEX "private_chats_user_id2_idx" ON private_chats (user_id2);