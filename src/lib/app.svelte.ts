import type { User } from "./types";

const app: {
    user: User | null
} = $state({
    user: null
});

export default app;
