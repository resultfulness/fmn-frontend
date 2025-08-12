import { goto } from "$app/navigation";
import { showToast } from "$lib/toast.svelte";

const auth = {
    get token(): string | null {
        const cookies = document.cookie.split(";")
        for (const cookie of cookies) {
            const c = cookie.trim();
            if (c.startsWith("token=")) {
                return c.split("=")[1];
            }
        }
        return null;
    },
    logout() {
        if (this.token) {
            document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        goto("/login");
    },
    logoutUnauthorized() {
        if (this.token) {
            showToast("session expired. please login again", "info", 10000);
        }
        this.logout();
    }
}

export default auth;
