import { supabase } from './supabase.js';
import { createUserProfile, getUserProfileById } from './user-profiles.js';

// Estado interno del usuario autenticado.
let userData = {
  id: null,
  email: null,
  bio: null,
  display_name: null,
  favorite_platform: null,
  avatar_url: null,
};

let observers = [];

// Escuchar cambios en el estado de autenticación de Supabase.
supabase.auth.onAuthStateChange((event, session) => {
  if (session !== null) {
    userData = {
      id: session.user.id,
      email: session.user.email,
    };

    // Cargar datos del perfil en paralelo.
    getUserProfileById(userData.id)
      .then(profile => {
        if (!profile) return;
        userData = {
          ...userData,
          bio: profile.bio,
          display_name: profile.display_name,
          favorite_platform: profile.favorite_platform,
          avatar_url: profile.avatar_url,
        };
        notifyAll();
      })
      .catch(() => {});
  } else {
    userData = {
      id: null,
      email: null,
      bio: null,
      display_name: null,
      favorite_platform: null,
      avatar_url: null,
    };
  }
  notifyAll();
});

/**
 * Registra un nuevo usuario con email y password.
 * Crea automáticamente su perfil en la tabla user_profiles.
 */
export async function register({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error('Error al crear la cuenta: ', error);
    throw new Error(error.message);
  }

  // Crear el perfil del usuario.
  await createUserProfile({
    id: data.user.id,
    email,
    display_name: displayName || email.split('@')[0],
  });

  return {
    id: data.user.id,
    email: data.user.email,
  };
}

/**
 * Inicia sesión con email y password.
 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Error al iniciar sesión: ', error);
    throw new Error(error.message);
  }

  return {
    id: data.user.id,
    email: data.user.email,
  };
}

/**
 * Cierra la sesión actual.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión: ', error);
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

// ---- Patrón Observer ----

export function subscribeToAuthStateChange(callback) {
  observers.push(callback);
  notify(callback);
}

function notify(callback) {
  callback({ ...userData });
}

function notifyAll() {
  observers.forEach(notify);
}
