import { goto } from "$app/navigation";
import api from "$lib/api";
import app from "$lib/app.svelte";
import auth from "$lib/auth.svelte";
import type { LayoutLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ url, fetch }) => {
    if (!auth.token) {
        goto("/login");
        return;
    }

    api.fetch_fn = fetch;

    if (!app.user || !app.user.cart_id) {
        try {
            const user = await api.users.me();
            app.user = user;
        } catch (e) { }
    }

    if (url.pathname === "/") {
        throw redirect(302, `/carts/${app.user?.cart_id ?? ""}`);
    }
}
