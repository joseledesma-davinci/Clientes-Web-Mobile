/*
    storage.objects es la tabla donde Supabase registra todos los archivos que se guarden en Storage.
*/
CREATE POLICY "Authenticated users can upload their profile photo"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    -- Lo primero que solemos agregar acá es a qué bucket impacta esta policy.
    bucket_id = 'avatars'
    AND
    /*
        Queremos registringir que los usuarios solo puedan subir archivos a su propia carpeta que se llama
        como su id.
        Para obtener el nombre de la carpeta, así como todos los otros segmentos del nombre del archivo,
        podemos usar la función helper "storage.foldername()" de Supabase.
        Esta función retorna un array con los segmentos del nombre del archivo.
        El nombre de la primera carpera del archivo va a figurar en la posición [1].

        :: es el operador para "castear" valores.
        Necesitamos transformar el uuid del id del usuario a un text para poder compararlo.
    */
    (select auth.uid())::text = (storage.foldername(name))[1]
);