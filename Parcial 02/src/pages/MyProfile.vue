<script>
import UserAvatar from '../components/UserAvatar.vue';
import PostCard from '../components/PostCard.vue';
import { subscribeToAuthStateChange, updatePassword } from '../services/auth.js';
import { getUserProfileById, updateUserProfile } from '../services/user-profiles.js';
import { getPostsByUserId } from '../services/posts.js';
import { uploadAvatar } from '../services/avatars.js';

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE_MB = 0.5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export default {
  name: 'MyProfile',
  components: { UserAvatar, PostCard },
  data() {
    return {
      user: {
        id: null,
        email: null,
      },
      profile: null,
      posts: [],
      loading: true,
      editMode: false,
      editForm: {
        display_name: '',
        bio: '',
        favorite_platform: '',
        avatar_url: '',
      },
      avatarState: {
        file: null,
        preview: null,
      },
      avatarInputKey: 0,
      passwordForm: {
        newPassword: '',
        confirmPassword: '',
      },
      savingProfile: false,
      savingPassword: false,
      profileMsg: '',
      passwordMsg: '',
      profileError: '',
      passwordError: '',
      platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Móvil'],
      maxImageSizeMB: MAX_IMAGE_SIZE_MB,
    };
  },

  computed: {
    userId() {
      return this.user.id;
    },
    avatarPreviewForForm() {
      return this.avatarState.preview || this.editForm.avatar_url || null;
    },
  },

  mounted() {
    subscribeToAuthStateChange(userData => {
      this.user = userData;
    });
  },

  watch: {
    userId: {
      immediate: true,
      handler(newId) {
        if (newId) this.loadData();
      },
    },
  },

  methods: {
    async loadData() {
      this.loading = true;
      try {
        const [profile, posts] = await Promise.all([
          getUserProfileById(this.userId),
          getPostsByUserId(this.userId),
        ]);
        this.profile = profile;
        this.posts = posts ?? [];
      } catch (err) {
        console.error(err);
      }
      this.loading = false;
    },

    resetAvatarSelection() {
      if (this.avatarState.preview) {
        URL.revokeObjectURL(this.avatarState.preview);
      }

      this.avatarState = {
        file: null,
        preview: null,
      };
      this.avatarInputKey += 1;
    },

    startEdit() {
      this.editMode = true;
      this.editForm = {
        display_name: this.profile?.display_name ?? '',
        bio: this.profile?.bio ?? '',
        favorite_platform: this.profile?.favorite_platform ?? '',
        avatar_url: this.profile?.avatar_url ?? '',
      };
      this.resetAvatarSelection();
      this.profileMsg = '';
      this.profileError = '';
    },

    cancelEdit() {
      this.editMode = false;
      this.resetAvatarSelection();
      this.profileMsg = '';
      this.profileError = '';
    },

    handleAvatarChange(ev) {
      const selectedFile = ev.target.files?.[0] ?? null;
      this.profileError = '';

      if (this.avatarState.preview) {
        URL.revokeObjectURL(this.avatarState.preview);
      }

      if (!selectedFile) {
        this.avatarState = { file: null, preview: null };
        return;
      }

      if (!VALID_IMAGE_TYPES.includes(selectedFile.type)) {
        this.avatarState = { file: null, preview: null };
        this.profileError = 'Formato inválido. Usá JPG, PNG, WEBP o GIF.';
        ev.target.value = '';
        return;
      }

      if (selectedFile.size > MAX_IMAGE_SIZE_BYTES) {
        this.avatarState = { file: null, preview: null };
        this.profileError = `La imagen supera el tamaño permitido (${MAX_IMAGE_SIZE_MB*1024} KB).`;
        ev.target.value = '';
        return;
      }

      this.avatarState = {
        file: selectedFile,
        preview: URL.createObjectURL(selectedFile),
      };
    },

    async saveProfile() {
      this.profileMsg = '';
      this.profileError = '';
      this.savingProfile = true;

      try {
        let avatarUrl = this.editForm.avatar_url || null;

        if (this.avatarState.file) {
          avatarUrl = await uploadAvatar(this.userId, this.avatarState.file);
        }

        await updateUserProfile(this.userId, {
          display_name: this.editForm.display_name || null,
          bio: this.editForm.bio || null,
          favorite_platform: this.editForm.favorite_platform || null,
          avatar_url: avatarUrl,
        });

        this.profileMsg = '¡Perfil actualizado correctamente!';
        this.editMode = false;
        this.resetAvatarSelection();
        await this.loadData();
      } catch (error) {
        this.profileError = error?.message ?? 'Error al guardar el perfil.';
      }

      this.savingProfile = false;
    },

    async changePassword() {
      this.passwordMsg = '';
      this.passwordError = '';

      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordError = 'Las contraseñas no coinciden.';
        return;
      }
      if ((this.passwordForm.newPassword?.length ?? 0) < 6) {
        this.passwordError = 'La contraseña debe tener al menos 6 caracteres.';
        return;
      }

      this.savingPassword = true;
      try {
        await updatePassword(this.passwordForm.newPassword);
        this.passwordMsg = '¡Contraseña actualizada correctamente!';
        this.passwordForm = { newPassword: '', confirmPassword: '' };
      } catch (error) {
        this.passwordError = error?.message ?? 'Error al cambiar la contraseña.';
      }
      this.savingPassword = false;
    },
  },

  unmounted() {
    this.resetAvatarSelection();
  },
}
</script>

