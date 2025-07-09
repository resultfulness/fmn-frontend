import { goto } from "$app/navigation";
import api, { ApiError } from "$lib/api";
import app from "$lib/app.svelte";
import auth from "$lib/auth.svelte";
import type { LayoutLoad } from "./$types";
import { showToast } from "$lib/components/toast.svelte";

export const load: LayoutLoad = async ({ url, fetch }) => {
    if (!auth.token) {
        goto("/login");
    } else {
        try {
            const user = await api.users.me();
            app.user = user;
        } catch (e) {
            const ae = e as ApiError;
            switch (ae.status) {
                case 401:
                    auth.clear();
                    goto("/login");
                    showToast("session expired. please login again", 10000);
                    break;
            }
        }
    }
    if (url.pathname === "/") {
        goto("/carts");
    }
}
