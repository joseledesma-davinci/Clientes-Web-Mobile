import { supabase } from './supabase.js';

/**
 * Trae todos los posts ordenados del más reciente al más antiguo.
 * Incluye datos del autor (display_name, favorite_platform, avatar_url).
 */
export async function getAllPosts() {
  const { data, error } = await supabase
    .from('game_posts')
    .select(`
      *,
      user_profiles (
        display_name,
        favorite_platform,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al traer todos los posts: ', error);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Trae los posts de un usuario específico.
 */
export async function getPostsByUserId(userId) {
  const { data, error } = await supabase
    .from('game_posts')
    .select(`
      *,
      user_profiles (
        display_name,
        favorite_platform,
        avatar_url
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al traer los posts del usuario: ', error);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Crea un nuevo post (reseña de videojuego).
 */
export async function createPost({ user_id, game_title, platform, rating, content, image_url }) {
  const { error } = await supabase
    .from('game_posts')
    .insert({ user_id, game_title, platform, rating, content, image_url });

  if (error) {
    console.error('Error al crear el nuevo post: ', error);
    throw new Error(error.message);
  }
}

/**
 * Elimina un post por su ID.
 */
export async function deletePost(postId) {
  const { error } = await supabase
    .from('game_posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error('Error al eliminar el post: ', error);
    throw new Error(error.message);
  }
}

/**
 * Suscripción en tiempo real a nuevos posts insertados.
 */
export function subscribeToNewPosts(callback) {
  const channel = supabase.channel('game_posts_realtime');
  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'game_posts',
    },
    (payload) => {
      callback(payload.new);
    }
  );
  channel.subscribe();
  return channel;
}
