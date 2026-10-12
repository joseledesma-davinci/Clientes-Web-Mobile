import { supabase } from "./supabase";

/**
 * Obtiene el perfil de un usuario por su UUID.
 *
 * @param {string} id - UUID del usuario (viene de auth.users).
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function getUserProfileById(id) {
    const { error, data } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', id);
        
    if(error) {
        console.error("Error al traer el perfil del usuario. ", error);
        throw new Error(error.message);
    }

    return data?.[0];
}

/**
 * Crea el perfil del usuario al momento del registro.
 * Se llama desde auth.js después de un signup exitoso.
 *
 * @param {{id: string, email: string}} userData
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function createUserProfile(data) {
    const { error } = await supabase
        .from('user_profiles')
        .insert(data);
        
    if(error) {
        console.error("Error al crear el perfil del usuario. ", error);
        throw new Error(error.message);
    }
}
