import api, { ApiError } from "$lib/api";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Cart } from "$lib/types";

export const load: PageLoad = async ({ params, fetch, parent }) => {
    api.fetch_fn = fetch;
    if (!Number.isInteger(+params.id)) {
        error(422, `cart id '${params.id}' not a number`);
    }
    const id = +params.id;

    let cart;
    let { defaultCart } = await parent();

    if (defaultCart && defaultCart.cart_id === id) {
        cart = defaultCart
    } else {
        try {
            cart = await api.carts.get(id);
        } catch (e) {
            const ae = e as ApiError;
            switch (ae.status) {
                case 404:
                    error(404, `no cart with id ${id}`);
            }
        }
    }

    const items = await api.items.getAll();
    return { cart: cart as Cart, items };
}

