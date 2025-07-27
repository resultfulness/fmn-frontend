import api from "$lib/api";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    api.fetch_fn = fetch;
    let recipes;
    try {
        recipes = await api.recipes.getAll();
    } catch (e) { }

    return { recipes: recipes! };
}
