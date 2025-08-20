import api, { ApiError } from "$lib/api";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "../../../(protected)/recipes/[id]/$types";

export const load: PageLoad = async ({ params, fetch }) => {
    api.fetch_fn = fetch;
    if (!Number.isInteger(+params.id)) {
        error(422, `recipe id '${params.id}' not a number`);
    }
    const id = +params.id;

    try {
        const recipe = await api.recipes.get(id);
        const items = await api.items.getAll();
        return { recipe, items };
    } catch (e) {
        const ae = e as ApiError;
        switch (ae.status) {
            case 404:
                throw error(404, `no recipe with id ${id}`);
        }
    }
}
