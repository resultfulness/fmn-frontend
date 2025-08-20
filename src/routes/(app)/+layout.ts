import app from "$lib/app.svelte";
import type { LayoutLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ url }) => {
    if (app.state.defaultCart === undefined) {
        app.updateDefaultCart();
    }

    if (url.pathname === "/") {
        throw redirect(302, `/carts/${app.state.defaultCart ?? ""}`);
    }
}
