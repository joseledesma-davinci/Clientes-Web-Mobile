<script>
import { subscribeToAuthStateChange } from '../services/auth.js';
import { createPost } from '../services/posts.js';
import { getPublicURL, uploadFile } from '../services/storage.js';

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE_MB = 0.5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export default {
  name: 'NewPost',
  data() {
    return {
      form: {
        game_title: '',
        platform: 'PC',
        rating: 5,
        content: '',
      },
      photo: {
        file: null,
        preview: null,
      },
      user: {
        id: null,
        email: null,
      },
      loading: false,
      errorMsg: '',
      successMsg: '',
      platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Móvil'],
      maxImageSizeMB: MAX_IMAGE_SIZE_MB,
    };
  },

  mounted() {
    subscribeToAuthStateChange((userData) => {
      this.user = userData;
    });
  },

  methods: {
    handlePhotoChange(ev) {
      const selectedFile = ev.target.files?.[0] ?? null;

      if (this.photo.preview) {
        URL.revokeObjectURL(this.photo.preview);
      }

      this.errorMsg = '';

      if (!selectedFile) {
        this.photo = { file: null, preview: null };
        return;
      }

      if (!VALID_IMAGE_TYPES.includes(selectedFile.type)) {
        this.photo = { file: null, preview: null };
        this.errorMsg = 'Formato inválido. Usá JPG, PNG, WEBP o GIF.';
        ev.target.value = '';
        return;
      }

      if (selectedFile.size > MAX_IMAGE_SIZE_BYTES) {
        this.photo = { file: null, preview: null };
        this.errorMsg = `La imagen supera el tamaño permitido (${MAX_IMAGE_SIZE_MB*1024} KB).`;
        ev.target.value = '';
        return;
      }

      this.photo.file = selectedFile;
      this.photo.preview = URL.createObjectURL(selectedFile);
    },

    async uploadPostImageIfAny() {
      if (!this.photo.file) return null;

      const sanitizedName = this.photo.file.name.replace(/\s+/g, '-').toLowerCase();
      const filename = `${this.user.id}/${Date.now()}-${sanitizedName}`;

      await uploadFile(filename, this.photo.file, 'post-images');
      return getPublicURL(filename, 'post-images');
    },

    resetForm() {
      if (this.photo.preview) {
        URL.revokeObjectURL(this.photo.preview);
      }

      this.form = { game_title: '', platform: 'PC', rating: 5, content: '' };
      this.photo = { file: null, preview: null };
    },

    async handleSubmit() {
      this.errorMsg = '';
      this.successMsg = '';
      this.loading = true;

      try {
        const imageUrl = await this.uploadPostImageIfAny();

        await createPost({
          user_id: this.user.id,
          game_title: this.form.game_title,
          platform: this.form.platform,
          rating: Number(this.form.rating),
          content: this.form.content,
          image_url: imageUrl,
        });

        this.successMsg = '¡Reseña publicada con éxito!';
        this.resetForm();

        setTimeout(() => {
          this.$router.push('/feed');
        }, 1500);
      } catch (error) {
        this.errorMsg = error?.message ?? 'Error al publicar la reseña.';
      }

      this.loading = false;
    },
  },

  unmounted() {
    if (this.photo.preview) {
      URL.revokeObjectURL(this.photo.preview);
    }
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

      <div>
        <label class="label-gaming" for="post-image">Foto de la publicación (opcional)</label>
        <input
          id="post-image"
          type="file"
          class="input-gaming"
          accept="image/jpeg,image/png,image/webp,image/gif"
          @change="handlePhotoChange"
        />
        <p class="text-xs text-gray-500 mt-2">Formatos permitidos: JPG, PNG, WEBP o GIF. Tamaño máximo: {{ maxImageSizeMB * 1024 }} KB.</p>
      </div>

      <div v-if="photo.preview" class="rounded-lg border border-gaming-border p-3 bg-gaming-darker">
        <p class="text-sm text-gray-400 mb-2">Previsualización</p>
        <img :src="photo.preview" alt="Previsualización de imagen" class="w-full max-h-72 object-cover rounded-lg" />
      </div>

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
