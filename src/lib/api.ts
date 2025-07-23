import app from "./app.svelte";
import type { Cart, Carts, Item, ItemNew, Items, UserPatch } from "./types";
import { PUBLIC_API_URL } from "$env/static/public";

export class ApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
        this.status = status;
    }
}

async function apiFetch(
    endpoint: string,
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    body?: object,
) {
    if (!api.fetch_fn) api.fetch_fn = window.fetch;
    const r = await api.fetch_fn(`${PUBLIC_API_URL}${endpoint}`, {
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
        throw new ApiError((await r.json()).error || "unknown error", r.status);
    } else {
        return await r.json();
    }
}

const api = {
    fetch_fn: window.fetch,
    users: {
        async me() {
            return await apiFetch("/users/me");
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
    carts: {
        async getAll(): Promise<Carts> {
            return await apiFetch("/carts/search");
        },
        async get(id: number): Promise<Cart> {
            return await apiFetch(`/carts/${id}`)
        },
        async putItem(id: number, item_id: number): Promise<Cart> {
            return await apiFetch(`/carts/${id}/${item_id}`, "PUT");
        },
        async deleteItem(id: number, item_id: number): Promise<Cart> {
            return await apiFetch(`/carts/${id}/${item_id}`, "DELETE")
        }
    },
    items: {
        async getAll(): Promise<Items> {
            return await apiFetch("/items/search");
        },
        async patch(newItem: Item) {
            return await apiFetch(
                `/items/${newItem.item_id}`,
                "PATCH",
                { name: newItem.name, icon: newItem.icon },
            );
        },
        async new(newItem: ItemNew) {
            return await apiFetch(
                "/items/new",
                "POST",
                { name: newItem.name, icon: newItem.icon },
            )
        },
        async delete(itemId: number): Promise<Item> {
            return await apiFetch(`/items/${itemId}`, "DELETE");
        }
    },
    recipes: {},
}

export default api;
