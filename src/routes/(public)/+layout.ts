import { goto } from "$app/navigation";
import api from "$lib/api";
import auth from "$lib/auth.svelte";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
    if (auth.token) {
        const user = await api.getUser();
        if (!user) {
            auth.clear();
            goto("/login");
        }
        goto("/")
    }
}
