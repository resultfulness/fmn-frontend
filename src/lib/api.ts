import app from "./app.svelte";
import type { Cart, CartSearch, Carts, User, UserPatch } from "./types";

const API_URL = "https://localhost:5000";

async function apiFetch(
    endpoint: string,
    method?: "GET" | "POST" | "PATCH" | "DELETE",
    body?: object,
) {
    const r = await fetch(`${API_URL}${endpoint}`, {
        method: method || "GET",
        body: JSON.stringify(body) || undefined,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    if (!r) {
        console.error("an error occurred while trying to access the api");
        return null;
    }
    if (!r.ok) {
        throw new Error((await r.json()).error || "unknown error");
    } else {
        return await r.json();
    }
}

const api = {
    users: {
        async me() {
            try {
                return await apiFetch("/users/me");
            } catch (e) {
                console.error(e.message);
            }
        },
        async login(email: string, password: string) {
            return await apiFetch(
                "/users/login",
                "POST",
                { email, password }
            );
        },
        async register(email: string, password: string) {
            return await apiFetch(
                "/users/register",
                "POST",
                { email, password }
            );
        },
        async patch(newUser: UserPatch) {
            return await apiFetch(
                `/users/${app.user?.user_id}`,
                "PATCH",
                newUser
            )
        }
    },
    async getCarts(): Promise<Carts> {
        return await apiFetch("/carts/search");
    },
    async getCart(id: number): Promise<Cart> {
        return await apiFetch(`/carts/${id}`)
    },
    async getRecipes() { },
    async getItems() { },
}

export default api;
