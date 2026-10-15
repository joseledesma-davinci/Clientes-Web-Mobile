import { defineStore } from 'pinia';
import { subscribeToAuthStateChange } from '../services/auth.js';

/**
 * Store de Pinia para el estado del usuario autenticado.
 * Se sincroniza automáticamente con el servicio de auth (que escucha Supabase Auth).
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      id: null,
      email: null,
      bio: null,
      display_name: null,
      favorite_platform: null,
      avatar_url: null,
    },
    ready: false,
  }),

  getters: {
    isLoggedIn: (state) => state.user?.id !== null,
    displayName: (state) => state.user?.display_name || state.user?.email?.split('@')?.[0] || 'Gamer',
  },

  actions: {
    init() {
      subscribeToAuthStateChange((userData) => {
        this.user = { ...userData };
        this.ready = true;
      });
    },

    setUser(userData) {
      this.user = { ...userData };
    },
  },
});
