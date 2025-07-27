import api from "$lib/api";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    api.fetch_fn = fetch;
    let carts;

    try {
        carts = await api.carts.getAll();
    } catch (e) { }

    return { carts: carts! };
}
