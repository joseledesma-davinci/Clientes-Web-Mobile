<!-- <script>
import BaseH1 from '../components/BaseH1.vue';
import { subscribeToAuthStateChange } from '../services/auth.js';
import UserNoPhoto from '/user-no-photo.svg';

export default {
    name: 'MyProfile',
    components: { BaseH1, },
    data() {
        return {
            user: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
                career: null,
                photo_url: null,
            }
        }
    },
    mounted() {
        subscribeToAuthStateChange(userData => this.user = userData);
    },
}
</script> -->
<script setup>
import BaseH1 from '../components/BaseH1.vue';
import UserNoPhoto from '/user-no-photo.svg';
import { useAuth } from '../composables/useAuth.js';

const { user } = useAuth();
</script>

<template>
    <div class="flex items-end gap-4">
        <BaseH1>Mi perfil</BaseH1>
        <RouterLink to="/mi-perfil/editar" class="mb-4 text-blue-700 underline">Editar</RouterLink>
        <RouterLink to="/mi-perfil/editar/foto" class="mb-4 text-blue-700 underline">Editar foto</RouterLink>
    </div>

    <div class="flex gap-4">
        <div class="w-2/12">
            <div>
                <!-- class="aspect-square rounded-full overflow-hidden" -->
                <img
                    :src="user.photo_url ?? UserNoPhoto"
                    alt=""
                >
                <!-- <img
                    v-if="user.photo_url"
                    :src="user.photo_url"
                    alt=""
                >
                <img
                    src="/user-no-photo.svg"
                    alt=""
                > -->
            </div>
        </div>
        <div class="w-10/12">
            <div class="p-4 mb-4">{{ user.bio ?? 'Sin especificar...' }}</div>

            <dl>
                <dt class="mb-0.5 font-bold">Email</dt>
                <dd class="ps-2 mb-2">{{ user.email }}</dd>
                <dt class="mb-0.5 font-bold">Nombre de usuario</dt>
                <dd class="ps-2 mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
                <dt class="mb-0.5 font-bold">Carrera</dt>
                <dd class="ps-2 mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
            </dl>
        </div>
    </div>
</template>