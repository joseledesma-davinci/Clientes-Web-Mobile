<script>
import { subscribeToAuthStateChange } from '../services/auth.js';
import { createPost } from '../services/posts.js';

export default {
  name: 'NewPost',
  data() {
    return {
      form: {
        game_title: '',
        platform: 'PC',
        rating: 5,
        content: '',
        // image_url: '',
      },
      user: {
        id: null,
        email: null,
      },
      loading: false,
      errorMsg: '',
      successMsg: '',
      platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Móvil'],
    };
  },
  
  mounted() {
    subscribeToAuthStateChange((userData) => {
      this.user = userData;
    });
  },

  methods: {
    async handleSubmit() {
      this.errorMsg = '';
      this.successMsg = '';
      this.loading = true;

      try {
        await createPost({
          user_id: this.user.id,
          game_title: this.form.game_title,
          platform: this.form.platform,
          rating: Number(this.form.rating),
          content: this.form.content,
          // image_url: this.form.image_url || null,
        });

        this.successMsg = '¡Reseña publicada con éxito!';

        // Limpiar formulario.
        this.form = { game_title: '', platform: 'PC', rating: 5, content: '', image_url: '' };

        // Redirigir al feed después de 1.5s.
        setTimeout(() => {
          this.$router.push('/feed');
        }, 1500);
      } catch (error) {
        this.errorMsg = error?.message ?? 'Error al publicar la reseña.';
      }
      this.loading = false;
    },
  },
}
</script>

<template>
  <section class="max-w-2xl mx-auto py-8">
    <div class="text-center mb-8">
      <span class="text-4xl block mb-3">✍️</span>
      <h1 class="font-heading text-3xl font-bold text-white">Nueva Reseña</h1>
      <p class="text-gray-400 mt-2">Compartí tu experiencia con un videojuego</p>
    </div>

    <div v-if="errorMsg" class="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-300 text-sm">
      ⚠️ {{ errorMsg }}
    </div>
    <div v-if="successMsg" class="mb-4 p-3 rounded-lg bg-green-900/30 border border-green-500/50 text-green-300 text-sm">
      ✅ {{ successMsg }}
    </div>

    <form @submit.prevent="handleSubmit" class="card-gaming space-y-5">
      <div>
        <label class="label-gaming" for="game-title">Título del juego</label>
        <input
          type="text"
          id="game-title"
          class="input-gaming"
          placeholder="Ej: The Legend of Zelda: Tears of the Kingdom"
          v-model="form.game_title"
          required
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label class="label-gaming" for="platform">Plataforma</label>
          <select
            id="platform"
            class="input-gaming"
            v-model="form.platform"
          >
            <option v-for="p in platforms" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
        <div>
          <label class="label-gaming" for="rating">Puntuación (1-5 ★)</label>
          <div class="flex items-center gap-2 mt-1">
            <input
              type="range"
              id="rating"
              min="1"
              max="5"
              step="1"
              v-model="form.rating"
              class="flex-1 accent-neon-purple"
            />
            <span class="font-heading text-xl font-bold text-neon-cyan w-8 text-center">{{ form.rating }}</span>
          </div>
          <div class="flex gap-0.5 mt-1">
            <span
              v-for="i in 5"
              :key="i"
              class="text-lg"
              :class="i <= form.rating ? 'text-yellow-400' : 'text-gray-600'"
            >★</span>
          </div>
        </div>
      </div>

      <div>
        <label class="label-gaming" for="content">Tu reseña</label>
        <textarea
          id="content"
          class="input-gaming min-h-32"
          placeholder="Contá qué te pareció el juego, qué te gustó y qué no..."
          v-model="form.content"
          required
          rows="5"
        ></textarea>
      </div>

      <!-- <div>
        <label class="label-gaming" for="image-url">URL de imagen (opcional)</label>
        <input
          type="url"
          id="image-url"
          class="input-gaming"
          placeholder="https://ejemplo.com/imagen.jpg"
          v-model="form.image_url"
        />
      </div> -->

      <div class="flex gap-4">
        <button
          type="submit"
          class="btn-primary flex-1"
          :disabled="loading"
        >
          {{ loading ? 'Publicando...' : '🚀 Publicar reseña' }}
        </button>
        <RouterLink to="/feed" class="btn-secondary">
          Cancelar
        </RouterLink>
      </div>
    </form>
  </section>
</template>
