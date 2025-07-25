import { goto } from "$app/navigation";
import api, { ApiError } from "$lib/api";
import app from "$lib/app.svelte";
import auth from "$lib/auth.svelte";
import type { LayoutLoad } from "./$types";
import { showToast } from "$lib/components/toast.svelte";
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ url, fetch }) => {
    if (!auth.token) {
        goto("/login");
        return;
    }

    api.fetch_fn = fetch;

    try {
        const user = await api.users.me();
        app.user = user;
    } catch (e) {
        const ae = e as ApiError;
        switch (ae.status) {
            case 401:
                auth.clear();
                goto("/login");
                showToast("session expired. please login again", "info", 10000);
                break;
        }
        return;
    }

    if (app.defaultCartId === undefined) {
        let defaultCart;
        try {
            defaultCart = await api.users.getDefaultCart();
            app.defaultCartId = defaultCart.cart_id;
        } catch (e) { 
            app.defaultCartId = null;
        }

        if (url.pathname === "/") {
            throw redirect(302, `/carts/${app.defaultCartId ?? ""}`);
        }

        return { defaultCart };
    }

    if (url.pathname === "/") {
        throw redirect(302, `/carts/${app.defaultCartId ?? ""}`);
    }
}
