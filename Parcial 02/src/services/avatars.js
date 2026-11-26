import { getPublicURL, uploadFile } from './storage';

const MIME_TYPE_TO_EXTENSION = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
};

/**
 *
 * @param {string} userId
 * @param {File} file
 * @returns {Promise<string>} URL pública del avatar subido.
 */
export async function uploadAvatar(userId, file) {
    if (!userId) {
        throw new Error('No se pudo determinar el usuario para subir el avatar.');
    }

    if (!file) {
        throw new Error('No se recibió el archivo de avatar.');
    }

    const extension = getFileExtension(file);
    const filename = `${userId}/avatar-${Date.now()}.${extension}`;

    /*
        No usamos upsert: el nombre lleva timestamp, así que nunca pisa un archivo existente.
        Además, upsert en Supabase Storage exige policies de INSERT, SELECT y UPDATE sobre
        storage.objects; con solo la de INSERT, la subida falla con
        "new row violates row-level security policy".
    */
    await uploadFile(filename, file, 'avatars');
    return getPublicURL(filename, 'avatars');
}

function getFileExtension(file) {
    const fromMimeType = MIME_TYPE_TO_EXTENSION[file?.type];
    if (fromMimeType) return fromMimeType;

    const originalName = file?.name ?? '';
    const extensionFromName = originalName.split('.').pop()?.toLowerCase();

    if (extensionFromName && extensionFromName !== originalName.toLowerCase()) {
        return extensionFromName;
    }

    return 'jpg';
}
