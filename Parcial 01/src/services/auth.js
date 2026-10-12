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
    // console.group("Cambio de estado de autenticación");
    // console.log("Evento: ", event);
    // console.log("Sesión: ", session);
    // console.groupEnd();
    if(session !== null) {
        userData = {
            id: session.user.id,
            email: session.user.email,
        }

        // Dejamos cargando los datos del perfil en paralelo.
        getUserProfileById(userData.id)
            .then(profile => {
                // Opcionalmente, podríamos esperar un segundo y reintentar.
                if(!profile) return;

                userData = {
                    ...userData,
                    bio: profile.bio,
                    display_name: profile.display_name,
                    favorite_platform: profile.favorite_platform,
                }

                // ¡No nos olvidemos de notificar a los observers!
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
export async function register({ email, password }) {
    const { data, error } = await supabase
        .auth
        // signUp permite crear un usuario pasándole un email o número de teléfono, y un password.
        // Retorna una Promise que se resuelve con un objeto con las propiedades "data" y "error".
        .signUp({
            email,
            password,
        });
    
    if(error) {
        console.error("Error al crear una cuenta: ", error);
        throw new Error(error.message);
    }

    // Creamos el perfil del usuario.
    await createUserProfile({
        id: data.user.id,
        email,
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
    // Registramos el observer en nuestro stack.
    observers.push(callback);

    // Le notificamos inmediatamente la data actual del usuario.
    notify(callback);
}

/**
 * 
 * @param {() => {}} callback El observer a notificar.
 */
function notify(callback) {
    // Para notificar al observer, como es un callback, solo necesitamos ejecutarlo y pasarle una
    // copia de los datos del usuario.
    callback({...userData});
}

function notifyAll() {
    // Notificamos a todos los observers.
    // observers.forEach(observer => notify(observer));
    observers.forEach(notify);
}