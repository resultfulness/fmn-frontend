import type { User } from "./types";

const app: {
    user: User | null,
    defaultCartId?: number | null,
} = $state({
    user: null,
});

export default app;
