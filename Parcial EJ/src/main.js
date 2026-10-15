import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import './style.css';

const app = createApp(App);

// Agregamos Pinia (store) y Vue Router.
app.use(createPinia());
app.use(router);

app.mount('#app');
