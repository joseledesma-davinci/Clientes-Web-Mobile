import { createRouter, createWebHistory } from 'vue-router';
import { authReady, subscribeToAuthStateChange } from '../services/auth.js';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Feed from '../pages/Feed.vue';
import NewPost from '../pages/NewPost.vue';
import UserProfile from '../pages/UserProfile.vue';
import MyProfile from '../pages/MyProfile.vue';
import PostDetail from '../pages/PostDetail.vue';

const routes = [
  { path: '/',              component: Home,         name: 'home' },
  { path: '/login',         component: Login,        name: 'login' },
  { path: '/register',      component: Register,     name: 'register' },
  { path: '/feed',          component: Feed,         name: 'feed',          meta: { requiresAuth: true } },
  { path: '/post/new',      component: NewPost,      name: 'new-post',      meta: { requiresAuth: true } },
  { path: '/post/:id',      component: PostDetail,   name: 'post-detail' },
  { path: '/profile/me',    component: MyProfile,    name: 'my-profile',    meta: { requiresAuth: true } },
  { path: '/profile/:id',   component: UserProfile,  name: 'user-profile' },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

// Guard global: proteger rutas que requieren autenticación.
let currentUser = { id: null, email: null };
subscribeToAuthStateChange(userData => currentUser = userData);

router.beforeEach(async (to) => {
  await authReady;

  if (to.meta?.requiresAuth && currentUser?.id === null) {
    return '/login';
  }
});

export default router;