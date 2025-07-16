import api, { ApiError } from "$lib/api";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    api.fetch_fn = fetch;
    if (!Number.isInteger(+params.id)) {
        error(422, `cart id '${params.id}' not a number`);
    }
    const id = +params.id;

    try {
        const cart = await api.carts.get(id);
        const items = await api.items.getAll();
        return { cart, items };
    } catch (e) {
        const ae = e as ApiError;
        switch (ae.status) {
            case 404:
                error(404, `no cart with id ${id}`);
        }
    }
}

