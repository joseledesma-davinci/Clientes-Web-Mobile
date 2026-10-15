<script>
import { subscribeToAuthStateChange } from '../services/auth.js';

export default {
  name: 'Home',

  data() {
    return {
      // Estado inicial "deslogueado"
      user: {
        id: null,
        email: null,
      },
    };
  },

  computed: {
    isLoggedIn() {
      return this.user.id !== null;
    },
  },

  mounted() {
    subscribeToAuthStateChange((userData) => {
      this.user = userData;
    });
  },
}

</script>

<template>
  <section class="flex flex-col items-center justify-center text-center py-16">
    <!-- Hero -->
    <div class="mb-8">
      <span class="text-6xl mb-4 block">🎮</span>
      <h1 class="font-heading text-4xl md:text-5xl font-black mb-4">
        Bienvenido a
        <span class="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent glow-text">
          GamerZone
        </span>
      </h1>
      <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
        La red social para gamers. Compartí tus reseñas de videojuegos,
        descubrí nuevos títulos y conectá con la comunidad gaming.
      </p>
    </div>

    <!-- CTA -->
    <div class="flex flex-wrap gap-4 justify-center mb-16">
      <template v-if="isLoggedIn">
        <RouterLink to="/feed" class="btn-primary text-lg">📰 Ir al Feed</RouterLink>
        <RouterLink to="/post/new" class="btn-secondary text-lg">✍️ Nueva Reseña</RouterLink>
      </template>
      <template v-else>
        <RouterLink to="/register" class="btn-primary text-lg">🚀 Crear cuenta gratis</RouterLink>
        <RouterLink to="/login" class="btn-secondary text-lg">🔑 Ya tengo cuenta</RouterLink>
      </template>
    </div>

    <!-- Features -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      <article class="card-gaming text-center">
        <div class="text-4xl mb-3">📝</div>
        <h2 class="font-heading text-lg font-bold text-white mb-2">Reseñas</h2>
        <p class="text-gray-400 text-sm">Compartí tu opinión sobre los juegos que estás jugando con puntuación y plataforma.</p>
      </article>
      <article class="card-gaming text-center">
        <div class="text-4xl mb-3">⚡</div>
        <h2 class="font-heading text-lg font-bold text-white mb-2">Tiempo Real</h2>
        <p class="text-gray-400 text-sm">El feed se actualiza instantáneamente cuando alguien publica una nueva reseña.</p>
      </article>
      <article class="card-gaming text-center">
        <div class="text-4xl mb-3">👤</div>
        <h2 class="font-heading text-lg font-bold text-white mb-2">Perfiles</h2>
        <p class="text-gray-400 text-sm">Personalizá tu perfil y explorá los perfiles de otros gamers de la comunidad.</p>
      </article>
    </section>
  </section>
</template>
