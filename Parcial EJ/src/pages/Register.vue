<script>
import { register } from '../services/auth.js';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        email: '',
        displayName: '',
        password: '',
        confirmPassword: '',
      },
      loading: false,
      errorMsg: '',
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMsg = '';

      if (this.form.password !== this.form.confirmPassword) {
        this.errorMsg = 'Las contraseñas no coinciden.';
        return;
      }
      if ((this.form.password?.length ?? 0) < 6) {
        this.errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
        return;
      }

      this.loading = true;
      try {
        await register({
          email: this.form.email,
          password: this.form.password,
          displayName: this.form.displayName,
        });
        this.$router.push('/feed');
      } catch (error) {
        this.errorMsg = error?.message ?? 'Error al crear la cuenta.';
      }
      this.loading = false;
    },
  },
}
</script>

<template>
  <section class="max-w-md mx-auto py-8">
    <div class="text-center mb-8">
      <span class="text-4xl block mb-3">🚀</span>
      <h1 class="font-heading text-3xl font-bold text-white">Crear Cuenta</h1>
      <p class="text-gray-400 mt-2">Unite a la comunidad de GamerZone</p>
    </div>

    <div v-if="errorMsg" class="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-300 text-sm">
      ⚠️ {{ errorMsg }}
    </div>

    <form @submit.prevent="handleSubmit" class="card-gaming space-y-5">
      <div>
        <label class="label-gaming" for="reg-name">Nombre de usuario</label>
        <input
          type="text"
          id="reg-name"
          class="input-gaming"
          placeholder="GamerPro123"
          v-model="form.displayName"
          required
        />
      </div>
      <div>
        <label class="label-gaming" for="reg-email">Email</label>
        <input
          type="email"
          id="reg-email"
          class="input-gaming"
          placeholder="tu@email.com"
          v-model="form.email"
          required
        />
      </div>
      <div>
        <label class="label-gaming" for="reg-password">Contraseña</label>
        <input
          type="password"
          id="reg-password"
          class="input-gaming"
          placeholder="Mínimo 6 caracteres"
          v-model="form.password"
          required
          minlength="6"
        />
      </div>
      <div>
        <label class="label-gaming" for="reg-confirm">Confirmar contraseña</label>
        <input
          type="password"
          id="reg-confirm"
          class="input-gaming"
          placeholder="Repetí tu contraseña"
          v-model="form.confirmPassword"
          required
        />
      </div>
      <button
        type="submit"
        class="btn-primary w-full"
        :disabled="loading"
      >
        {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
      </button>
    </form>

    <p class="text-center text-gray-400 mt-6">
      ¿Ya tenés cuenta?
      <RouterLink to="/login" class="text-neon-cyan hover:underline font-semibold">Ingresá acá</RouterLink>
    </p>
  </section>
</template>
