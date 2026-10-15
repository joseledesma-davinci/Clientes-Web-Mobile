<script>
import PostCard from '../components/PostCard.vue';
import { getAllPosts, subscribeToNewPosts } from '../services/posts.js';
import { getUserProfileById } from '../services/user-profiles.js';

export default {
  name: 'Feed',
  components: { PostCard },
  data() {
    return {
      posts: [],
      loading: true,
      errorMsg: '',
      channel: null,
    };
  },
  async mounted() {
    try {
      this.posts = await getAllPosts();
    } catch (error) {
      this.errorMsg = error?.message ?? 'Error al cargar el feed.';
    }
    this.loading = false;

    // Suscripción en tiempo real a nuevos posts.
    this.channel = subscribeToNewPosts(async (newPost) => {
      // El nuevo post viene sin los datos del autor; los cargamos.
      try {
        const profile = await getUserProfileById(newPost?.user_id);
        newPost.user_profiles = profile ?? { display_name: 'Gamer', avatar_url: null, favorite_platform: null };
      } catch {
        newPost.user_profiles = { display_name: 'Gamer', avatar_url: null, favorite_platform: null };
      }
      // Evitar duplicados.
      const exists = this.posts?.some?.(p => p?.id === newPost?.id);
      if (!exists) {
        this.posts.unshift(newPost);
      }
    });
  },
  beforeUnmount() {
    // Desuscribirse del canal de Realtime al salir de la vista.
    this.channel?.unsubscribe?.();
  },
}
</script>

<template>
  <section>
    <header class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-bold text-white">📰 Feed Global</h1>
        <p class="text-gray-400 mt-1">Las últimas reseñas de la comunidad gaming</p>
      </div>
      <RouterLink to="/post/new" class="btn-primary hidden sm:inline-flex">
        + Nueva Reseña
      </RouterLink>
    </header>

    <!-- Estado de carga -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-400 mt-4">Cargando reseñas...</p>
    </div>

    <!-- Error -->
    <div v-else-if="errorMsg" class="text-center py-16">
      <p class="text-red-400">⚠️ {{ errorMsg }}</p>
    </div>

    <!-- Sin posts -->
    <div v-else-if="(posts?.length ?? 0) === 0" class="text-center py-16 card-gaming">
      <span class="text-5xl block mb-4">🎮</span>
      <p class="text-gray-400 text-lg">Todavía no hay reseñas. ¡Sé el primero en publicar!</p>
      <RouterLink to="/post/new" class="btn-primary mt-4 inline-block">Crear primera reseña</RouterLink>
    </div>

    <!-- Lista de posts -->
    <div v-else class="space-y-6">
      <PostCard
        v-for="post in posts"
        :key="post?.id"
        :post="post"
      />
    </div>

    <!-- Botón flotante móvil -->
    <RouterLink
      to="/post/new"
      class="sm:hidden fixed bottom-8 right-6 btn-primary w-14 h-14 flex items-center justify-center rounded-full text-2xl shadow-lg"
    >
      +
    </RouterLink>
  </section>
</template>
