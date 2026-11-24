<!-- <script>
import BaseH1 from '../components/BaseH1.vue';

export default {
    name: 'Home',
    components: { BaseH1, },
}
</script> -->
<!-- 
    La Composition API se usa principalmente con el <script setup>. Esto simplifica bastante el "boilerplate"
    que tenemos escribir.
    Entre las transformaciones que Vue realiza al <script setup> está el agregar el "export default" del
    componente.
    Esto signfica que no podemos escribirlo nosotros.

    Una ventaja que esto nos trae es escribir menos, y evitar tener que manualmente indicar los componentes
    que queremos usar. Va a alcanzar con solo importarlos.
-->
<script setup>
import BaseH1 from '../components/BaseH1.vue';
</script>

<template>
    <BaseH1>¡Les damos la bienvenida a DV Social!</BaseH1>
</template>