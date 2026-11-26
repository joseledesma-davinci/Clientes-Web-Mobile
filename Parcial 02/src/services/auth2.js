import { supabase } from "./supabase";
import { createUserProfile, getUserProfileById } from "./user-profiles";

let userData = {
    id: null,
    email: null,
    bio: null,
    display_name: null,
    favorite_platform: null,
}

let observers = [];

supabase.auth.onAuthStateChange((event, session) => {
    if(session !== null) {
        userData = {
            id: session.user.id,
            email: session.user.email,
        }

        getUserProfileById(userData.id)
            .then(profile => {
                if(!profile) return;

                userData = {
                    ...userData,
                    bio: profile.bio,
                    display_name: profile.display_name,
                    favorite_platform: profile.favorite_platform,
                }

                notifyAll();
            });
    } else {
        userData = {
            id: null,
            email: null,
            bio: null,
            display_name: null,
            favorite_platform: null,
        }
    }
    notifyAll();
});

/**
 * 
 * @param {{email: string, password: string}} data
 * @returns {Promise<{id: string, email: string}>}
 */
export async function register({ email, password, displayName }) {
    const { data, error } = await supabase
        .auth
        .signUp({
            email,
            password,
        });
    
    if(error) {
        console.error("Error al crear una cuenta: ", error);
        throw new Error(error.message);
    }

    await createUserProfile({
        id: data.user.id,
        email,
        display_name: displayName,
    });

    // ¡El usuario está registrado y autenticado!
    console.log("¡Usuario creado! ", data);
    
    return {
        id: data.user.id,
        email: data.user.email,
    }
}

/**
 * 
 * @param {{email: string, password: string}} data
 * @returns {Promise<{id: string, email: string}>}
 */
export async function login({ email, password }) {
    const { data, error } = await supabase
        .auth
        .signInWithPassword({
            email,
            password,
        });
    
    if(error) {
        console.error("Error al iniciar sesión: ", error);
        throw new Error(error.message);
    }

    // ¡El usuario está autenticado!
    console.log("¡Usuario autenticado! ", data);
    
    return {
        id: data.user.id,
        email: data.user.email,
    }
}

export async function logout() {
    const { error } = await supabase
        .auth
        .signOut();
    
    if(error) {
        console.error("Error al cerrar sesión: ", error);
        throw new Error(error.message);
    }
}

/**
 * Cambia la contraseña del usuario autenticado.
 */
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    console.error('Error al cambiar la contraseña: ', error);
    throw new Error(error.message);
  }
}

/*
+-----------------------------------------------------------------------------------------
| Implementación de las funcionalidades para el patrón observer
+-----------------------------------------------------------------------------------------
*/
/**
 * 
 * @param {() => {}} callback El observer a suscribir.
 */
export function subscribeToAuthStateChange(callback) {
    observers.push(callback);

    notify(callback);
}

/**
 * 
 * @param {() => {}} callback El observer a notificar.
 */
function notify(callback) {
    callback({...userData});
}

function notifyAll() {
    observers.forEach(notify);
}