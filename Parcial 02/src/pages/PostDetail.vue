<script>
import PostCard from '../components/PostCard.vue';
import { getPostById } from '../services/posts.js';

export default {
  name: 'PostDetail',
  components: { PostCard },
  data() {
    return {
      post: null,
      loading: true,
      errorMsg: '',
    };
  },
  async mounted() {
    await this.loadPost();
  },
  watch: {
    '$route.params.id'() {
      this.loadPost();
    },
  },
  methods: {
    async loadPost() {
      this.loading = true;
      this.errorMsg = '';

      const postId = Number(this.$route.params?.id);
      if (!postId) {
        this.errorMsg = 'ID de publicación inválido.';
        this.loading = false;
        return;
      }

      try {
        this.post = await getPostById(postId);
      } catch (error) {
        this.errorMsg = error?.message ?? 'No se pudo cargar la publicación.';
      }

      this.loading = false;
    },
  },
}
</script>

<template>
  <section>
    <div class="mb-5">
      <RouterLink to="/feed" class="btn-secondary inline-block">← Volver al Feed</RouterLink>
    </div>

    <div v-if="loading" class="text-center py-16">
      <div class="inline-block w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-400 mt-4">Cargando publicación...</p>
    </div>

    <div v-else-if="errorMsg" class="text-center py-16 card-gaming">
      <p class="text-red-400">⚠️ {{ errorMsg }}</p>
    </div>

    <PostCard v-else :post="post" :show-comments="true" />
  </section>
</template>