import api, { ApiError } from "./api";
import type { Cart, Carts, Items, Recipes } from "./types";

interface AppState {
    isLoading: number,
    items: Items,
    carts: Carts,
    recipes: Recipes,
    defaultCart?: Cart | null,
}

const state = $state({
    isLoading: 0,
});

const app = {
    state: state as AppState,
    async updateCarts() {
        this.state.carts = await api.carts.getAll();
    },
    async updateDefaultCart() {
        try {
            this.state.defaultCart = await api.carts.getDefault();
        } catch (e) {
            const ae = e as ApiError;
            if (ae.status === 404) {
                app.state.defaultCart = null;
            }
        }
    },
    async updateItems() {
        this.state.items = await api.items.getAll();
    },
    async updateRecipes() {
        this.state.recipes = await api.recipes.getAll();
    }
};

export default app;
