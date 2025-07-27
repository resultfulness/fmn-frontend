import api from "$lib/api";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    api.fetch_fn = fetch;
    let items;
    try {
        items = await api.items.getAll();
    } catch (e) { }

    return { items: items! };
}
