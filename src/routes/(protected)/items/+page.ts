import api from "$lib/api";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    api.fetch_fn = fetch;
    const items = await api.items.getAll();
    return { items };
}
