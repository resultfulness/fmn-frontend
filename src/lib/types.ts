export type Carts = {
    carts: CartSearch[];
    count: number;
};

export type CartSearch = {
    cart_id: number;
    icon: string;
    name: string;
};

export type Cart = {
    items: Item[]
} & CartSearch;

export type CartPatch = {
    cart_id: number;
    name?: string;
    icon?: string;
};

export type CartNew = {
    name: string;
    icon: string;
}

export type Items = {
    items: Item[];
    count: number;
};

export type Item = {
    item_id: number;
    name: string;
    icon: string;
    origin?: string;
};

export type ItemNew = {
    name: string;
    icon: string;
};

export type RecipeNew = {
    name: string;
    icon: string;
};

export type RecipePatch = {
    recipe_id: number;
    name?: string;
    icon?: string;
}

export type RecipeSearch = {
    recipe_id: number;
    name: string;
    icon: string;
}

export type Recipe = {
    items: Item[];
} & RecipeSearch;

export type Recipes = {
    recipes: Recipe[],
    count: number;
}
