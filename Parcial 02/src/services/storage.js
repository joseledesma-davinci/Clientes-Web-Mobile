import { supabase } from './supabase';

/**
 *
 * @param {string} filename
 * @param {File|Blob} file
 * @param {string} bucket
 * @param {{ upsert?: boolean }} options
 */
export async function uploadFile(filename, file, bucket = 'post-images', options = {}) {
    const { upsert = false } = options;

    const { error } = await supabase
        .storage
        .from(bucket)
        .upload(filename, file, { upsert });

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
export function getPublicURL(filename, bucket = 'post-images') {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    return data.publicUrl;
}