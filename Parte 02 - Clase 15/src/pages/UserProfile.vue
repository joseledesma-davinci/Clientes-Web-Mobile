<!-- <script>
/*
    Para todos los recursos que tengamos en la carpeta [public] Vite nos permite vincularlos directamente
    desde una URL relativa a la raíz del sitio.
    Por ejemplo, si tenemos:
        [public/saraza.jpg]
    
    La ruta será:
        /saraza.jpg
*/
import BaseH1 from '../components/BaseH1.vue';
import { getUserProfileById } from '../services/user-profiles.js';
import UserNoPhoto from '/user-no-photo.svg';

export default {
    name: 'UserProfile',
    components: { BaseH1, },
    data() {
        return {
            UserNoPhoto,
            user: {
                id: null,
                email: null,
                bio: null,
                display_name: null,
                career: null,
                photo_url: null,
            },
            loading: false,
        };
    },
    async mounted() {
        try {
            this.loading = true;
            /*
                # Uso de parámetros de ruta con Vue Router
                Si la ruta que renderiza a este componente tiene parámetros de ruta (los ":nombre") podemos
                obtener sus valores desde el objeto de la ruta.
                Vue Router define una propiedad especial es todos los componentes llamada $route que nos
                dá acceso a este objeto.
                De ahí, simplemente llamamos a su propiedad "params" seguida de la propiedad con el nombre
                del parámetro de ruta sin el ":".
            */
            this.user = await getUserProfileById(this.$route.params.id);
        } catch (error) {
            // ...
        } finally {
            /*
                # finally
                El finally es la tercera parte opcional del bloque try...catch.
                Este bloque permite indicar instrucciones que se tienen que ejecutar siempre luego
                del try y/o del catch. Incluso si ocurre algún error inesperado.

                Es el lugar ideal para limpiar valores, cerrar conexiones, etc.
            */
            this.loading = false;
        }
    }
}
</script> -->
<script setup>
import { onMounted, ref } from 'vue';
import BaseH1 from '../components/BaseH1.vue';
import { getUserProfileById } from '../services/user-profiles.js';
import UserNoPhoto from '/user-no-photo.svg';
import { useRoute } from 'vue-router';

/*
    # Uso de parámetros de ruta con Vue Router
    Como sucede con el Router, en la Composition API no tenemos acceso a this, y por extensión,
    tampoco a "this.$route".
    Si queremos usar la ruta podemos llamar al composable "useRoute".
*/
const route = useRoute();

const { user, loading } = useUserProfile(route.params.id);

function useUserProfile(id) {
    const user = ref({
        id: null,
        email: null,
        bio: null,
        display_name: null,
        career: null,
        photo_url: null,
    });
    const loading = ref(false);

    onMounted(async () => {
        try {
            loading.value = true;
            user.value = await getUserProfileById(id);
        } catch (error) {
            // ...
        } finally {
            loading.value = false;
        }
    });

    return {
        user,
        loading,
    }
}
</script>

<template>
    <BaseH1>Perfil de {{ user.email }}</BaseH1>

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

            <dl class="mb-4">
                <dt class="mb-0.5 font-bold">Email</dt>
                <dd class="ps-2 mb-2">{{ user.email }}</dd>
                <dt class="mb-0.5 font-bold">Nombre de usuario</dt>
                <dd class="ps-2 mb-2">{{ user.display_name ?? 'Sin especificar...' }}</dd>
                <dt class="mb-0.5 font-bold">Carrera</dt>
                <dd class="ps-2 mb-2">{{ user.career ?? 'Sin especificar...' }}</dd>
            </dl>
        </div>
    </div>

    <hr class="mb-4">

    <!-- :to="'/usuario/' + user.id + 'chat'" -->
    <RouterLink 
        :to="`/usuario/${user.id}/chat`"
        class="text-blue-700 underline" 
    >Ir a la conversación privada con {{ user.email }}</RouterLink>
</template>