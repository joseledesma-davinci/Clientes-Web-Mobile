<script>
import UserAvatar from '../components/UserAvatar.vue';
import PostCard from '../components/PostCard.vue';
import { getUserProfileById } from '../services/user-profiles.js';
import { getPostsByUserId } from '../services/posts.js';

export default {
  name: 'UserProfile',
  components: { UserAvatar, PostCard },
  data() {
    return {
      profile: null,
      posts: [],
      loading: true,
      errorMsg: '',
    };
  },
  async mounted() {
    await this.loadProfile();
  },
  watch: {
    '$route.params.id'() {
      this.loadProfile();
    },
  },
  methods: {
    async loadProfile() {
      this.loading = true;
      this.errorMsg = '';
      const userId = this.$route.params?.id;

      if (!userId) {
        this.errorMsg = 'ID de usuario no válido.';
        this.loading = false;
        return;
      }

      try {
        const [profile, posts] = await Promise.all([
          getUserProfileById(userId),
          getPostsByUserId(userId),
        ]);
        this.profile = profile;
        this.posts = posts ?? [];

        if (!profile) {
          this.errorMsg = 'Perfil no encontrado.';
        }
      } catch (error) {
        this.errorMsg = error?.message ?? 'Error al cargar el perfil.';
      }
      this.loading = false;
    },
  },
}
</script>

<template>
  <section>
    <!-- Cargando -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-400 mt-4">Cargando perfil...</p>
    </div>

    <!-- Error -->
    <div v-else-if="errorMsg" class="text-center py-16">
      <p class="text-red-400 text-lg">⚠️ {{ errorMsg }}</p>
      <RouterLink to="/feed" class="btn-secondary mt-4 inline-block">Volver al Feed</RouterLink>
    </div>

    <!-- Perfil -->
    <template v-else>
      <div class="card-gaming mb-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <UserAvatar
            :name="profile?.display_name ?? 'Gamer'"
            :avatar-url="profile?.avatar_url"
            size="xl"
          />
          <div class="flex-1 text-center sm:text-left">
            <h1 class="font-heading text-2xl md:text-3xl font-bold text-white">
              {{ profile?.display_name ?? 'Gamer Anónimo' }}
            </h1>
            <p class="text-gray-400 mt-1">{{ profile?.email }}</p>
            <p v-if="profile?.bio" class="text-gray-300 mt-3">{{ profile.bio }}</p>
            <div v-if="profile?.favorite_platform" class="mt-3">
              <span class="text-xs bg-gaming-darker px-3 py-1 rounded-full text-neon-cyan border border-gaming-border">
                🎮 {{ profile.favorite_platform }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Posts del usuario -->
      <h2 class="font-heading text-xl font-bold text-white mb-4">
        📝 Reseñas ({{ posts?.length ?? 0 }})
      </h2>

      <div v-if="(posts?.length ?? 0) === 0" class="text-center py-12 card-gaming">
        <p class="text-gray-400">Este usuario todavía no publicó reseñas.</p>
      </div>

      <div v-else class="space-y-6">
        <PostCard
          v-for="post in posts"
          :key="post?.id"
          :post="post"
        />
      </div>
    </template>
  </section>
</template>
