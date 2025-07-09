export type User = {
    email: string;
    role: string;
    user_id: string;
    username: string;
}

export type UserPatch = {
    email?: string;
    username?: string;
    password?: string;
}

export type Carts = {
    carts: CartSearch[];
    count: number;
}

export type CartSearch = {
    cart_id: number;
    icon: string;
    name: string;
}

export type Cart = {
    items: Item[]
} & CartSearch

export type Item = {
    name: string;
    icon: string;
}
