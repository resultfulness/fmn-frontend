import { goto } from "$app/navigation";
import api from "$lib/api";
import app from "$lib/app.svelte";
import auth from "$lib/auth.svelte";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url, fetch }) => {
    if (!auth.token) {
        goto("/login");
    } else {
        const user = await api.getUser();
        if (!user) {
            auth.clear();
            goto("/login");
        }
        app.user = user;
    }
    if (url.pathname === "/") {
        goto("/carts");
    }
}
