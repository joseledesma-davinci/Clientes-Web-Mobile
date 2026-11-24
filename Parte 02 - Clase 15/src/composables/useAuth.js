import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToAuthStateChange } from "../services/auth";

export function useAuth() {
    let unsubscribeFromAuth = () => {};

    const user = ref({
        id: null,
        email: null,
        bio: null,
        display_name: null,
        career: null,
        photo_url: null,
    });

    /*
        Para las funciones del ciclo de vida como mounted o unmounted tenemos que usar las funciones equivalentes
        onMounted y onUnmounted.
    */
    onMounted(() => {
        unsubscribeFromAuth = subscribeToAuthStateChange(userData => user.value = userData);
    });

    onUnmounted(() => {
        unsubscribeFromAuth();
    });

    return {
        user,
    };
}