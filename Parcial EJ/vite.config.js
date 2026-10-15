import vue from '@vitejs/plugin-vue';
import tailwind from '@tailwindcss/vite';

export default {
  plugins: [vue(), tailwind()],
  server: {
    port: 3000,
    host: true,
  },
}
