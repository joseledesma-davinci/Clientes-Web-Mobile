<script>
export default {
  name: 'AppFooter',
}
</script>

<template>
  <footer class="border-t border-gaming-border bg-gaming-darker/80 mt-auto">
    <div class="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-gray-500 text-sm">
        <span class="font-heading font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">GamerZone</span>
        &copy; {{ new Date().getFullYear() }} — Todos los derechos reservados
      </p>
      <div class="flex gap-4 text-sm text-gray-500">
        <RouterLink to="/" class="hover:text-neon-cyan transition-colors">Inicio</RouterLink>
        <RouterLink to="/feed" class="hover:text-neon-cyan transition-colors">Feed</RouterLink>
      </div>
    </div>
  </footer>
</template>