<template>
  <section>
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-400 mt-4">Cargando tu perfil...</p>
    </div>

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
            <button v-if="!editMode" @click="startEdit" class="btn-secondary mt-4 text-sm cursor-pointer">
              ✏️ Editar perfil
            </button>
          </div>
        </div>
      </div>

      <div v-if="editMode" class="card-gaming mb-8">
        <h2 class="font-heading text-xl font-bold text-white mb-4">✏️ Editar Perfil</h2>

        <div v-if="profileMsg" class="mb-4 p-3 rounded-lg bg-green-900/30 border border-green-500/50 text-green-300 text-sm">
          ✅ {{ profileMsg }}
        </div>
        <div v-if="profileError" class="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-300 text-sm">
          ⚠️ {{ profileError }}
        </div>

        <form @submit.prevent="saveProfile" class="space-y-4">
          <div>
            <label class="label-gaming" for="edit-name">Nombre de usuario</label>
            <input type="text" id="edit-name" class="input-gaming" v-model="editForm.display_name" />
          </div>
          <div>
            <label class="label-gaming" for="edit-bio">Bio</label>
            <textarea id="edit-bio" class="input-gaming" v-model="editForm.bio" rows="3" placeholder="Contá algo sobre vos..."></textarea>
          </div>
          <div>
            <label class="label-gaming" for="edit-platform">Plataforma favorita</label>
            <select id="edit-platform" class="input-gaming" v-model="editForm.favorite_platform">
              <option value="">Seleccionar...</option>
              <option v-for="p in platforms" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>

          <div>
            <label class="label-gaming" for="edit-avatar-file">Avatar (opcional)</label>
            <input
              :key="avatarInputKey"
              type="file"
              id="edit-avatar-file"
              class="input-gaming"
              accept="image/jpeg,image/png,image/webp,image/gif"
              @change="handleAvatarChange"
            />
            <p class="text-xs text-gray-500 mt-2">
              Formatos permitidos: JPG, PNG, WEBP o GIF. Tamaño máximo: {{ maxImageSizeMB * 1024 }} KB.
            </p>
          </div>

          <div v-if="avatarPreviewForForm" class="rounded-lg border border-gaming-border p-3 bg-gaming-darker">
            <p class="text-sm text-gray-400 mb-2">Previsualización del avatar</p>
            <img :src="avatarPreviewForForm" alt="Previsualización de avatar" class="w-28 h-28 object-cover rounded-full border border-gaming-border" />
          </div>

          <div class="flex gap-3">
            <button type="submit" class="btn-primary" :disabled="savingProfile">
              {{ savingProfile ? 'Guardando cambios y subiendo avatar...' : 'Guardar cambios' }}
            </button>
            <button type="button" @click="cancelEdit" class="btn-secondary cursor-pointer">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="card-gaming mb-8">
        <h2 class="font-heading text-xl font-bold text-white mb-4">🔒 Cambiar Contraseña</h2>

        <div v-if="passwordMsg" class="mb-4 p-3 rounded-lg bg-green-900/30 border border-green-500/50 text-green-300 text-sm">
          ✅ {{ passwordMsg }}
        </div>
        <div v-if="passwordError" class="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-300 text-sm">
          ⚠️ {{ passwordError }}
        </div>

        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="label-gaming" for="new-password">Nueva contraseña</label>
            <input type="password" id="new-password" class="input-gaming" v-model="passwordForm.newPassword" placeholder="Mínimo 6 caracteres" minlength="6" required />
          </div>
          <div>
            <label class="label-gaming" for="confirm-new-password">Confirmar nueva contraseña</label>
            <input type="password" id="confirm-new-password" class="input-gaming" v-model="passwordForm.confirmPassword" placeholder="Repetí tu contraseña" required />
          </div>
          <button type="submit" class="btn-primary" :disabled="savingPassword">
            {{ savingPassword ? 'Actualizando...' : 'Actualizar contraseña' }}
          </button>
        </form>
      </div>

      <h2 class="font-heading text-xl font-bold text-white mb-4">
        📝 Mis Reseñas ({{ posts?.length ?? 0 }})
      </h2>

      <div v-if="(posts?.length ?? 0) === 0" class="text-center py-12 card-gaming">
        <p class="text-gray-400">Todavía no publicaste reseñas.</p>
        <RouterLink to="/post/new" class="btn-primary mt-4 inline-block">Crear mi primera reseña</RouterLink>
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
