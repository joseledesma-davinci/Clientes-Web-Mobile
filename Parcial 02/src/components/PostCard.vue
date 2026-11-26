<script>
import UserAvatar from './UserAvatar.vue';
import { subscribeToAuthStateChange } from '../services/auth.js';
import { createComment, deleteComment, getCommentsByPostId } from '../services/comments.js';

export default {
  name: 'PostCard',
  components: { UserAvatar },
  props: {
    post: { type: Object, required: true },
    showComments: { type: Boolean, default: true },
  },
  data() {
    return {
      comments: [],
      commentText: '',
      loadingComments: false,
      loadingCommentSubmit: false,
      deletingCommentId: null,
      commentErrorMsg: '',
      user: {
        id: null,
        email: null,
      },
    };
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
    postImageUrl() {
      return this.post?.image_url ?? '/img/post.png';
    },
    hasRealImage() {
      return Boolean(this.post?.image_url);
    },
  },
  async mounted() {
    subscribeToAuthStateChange((userData) => {
      this.user = userData;
    });

    if (this.showComments) {
      await this.loadComments();
    }
  },
  methods: {
    formatCommentDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    },

    async loadComments() {
      this.loadingComments = true;
      this.commentErrorMsg = '';

      try {
        this.comments = await getCommentsByPostId(this.post.id);
      } catch (error) {
        this.commentErrorMsg = error?.message ?? 'No se pudieron cargar los comentarios.';
      }

      this.loadingComments = false;
    },

    async handleCommentSubmit() {
      this.commentErrorMsg = '';

      if (!this.user?.id) {
        this.commentErrorMsg = 'Necesitás iniciar sesión para comentar.';
        return;
      }

      const content = this.commentText?.trim?.();
      if (!content) {
        this.commentErrorMsg = 'Escribí un comentario antes de enviarlo.';
        return;
      }

      this.loadingCommentSubmit = true;

      try {
        const newComment = await createComment({
          post_id: this.post.id,
          user_id: this.user.id,
          content,
        });

        this.comments.push(newComment);
        this.commentText = '';
      } catch (error) {
        this.commentErrorMsg = error?.message ?? 'No se pudo publicar el comentario.';
      }

      this.loadingCommentSubmit = false;
    },

    async handleDeleteComment(comment) {
      if (!this.user?.id || comment?.user_id !== this.user.id) return;

      this.commentErrorMsg = '';
      this.deletingCommentId = comment.id;

      try {
        await deleteComment({ commentId: comment.id, userId: this.user.id });
        this.comments = this.comments.filter((c) => c.id !== comment.id);
      } catch (error) {
        this.commentErrorMsg = error?.message ?? 'No se pudo eliminar el comentario.';
      }

      this.deletingCommentId = null;
    },
  },
}
</script>

<template>
  <article class="card-gaming">
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

    <div class="mb-3">
      <RouterLink :to="`/post/${post?.id}`" class="font-heading text-lg font-bold text-neon-cyan flex items-center gap-2 hover:underline">
        <span>{{ platformIcon }}</span>
        {{ post?.game_title ?? 'Sin título' }}
      </RouterLink>
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

    <p class="text-gray-300 leading-relaxed whitespace-pre-line">{{ post?.content }}</p>

    <div v-if="post?.image_url" class="mt-4 rounded-lg overflow-hidden border border-gaming-border relative">
      <img
        :src="postImageUrl"
        :alt="post?.game_title ?? 'Imagen del post'"
        class="w-full max-h-80 object-cover rounded-lg"
      />
    </div>

    <section v-if="showComments" class="mt-5 border-t border-gaming-border pt-4">
      <h4 class="font-heading text-white font-semibold mb-3">💬 Comentarios ({{ comments.length }})</h4>

      <div v-if="commentErrorMsg" class="mb-3 p-2 rounded bg-red-900/30 border border-red-500/40 text-red-300 text-xs">
        {{ commentErrorMsg }}
      </div>

      <form @submit.prevent="handleCommentSubmit" class="mb-4">
        <label class="sr-only" :for="`comment-${post?.id}`">Escribir comentario</label>
        <div class="flex flex-col sm:flex-row gap-2">
          <textarea
            :id="`comment-${post?.id}`"
            v-model="commentText"
            class="input-gaming min-h-24"
            placeholder="Escribí tu comentario..."
            maxlength="500"
          ></textarea>
          <button
            type="submit"
            class="btn-primary sm:self-end"
            :disabled="loadingCommentSubmit"
          >
            {{ loadingCommentSubmit ? 'Publicando...' : 'Comentar' }}
          </button>
        </div>
      </form>

      <p v-if="loadingComments" class="text-sm text-gray-400">Cargando comentarios...</p>

      <p v-else-if="comments.length === 0" class="text-sm text-gray-500">Todavía no hay comentarios en esta publicación.</p>

      <ul v-else class="space-y-3">
        <li
          v-for="comment in comments"
          :key="comment.id"
          class="bg-gaming-darker border border-gaming-border rounded-lg p-3"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-white">{{ comment?.user_profiles?.display_name ?? 'Gamer' }}</p>
              <p class="text-xs text-gray-500">{{ formatCommentDate(comment?.created_at) }}</p>
            </div>

          </div>

          <p class="text-sm text-gray-300 mt-2 whitespace-pre-line">{{ comment.content }}</p>
        </li>
      </ul>
    </section>
  </article>
</template>
