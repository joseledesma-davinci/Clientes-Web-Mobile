<script>
import Navbar from './components/Navbar.vue';
import AppFooter from './components/AppFooter.vue';

export default {
  name: 'App',
  components: { Navbar, AppFooter },
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
