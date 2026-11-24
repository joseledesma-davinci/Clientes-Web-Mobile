<script>
import BaseH1 from '../components/BaseH1.vue';
import { updateAuthUserPhoto } from '../services/auth.js';

export default {
    name: 'EditProfileAvatar',
    components: { BaseH1, },
    data() {
        return {
            photo: {
                file: null,
                preview: null,
            },
            loading: false,
        }
    },
    methods: {
        /*
            Con este método vamos a manejar el cambio de foto elegida en el <input>.
        */
        handlePhotoChange(ev) {
            if(this.photo.preview) URL.revokeObjectURL(this.photo.preview);

            /*
                Desde JS en el cliente no tenemos acceso al file system del sistema operativo.
                Sí tenemos acceso a los archivos que el usuario manualmente seleccione en un campo 
                <input type="file">.
                Estos campos tienen una propiedad "files" de tipo FileList.
                FileList es básicamente un array de objetos File.
                Cada objeto File, por su parte, contiene la data correspondiente a un archivo.

                Como nuestro <input type="file"> no tiene el atributo "multiple" el usuario solo puede
                elegir un único archivo. Lo cual nos permite hardcodear la posición 0.
            */
            // const files = ev.target.files;
            // console.log("Files: ", files);
            this.photo.file = ev.target.files[0];
            
            /*
                # Leyendo archivos con JS
                Una vez que el usuario nos dio acceso a un archivo tenemos la posibilidad de leer su contenido.
                Hay más de una manera de hacerlo, según qué es lo que busquemos realizar.
                Para nuestro caso, donde que lo que queremos es mostrar la imagen en un <img> para hacer una
                previsualización, lo más simple probablemente es usar un ObjectURL.

                Un "ObjectURL" es un string que apunta a un objeto (archivo) en memoria del browser.
                Es decir, cuando creamos un ObjectURL el browser levanta ese archivo en la memoria y le
                crea una URL asociada al dominio con un UUID de nombre.
                Eso nos permite, a través del protocolo "blob:" que utiliza, usar este contenido en cualquier
                elemento de HTML que espera una fuente. Por ejemplo, un <img>.

                Nota: BLOB => Binary Large Object

                Importante: Siempre que creemos ObjectURLs es muy importante asegurarse de limpiar esos 
                recursos revocando el archivo.
                Si no lo hacemos, y nuestra es página es especialmente una SPA, corremos un riesgo de sufrir
                "memory leaks" (filtraciones de memoria) en nuestra aplicación.
                Esto es importante tenerlo presente, porque en lenguajes de "alto nivel" como JS o php
                nos tienen un poco mal acostumbrados a no ser cuidadosos con la limpieza de la memoria.
                En parte, gracias a que muchos de estos lenguajes, o programas que los corren (como los
                browsers) tienen mecanismos para automarizar lo más posible este aspecto, como los famosos
                "garbage collectors" (GC).
            */
            this.photo.preview = URL.createObjectURL(this.photo.file);
        },

        async handleSubmit() {
            try {
                this.loading = true;

                await updateAuthUserPhoto(this.photo.file);
            } catch (error) {
                // ...
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
    unmounted() {
        if(this.photo.preview) URL.revokeObjectURL(this.photo.preview);
    }
}
</script>

<template>
    <BaseH1>Cambiar mi foto de perfil</BaseH1>

    <div class="flex gap-4">
        <form 
            class="w-1/2"
            action="#"
            @submit.prevent="handleSubmit"
        >
            <h2 class="sr-only">Cambiar foto</h2>
            <div class="mb-3">
                <label class="block mb-2" for="file">Nueva foto</label>
                <input
                    type="file"
                    id="file"
                    class="w-full p-2 border border-gray-600 rounded"
                    @change="handlePhotoChange"
                >
            </div>
            <button type="submit" class="transition px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-600">Guardar cambios</button>
        </form>
        <section class="w-1/2">
            <h2>Previsualización</h2>
            <img 
                v-if="photo.preview"
                :src="photo.preview" 
                alt=""
            >
            <p v-else>No hay una foto elegida</p>
        </section>
    </div>
</template>