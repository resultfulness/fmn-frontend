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

    if (!app.state.user || !app.state.user.cart_id) {
        try {
            const user = await api.users.me();
            app.state.user = user;
            if (app.state.user.cart_id) {
                await app.updateDefaultCart();
            }
        } catch (e) { }
    }

    let promises = [];

    if (!app.state.carts) {
        promises.push(app.updateCarts());
    }

    if (!app.state.items) {
        promises.push(app.updateItems());
    }

    if (!app.state.recipes) {
        promises.push(app.updateRecipes());
    }

    await Promise.all(promises);

    if (url.pathname === "/") {
        throw redirect(302, `/carts/${app.state.user?.cart_id ?? ""}`);
    }
}
