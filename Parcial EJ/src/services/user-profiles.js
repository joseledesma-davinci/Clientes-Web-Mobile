import { supabase } from './supabase.js';

/**
 * Obtiene el perfil de un usuario por su UUID.
 */
export async function getUserProfileById(id) {
  const { error, data } = await supabase
    .from('user_profiles')
    .select()
    .eq('id', id);

  if (error) {
    console.error('Error al traer el perfil del usuario: ', error);
    throw new Error(error.message);
  }

  return data?.[0] ?? null;
}

/**
 * Crea el perfil del usuario al momento del registro.
 */
export async function createUserProfile(profileData) {
  const { error } = await supabase
    .from('user_profiles')
    .insert(profileData);

  if (error) {
    console.error('Error al crear el perfil del usuario: ', error);
    throw new Error(error.message);
  }
}

/**
 * Actualiza los datos del perfil del usuario autenticado.
 */
export async function updateUserProfile(id, updates) {
  const { error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error al actualizar el perfil: ', error);
    throw new Error(error.message);
  }
}

/**
 * Obtiene todos los perfiles (para listado de usuarios).
 */
export async function getAllProfiles() {
  const { error, data } = await supabase
    .from('user_profiles')
    .select()
    .order('display_name', { ascending: true });

  if (error) {
    console.error('Error al traer los perfiles: ', error);
    throw new Error(error.message);
  }

  return data ?? [];
}
