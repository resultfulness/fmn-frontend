<script lang="ts">
import type { Snippet } from "svelte";

interface ButtonProps {
    onclick?: () => void;
    children: Snippet;
    type?: "button" | "submit" | "reset" | "link";
    style?: "primary" | "secondary" | "icon";
    href?: string;
    fillwidth?: boolean;
    disabled?: boolean;
}

let {
    onclick = () => {},
    children,
    type = "submit",
    style = "primary",
    href,
    fillwidth = false,
    disabled = false,
}: ButtonProps = $props();
</script>

{#if type === "link"}
    <a
        {href}
        class="button"
        class:button--primary={style === "primary"}
        class:button--secondary={style === "secondary"}
        class:button--icon={style === "icon"}
        class:button--fillwidth={fillwidth}
        style:pointer-events={disabled ? "none" : "all"}
        class:button--disabled={disabled}
    >
        {@render children()}
    </a>
{:else}
    <button
        {onclick}
        {type}
        {disabled}
        class="button"
        class:button--primary={style === "primary"}
        class:button--secondary={style === "secondary"}
        class:button--icon={style === "icon"}
        class:button--fillwidth={fillwidth}
    >
        {@render children()}
    </button>
{/if}

<style>
.button {
    padding: 1rem;
    border-radius: 0.5rem;
    border: 0;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
}

.button--fillwidth {
    width: 100%;
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
    background-color: var(--color-surface0);
    border: 2px solid var(--color-outline);
    color: var(--color-outline);
}

.button--secondary:hover {
    text-decoration: underline;
}

.button--icon {
    background-color: transparent;
    padding: 0;
}

.button:disabled, .button--disabled {
    background-color: var(--color-muted);
    color: var(--color-surface0);
}
</style>
