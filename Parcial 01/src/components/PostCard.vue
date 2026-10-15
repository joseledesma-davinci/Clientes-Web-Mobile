<script>
import UserAvatar from './UserAvatar.vue';

export default {
  name: 'PostCard',
  components: { UserAvatar },
  props: {
    post: { type: Object, required: true },
  },
  computed: {
    authorName() {
      return this.post?.user_profiles?.display_name ?? 'Gamer Anónimo';
    },
    authorAvatar() {
      return this.post?.user_profiles?.avatar_url ?? null;
    },
    authorPlatform() {
      return this.post?.user_profiles?.favorite_platform ?? null;
    },
    formattedDate() {
      if (!this.post?.created_at) return '';
      const d = new Date(this.post.created_at);
      return d.toLocaleDateString('es-AR', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    },
    stars() {
      const r = this.post?.rating ?? 0;
      return Array.from({ length: 5 }, (_, i) => i < r);
    },
    platformIcon() {
      const icons = {
        'PC': '🖥️',
        'PlayStation': '🎮',
        'Xbox': '🟢',
        'Nintendo': '🍄',
        'Móvil': '📱',
      };
      return icons[this.post?.platform] ?? '🎮';
    },
  },
}
</script>

<template>
  <article class="card-gaming">
    <!-- Cabecera: avatar + autor + fecha -->
    <div class="flex items-center gap-3 mb-4">
      <RouterLink :to="'/profile/' + post?.user_id" class="flex-shrink-0">
        <UserAvatar :name="authorName" :avatar-url="authorAvatar" size="md" />
      </RouterLink>
      <div class="flex-1 min-w-0">
        <RouterLink :to="'/profile/' + post?.user_id" class="font-heading font-semibold text-white hover:text-neon-cyan transition-colors">
          {{ authorName }}
        </RouterLink>
        <p class="text-xs text-gray-500">{{ formattedDate }}</p>
      </div>
      <span v-if="authorPlatform" class="text-xs bg-gaming-darker px-2 py-1 rounded-full text-gray-400 border border-gaming-border">
        {{ authorPlatform }}
      </span>
    </div>

    <!-- Título del juego + plataforma -->
    <div class="mb-3">
      <h3 class="font-heading text-lg font-bold text-neon-cyan flex items-center gap-2">
        <span>{{ platformIcon }}</span>
        {{ post?.game_title ?? 'Sin título' }}
      </h3>
      <div class="flex items-center gap-1 mt-1">
        <span v-if="post?.platform" class="text-xs text-gray-400">{{ post.platform }}</span>
        <span class="text-xs text-gray-600 mx-1">•</span>
        <span class="flex gap-0.5">
          <span
            v-for="(filled, i) in stars"
            :key="i"
            class="text-sm"
            :class="filled ? 'text-yellow-400' : 'text-gray-600'"
          >★</span>
        </span>
      </div>
    </div>

    <!-- Contenido -->
    <p class="text-gray-300 leading-relaxed whitespace-pre-line">{{ post?.content }}</p>

    <!-- Imagen (si existe) -->
    <div v-if="post?.image_url" class="mt-4 rounded-lg overflow-hidden">
      <img
        :src="post.image_url"
        :alt="post?.game_title ?? 'Imagen del post'"
        class="w-full max-h-80 object-cover rounded-lg"
      />
    </div>
    
  </article>
</template>
