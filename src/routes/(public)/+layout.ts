import api from "$lib/api";
import auth from "$lib/auth.svelte";
import type { LayoutLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ fetch }) => {
    api.fetch_fn = fetch;
    if (auth.token) {
        try {
            await api.users.me();
        } catch (e) { }
        throw redirect(302, "/")
    }
}
