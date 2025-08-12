import app from "./app.svelte";
import type { Cart, CartNew, CartPatch, Carts, Item, ItemNew, Items, Recipe, RecipeNew, RecipePatch, Recipes, User, UserPatch } from "./types";
import { PUBLIC_API_URL } from "$env/static/public";
import auth from "./auth.svelte";

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
): Promise<any> {
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
        if (r.status === 401) {
            auth.logoutUnauthorized();
            return;
        }
        throw new ApiError((await r.json()).error || "unknown error", r.status);
    } else {
        return await r.json();
    }
}

const api = {
    fetch_fn: window.fetch,
    users: {
        async me(): Promise<User> {
            return await apiFetch("/users/me");
        },
        async login(email: string, password: string): Promise<User> {
            return await apiFetch(
                "/users/login",
                "POST",
                { email, password }
            );
        },
        async register(email: string, password: string): Promise<User> {
            return await apiFetch(
                "/users/register",
                "POST",
                { email, password }
            );
        },
        async patch(newUser: UserPatch) {
            return await apiFetch(
                `/users/${app.state.user?.user_id}`,
                "PATCH",
                newUser
            );
        },
        async getDefaultCart(): Promise<Cart> {
            return await apiFetch("/users/cart");
        },
        async putDefaultCart(id: number) {
            return await apiFetch(`/users/cart/${id}`, "PUT");
        }
    },
    carts: {
        async new(newCart: CartNew) {
            return await apiFetch(
                "/carts/new",
                "POST",
                newCart,
            );
        },
        async getAll(): Promise<Carts> {
            return await apiFetch("/carts/search");
        },
        async get(id: number): Promise<Cart> {
            return await apiFetch(`/carts/${id}`);
        },
        async putItem(id: number, item_id: number): Promise<Cart> {
            return await apiFetch(`/carts/${id}/${item_id}`, "PUT");
        },
        async deleteItem(id: number, item_id: number): Promise<Cart> {
            return await apiFetch(`/carts/${id}/${item_id}`, "DELETE");
        },
        async patch(newCart: CartPatch): Promise<Cart> {
            return await apiFetch(
                `/carts/${newCart.cart_id}`,
                "PATCH",
                { name: newCart.name, icon: newCart.icon }
            );
        },
        async delete(id: number): Promise<Cart> {
            return await apiFetch(`/carts/${id}`, "DELETE");
        }
    },
    items: {
        async getAll(): Promise<Items> {
            return await apiFetch("/items/search");
        },
        async patch(newItem: Item): Promise<Item> {
            return await apiFetch(
                `/items/${newItem.item_id}`,
                "PATCH",
                newItem,
            );
        },
        async new(newItem: ItemNew): Promise<Item> {
            return await apiFetch(
                "/items/new",
                "POST",
                { name: newItem.name, icon: newItem.icon },
            );
        },
        async delete(id: number): Promise<Item> {
            return await apiFetch(`/items/${id}`, "DELETE");
        }
    },
    recipes: {
        async new(newRecipe: RecipeNew): Promise<Recipe> {
            return await apiFetch(
                "/recipes/new",
                "POST",
                newRecipe,
            );
        },
        async getAll(): Promise<Recipes> {
            return await apiFetch("/recipes/search");
        },
        async get(id: number): Promise<Recipe> {
            return await apiFetch(`/recipes/${id}`);
        },
        async delete(id: number): Promise<Recipe> {
            return await apiFetch(`/recipes/${id}`, "DELETE");
        },
        async patch(newRecipe: RecipePatch): Promise<Recipe> {
            return await apiFetch(
                `/recipes/${newRecipe.recipe_id}`,
                "PATCH",
                { name: newRecipe.name, icon: newRecipe.icon }
            );
        },
        async putItem(id: number, item_id: number): Promise<Recipe> {
            return await apiFetch(`/recipes/${id}/${item_id}`, "PUT");
        },
        async deleteItem(id: number, item_id: number): Promise<Recipe> {
            return await apiFetch(`/recipes/${id}/${item_id}`, "DELETE");
        },
    },
}

export default api;
