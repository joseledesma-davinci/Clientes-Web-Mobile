import { supabase } from './supabase';

/**
 *
 * @param {number} postId
 */
export async function getCommentsByPostId(postId) {
    const { data, error } = await supabase
        .from('post_comments')
        .select(`
            *,
            user_profiles (
                display_name,
                avatar_url
            )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error al traer comentarios del post. ', error);
        throw new Error(error.message);
    }

    return data;
}

/**
 *
 * @param {{post_id: number, user_id: string, content: string}} data
 */
export async function createComment({ post_id, user_id, content }) {
    const sanitizedContent = content?.trim?.();

    if (!sanitizedContent || sanitizedContent.length < 2) {
        throw new Error('El comentario debe tener al menos 2 caracteres.');
    }

    if (sanitizedContent.length > 500) {
        throw new Error('El comentario no puede superar los 500 caracteres.');
    }

    const { data: insertedComment, error } = await supabase
        .from('post_comments')
        .insert({ post_id, user_id, content: sanitizedContent })
        .select(`
            *,
            user_profiles (
                display_name,
                avatar_url
            )
        `)
        .single();

    if (error) {
        console.error('Error al crear comentario. ', error);
        throw new Error(error.message);
    }

    return insertedComment;
}

/**
 *
 * @param {{commentId: number, userId: string}} data
 */
export async function deleteComment({ commentId, userId }) {
    const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error al borrar comentario. ', error);
        throw new Error(error.message);
    }
}
