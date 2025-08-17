import api from "$lib/api";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import app from "$lib/app.svelte";

export const load: PageLoad = async ({ params, fetch }) => {
    api.fetch_fn = fetch;
    if (!Number.isInteger(+params.id)) {
        error(422, `cart id '${params.id}' not a number`);
    }
    const id = +params.id;

    await app.updateCarts();
    if (!app.state.carts?.carts.find(cart => cart.cart_id === id)) {
        throw error(404, `no cart with id ${id}`);
    }

    return { id };
}
