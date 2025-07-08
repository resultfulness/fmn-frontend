<script lang="ts">
import type { Snippet } from "svelte";

interface ButtonProps {
    onclick?: () => void;
    children: Snippet;
    type?: "button" | "submit" | "reset" | "link";
    style?: "primary" | "secondary";
    href?: string;
}

let {
    onclick = () => {},
    children,
    type = "submit",
    style = "primary",
    href,
}: ButtonProps = $props();
</script>

{#if type === "link"}
    <a
        {href}
        class="button"
        class:button--primary={style === "primary"}
        class:button--secondary={style === "secondary"}
    >
        {@render children()}
    </a>
{:else}
<button
    {onclick}
    {type}
    class="button"
    class:button--primary={style === "primary"}
    class:button--secondary={style === "secondary"}
>
    {@render children()}
</button>
{/if}

<style>
.button {
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 0;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
}

.button--primary {
    background-color: var(--color-primary);
    color: var(--color-background);
}

.button--primary:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

.button--primary:hover {
    background-color: var(--color-primary-light);
}

.button--secondary {
    background-color: var(--color-background);
    border: 2px solid var(--color-muted);
    color: var(--color-muted);
}

.button--secondary:hover {
    text-decoration: underline;
}

</style>
