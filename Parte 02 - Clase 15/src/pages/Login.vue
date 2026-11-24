<!-- <script>
import BaseH1 from '../components/BaseH1.vue';
import { login } from '../services/auth.js';

export default {
    name: 'Login',
    components: { BaseH1, },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.loading = true;

                await login({
                    email: this.user.email,
                    password: this.user.password,
                });

                /*
                    # Redireccionamiento desde código
                    Para redireccionar necesitamos usar el método "push" del objeto Router.
                    ¿De dónde sacamos el Router?
                    En un proyecto que esté usando Vue Router, automáticamente vamos a tener a
                    disposición en todos los componentes una propiedad especial llamada "$router"
                    con el Router.
                */
                this.$router.push('/chat');
            } catch (error) {
                // TODO...
            }
            this.loading = false;
        }
    }
}
</script> -->
<script setup>
import { ref } from 'vue';
import BaseH1 from '../components/BaseH1.vue';
import { login } from '../services/auth.js';
import { useRouter } from 'vue-router';

/*
    # Definición del state del componente
    Para definir las variables del state del componente (lo que poníamos en el "data") tenemos que decalrar
    las variables y asignarles los valores con llamadas a las funciones del core de Vue para este fin.
    Hay varias funciones que podemos usar con algunas diferencias entre sí.
    Como regla general, se suele recomendar usar en casi todos los casos la función "ref".

    ref crea una "referencia reactiva". Es decir, un valor que está asociado al sistema de reactividad de
    Vue.
    Para lograrlo, el valor que le pasamos al ref se envuelve en la propiedad "value" de otro objeto.
    Por ejemplo, si hacemos:
        const user = ref({
            email: '',
            password: '',
        });

    Vamos a tener algo similar a:
        const user = {
            value: {
                email: '',
                password: '',
            }
        }

    Esto es relevante tenerlo presente porque para poder usar el valor dentro del <script> tenemos que pasar
    siempre por la propiedad value.
    Por ejemplo:
        user.value.email = 'un@email.com';
        console.log(user.value.email); // 'un@email.com'
*/
const router = useRouter();

const { user, loading, handleSubmit } = useLoginForm(router);

function useLoginForm(router) {
    const user = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);

    /*
        # Métodos en la Composition API
        Los métodos se definen como simple funciones.
    */
    async function handleSubmit() {
        try {
            loading.value = true;

            await login({
                email: user.value.email,
                password: user.value.password,
            });

            /*
                # Redireccionamiento desde código
                Para redireccionar, como sabemos, necesitamos el objeto del Router.
                En la Options API, este objeto lo podíamos usar directamente desde la propiedad especial
                "this.$router".
                Eso no lo tenemos disponible en la Composition API. Específicamente, no tenemos acceso a "this".
                Si necesitamos usar el Router lo podemos pedir a través de la función "composable" de Vue Router:
                "useRouter()".
            */
            router.push('/chat');
        } catch (error) {
            // TODO...
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        handleSubmit,
    }
}
</script>

<template>
    <BaseH1>Ingresar a mi cuenta</BaseH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-3">
            <label class="block mb-2" for="email">Email</label>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-600 rounded"
                v-model="user.email"
            >
        </div>
        <div class="mb-3">
            <label class="block mb-2" for="password">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-600 rounded"
                v-model="user.password"
            >
        </div>
        <button type="submit" class="transition px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-600">Ingresar</button>
    </form>
</template>