import { supabase } from './supabase';

/**
 * Trae todos los posts ordenados del más reciente al más antiguo.
 * Incluye datos del autor (display_name, favorite_platform)
 *
 * @returns {Promise<{id: number, user_id: string, game_title: string, platform: string, rating: number, content: string, image_url: string|null, created_at: string, user_profiles: {display_name: string, favorite_platform: string, avatar_url: string|null}}[]>}
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

    if(error) {
        console.error("Error al traer todos los posts. ", error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * Trae un post por su id con datos de autor.
 *
 * @param {number} postId
 */
export async function getPostById(postId) {
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
        .eq('id', postId)
        .single();

    if (error) {
        console.error('Error al traer el post por id. ', error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * Trae los posts de un usuario específico, ordenados del más reciente al más antiguo.
 *
 * @param {string} userId - UUID del usuario.
 * @returns {Promise<{id: number, user_id: string, game_title: string, platform: string, rating: number, content: string, image_url: string|null, created_at: string, user_profiles: {display_name: string, avatar_url: string|null}}[]>}
 */
export async function getPostsByUserId(userId) {
    const { data, error } = await supabase
        .from('game_posts')
        .select(`
            *,
            user_profiles (
                display_name,
                avatar_url
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if(error) {
        console.error("Error al traer los posts del usuario. ", error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * Crea un nuevo post (reseña de videojuego).
 *
 * @param {{user_id: string, game_title: string, platform: string, rating: number, content: string, image_url?: string|null}} postData
 */
export async function createPost({ user_id, game_title, platform, rating, content, image_url = null }) {
    const { error } = await supabase
        .from('game_posts')
        .insert({ user_id, game_title, platform, rating, content, image_url });

    if(error) {
        console.error("Error al crear el nuevo post. ", error);
        throw new Error(error.message);
    }
}

/**
 * Se suscribe en tiempo real a los nuevos posts insertados en game_posts.
 *
 * @param {function} callback - Función que recibe el nuevo registro insertado.
 */
export function subscribeToNewPosts(callback) {
    const postChannel = supabase.channel('game_posts');
    postChannel.on(
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

    postChannel.subscribe();
    return postChannel;
}
