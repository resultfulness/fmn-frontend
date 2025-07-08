import api from "$lib/api";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
    if (!Number.isInteger(+params.id)) {
        error(422, `set id '${params.id}' not a number`);
    }
    const id = +params.id;

    const cart = await api.getCart(id);
    if (!cart) {
        error(404, `no cart with id ${id}`);
    }

    return { cart };
}

