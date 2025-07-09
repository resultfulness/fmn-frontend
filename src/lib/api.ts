import app from "./app.svelte";
import type { Cart, Carts, Items, UserPatch } from "./types";

const API_URL = "https://localhost:5000";

export class ApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
        this.status = status;
    }
}

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
        throw new ApiError((await r.json()).error || "unknown error", r.status);
    } else {
        return await r.json();
    }
}

const api = {
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
    },
    items: {
        async getAll(): Promise<Items> {
            return await apiFetch("/items/search");
        }
    },
    recipes: {},
}

export default api;
