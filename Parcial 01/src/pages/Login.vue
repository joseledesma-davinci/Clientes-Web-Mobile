<script>
import { login } from '../services/auth.js';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
      errorMsg: '',
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMsg = '';
      this.loading = true;
      try {
        await login({
          email: this.form.email,
          password: this.form.password,
        });
        this.$router.push('/feed');
      } catch (error) {
        this.errorMsg = error?.message ?? 'Error al iniciar sesión. Verificá tus datos.';
      }
      this.loading = false;
    },
  },
}
</script>

<template>
  <section class="max-w-md mx-auto py-8">
    <div class="text-center mb-8">
      <span class="text-4xl block mb-3">🔑</span>
      <h1 class="font-heading text-3xl font-bold text-white">Iniciar Sesión</h1>
      <p class="text-gray-400 mt-2">Ingresá a tu cuenta de GamerZone</p>
    </div>

    <!-- Mensaje de error -->
    <div v-if="errorMsg" class="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-300 text-sm">
      ⚠️ {{ errorMsg }}
    </div>

    <form @submit.prevent="handleSubmit" class="card-gaming space-y-5">
      <div>
        <label class="label-gaming" for="login-email">Email</label>
        <input
          type="email"
          id="login-email"
          class="input-gaming"
          placeholder="tu@email.com"
          v-model="form.email"
          required
        />
      </div>
      <div>
        <label class="label-gaming" for="login-password">Contraseña</label>
        <input
          type="password"
          id="login-password"
          class="input-gaming"
          placeholder="••••••••"
          v-model="form.password"
          required
        />
      </div>
      <button
        type="submit"
        class="btn-primary w-full"
        :disabled="loading"
      >
        {{ loading ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>

    <p class="text-center text-gray-400 mt-6">
      ¿No tenés cuenta?
      <RouterLink to="/register" class="text-neon-cyan hover:underline font-semibold">Creá una acá</RouterLink>
    </p>
  </section>
</template>
