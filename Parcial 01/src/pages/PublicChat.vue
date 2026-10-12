<script>
import BaseH1 from '../components/BaseH1.vue';
import { getLastPublicChatMessages, sendPublicChatMessages, subscribeToNewPublicChatMessages } from '../services/public-chat.js';

const exampleMessages = [
    {
        id: 1,
        email: 'sara@za.com',
        body: '¡Hola mundo!',
        created_at: new Date(),
    },
    {
        id: 2,
        email: 'pepe@trueno.com',
        body: 'hola sara q tal????',
        created_at: new Date(),
    },
    {
        id: 3,
        email: 'sara@za.com',
        body: 'Hola Pepe, ¿qué tal?',
        created_at: new Date(),
    },
];

export default {
    name: 'PublicChat',
    components: { BaseH1, },
    /*
        data es la propiedad de los componentes de Vue que nos permite definir el "state" del componente.
        En Vue el "state" hace referencia específicamente a los valores propios del componente (no propiedades
        que reciba) que pueden variar con el tiempo.
        Todos los valores del "state" son automáticamente "reactivos". Esto significa que interactúan con el
        sistema de reactividad de Vue.
        Cuando algún valor del "state" cambie, Vue reacciona y actualiza todo lo que depende de ese valor,
        como el <template> o propiedades computadas.

        data debe ser una función que retorne un objeto con el valor inicial del state.
    */
    data() {
        return {
            // Guardamos una copia de los mensajes de ejemplo.
            // messages: [...exampleMessages],
            messages: [],

            newMessage: {
                email: '',
                body: '',
            },
        }
    },
    /*
        methods nos permite definir funciones para el componente.
        Estas funciones van a estar disponibles tanto en el <template> como en la instancia del componente.
    */
    methods: {
        async handleMessageSend() {
            try {
                sendPublicChatMessages({
                    email: this.newMessage.email,
                    body: this.newMessage.body,
                });
                
                this.newMessage.body = "";
            } catch (error) {
                // TODO...
            }
        },
    },
    /*
        mounted() es la función del ciclo de vida de Vue que se ejecuta cuando el componente
        es montado en el DOM.
        Es el lugar ideal para la carga inicial de valores.
    */
    async mounted() {
        try {
            this.messages = await getLastPublicChatMessages();

            subscribeToNewPublicChatMessages(
                newMessageData => this.messages.push(newMessageData)
            );
        } catch (error) {
            // ...
        }

        // TODO: Auth.
    }
}
</script>

<template>
    <BaseH1>Chat público global</BaseH1>
    
    <div class="md:flex md:gap-4">
        <section class="md:w-3/4 min-h-100 p-4 mb-8 md:mb-0 border rounded">
            <h2 class="sr-only">Lista de mensajes</h2>

             <ol class="flex flex-col gap-2 items-start">
                <!-- 
                    # v-for 
                    v-for es una directiva de Vue.
                    Las directivas son atributos que podemos agregar en etiquetas del <template>
                    y que agregan funcionalidades o comportamientos al elemento.
                    Por ejemplo, v-for permite repetir el elemento en el que está por cada uno de
                    los elementos de una secuencia (generalmente, un array).
                -->
                <li
                    v-for="message in messages"
                    :key="message.id"
                    class="p-4 rounded bg-gray-100"
                >
                    <div class="mb-1"><span class="font-bold">{{ message.email }}</span> dijo:</div>
                    <div class="mb-1">{{ message.body }}</div>
                    <div class="text-sm text-gray-900">{{ message.created_at }}</div>
                </li>
             </ol>
        </section>
        <section class="md:w-1/4">
            <h2 class="mb-4 text-xl">Enviar un mensaje</h2>

            <!-- 
                # Eventos con Vue
                Para agregar eventos en los elementos del <template> podemos usar la directiva v-on,
                que debe incluir el evento que se quiere escuchar.
                Por ejemplo:
                    v-on:click
                    v-on:input
                    v-on:submit

                Como valor debemos asignar el código que queremos se ejecute. Generalmente, le vamos
                a pasar una función.

                Alternativamente, Vue soporta para mayor comodidad una sintaxis alternativa que es:
                    @evento
                
                Por ejemplo:
                    @click
                    @input
                    @submit

                Adicionalmente, los eventos de Vue aceptan "modificadores", como ".prevent" o ".once" o
                ".stop".
                Estos modificadores agregan algún requisito extra al evento que Vue puede manejar por
                nosotros.
                Por ejemplo, el ".prevent" agrega automáticamente el preventDefault().
            -->
            <form 
                action="#"
                @submit.prevent="handleMessageSend"
            >
                <div class="mb-3">
                    <label class="block mb-2" for="email">Email</label>
                    <!-- 
                        # v-model
                        Esta directiva permite asociar un valor del state a un control de form.
                        Esto lo hace a través de crear lo que conocemos como "two-way data binding"
                        (vinculación de datos bidireccional).
                        "Two-way data binding" es un técnica que permite dejar en manos del framework
                        la sincronización del valor del state y del control del form.
                        Esto significa que si el usuario cambia el valor del control del form, Vue actualiza
                        automáticamente el valor del state.
                        Mientras que si programáticamente modificamos el valor del state, Vue actualiza
                        el control del form.
                    -->
                    <input
                        type="email"
                        id="email"
                        class="w-full p-2 border border-gray-600 rounded"
                        v-model="newMessage.email"
                    >
                </div>
                <div class="mb-3">
                    <label class="block mb-2" for="body">Mensaje</label>
                    <textarea
                        id="body"
                        class="w-full p-2 border border-gray-600 rounded"
                        v-model="newMessage.body"
                    ></textarea>
                </div>
                <button type="submit" class="transition px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-600">Enviar</button>
            </form>
        </section>
    </div>
</template>