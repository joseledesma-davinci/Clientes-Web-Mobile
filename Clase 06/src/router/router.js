/*
[router/router.js]
Acá vamos a definir nuestro router.
Vue Router es un router basado en configuración, por lo que vamos a necesitar definir las rutas desde
código. Esto contrasta con otros sistemas de routeo, como los routeos basados en archivos.
*/
import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import PublicChat from "../pages/PublicChat.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

// Definimos la lista de rutas.
// Esto es un array de objetos, donde cada objeto representa una ruta y sus características.
// Por lo menos, una ruta va a tener una URL (que se toma a partir de la raíz del sitio) y un
// componente a renderizar cuando se acceda a esa URL.
const routes = [
    { path: '/',                component: Home, },
    { path: '/chat',            component: PublicChat, },
    { path: '/ingresar',        component: Login, },
    { path: '/crear-cuenta',    component: Register, },
];

// El siguiente paso va a ser crear el router con createRouter().
// Esta función recibe un parámetro que es un objeto de configuración.
// Ese objeto va a recibir al menos 2 datos:
// routes => La lista de rutas.
// history => Indica cómo Vue Router debe manejar el historial de la aplicación.
//  Este valor siempre va a ser uno de createWebHistory() o createWebHashHistory().
const router = createRouter({
    routes,
    history: createWebHistory(),
});

export default router;