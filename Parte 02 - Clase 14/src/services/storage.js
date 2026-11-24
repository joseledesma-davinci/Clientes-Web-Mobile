/*
    Servicio para manejar archivos.
*/
import { supabase } from './supabase';

/**
 * 
 * @param {string} filename 
 * @param {File|Blob} file 
 * @param {string} bucket 
 */
export async function uploadFile(filename, file, bucket = 'avatars') {
    const { error } = await supabase
        .storage
        .from(bucket)
        .upload(filename, file);

    if(error) {
        console.error("Error al subir el archivo. ", error);
        throw new Error(error.message);
    }
}

/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 * @returns {string} La URL absoluta del archivo.
 */
export function getPublicURL(filename, bucket = 'avatars') {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    return data.publicUrl;
}