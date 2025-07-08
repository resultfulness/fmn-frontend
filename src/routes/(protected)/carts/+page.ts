import api from "$lib/api";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const carts = await api.getCarts();
    return { carts };
}
