<script>
import { useAuthStore } from '../stores/auth.js';
import { logout } from '../services/auth.js';

export default {
  name: 'Navbar',
  data() {
    return {
      mobileOpen: false,
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    isLoggedIn() {
      return this.authStore?.isLoggedIn;
    },
    displayName() {
      return this.authStore?.displayName;
    },
  },
  methods: {
    async handleLogout() {
      try {
        await logout();
        this.$router.push('/login');
      } catch (err) {
        console.error(err);
      }
    },
    toggleMobile() {
      this.mobileOpen = !this.mobileOpen;
    },
  },
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-gaming-darker/90 backdrop-blur-md border-b border-gaming-border">
    <nav class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 group">
        <span class="text-2xl">🎮</span>
        <span class="font-heading text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent
          group-hover:from-neon-cyan group-hover:to-neon-purple transition-all duration-500">
          GamerZone
        </span>
      </RouterLink>

      <!-- Links desktop -->
      <ul class="hidden md:flex items-center gap-1">
        <li>
          <RouterLink to="/" class="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold">
            Inicio
          </RouterLink>
        </li>

        <template v-if="isLoggedIn">
          <li>
            <RouterLink to="/feed" class="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold">
              Feed
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/post/new" class="px-3 py-2 rounded-lg text-gray-300 hover:text-neon-cyan hover:bg-white/5 transition-all text-sm font-semibold">
              + Nueva Reseña
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/profile/me" class="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold">
              Mi Perfil
            </RouterLink>
          </li>
          <li>
            <button
              @click="handleLogout"
              class="px-3 py-2 rounded-lg text-gray-400 hover:text-neon-pink hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer"
            >
              Salir
            </button>
          </li>
        </template>
        <template v-else>
          <li>
            <RouterLink to="/login" class="btn-secondary text-sm !px-4 !py-1.5">
              Ingresar
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/register" class="btn-primary text-sm !px-4 !py-1.5">
              Crear cuenta
            </RouterLink>
          </li>
        </template>
      </ul>

      <!-- Botón móvil -->
      <button @click="toggleMobile" class="md:hidden text-gray-300 hover:text-white text-2xl cursor-pointer">
        {{ mobileOpen ? '✕' : '☰' }}
      </button>
    </nav>

    <!-- Menú móvil -->
    <div v-if="mobileOpen" class="md:hidden bg-gaming-darker border-t border-gaming-border px-4 pb-4">
      <ul class="flex flex-col gap-2 pt-2">
        <li><RouterLink @click="mobileOpen = false" to="/" class="block px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5">Inicio</RouterLink></li>
        <template v-if="isLoggedIn">
          <li><RouterLink @click="mobileOpen = false" to="/feed" class="block px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5">Feed</RouterLink></li>
          <li><RouterLink @click="mobileOpen = false" to="/post/new" class="block px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5">+ Nueva Reseña</RouterLink></li>
          <li><RouterLink @click="mobileOpen = false" to="/profile/me" class="block px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5">Mi Perfil</RouterLink></li>
          <li><button @click="handleLogout" class="w-full text-left px-3 py-2 rounded-lg text-neon-pink hover:bg-white/5 cursor-pointer">Salir</button></li>
        </template>
        <template v-else>
          <li><RouterLink @click="mobileOpen = false" to="/login" class="block px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5">Ingresar</RouterLink></li>
          <li><RouterLink @click="mobileOpen = false" to="/register" class="block px-3 py-2 rounded-lg text-neon-cyan hover:bg-white/5">Crear cuenta</RouterLink></li>
        </template>
      </ul>
    </div>
  </header>
</template>
