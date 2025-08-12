import api from "./api";
import type { Cart, Carts, Items, Recipes, User } from "./types";

interface AppState {
    isLoading: number,
    user: User | null,
    items: Items,
    carts: Carts,
    recipes: Recipes,
    defaultCart?: Cart,
}

const state = $state({
    isLoading: 0,
    user: null,
});

const app = {
    state: state as AppState,
    async updateCarts() {
        this.state.carts = await api.carts.getAll();
    },
    async updateDefaultCart() {
        if (!app.state.user?.cart_id) {
            this.state.defaultCart = undefined;
        } else {
            this.state.defaultCart = await api.carts.get(
                app.state.user.cart_id
            );
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
