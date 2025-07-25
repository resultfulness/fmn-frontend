<script lang="ts">
import type { Snippet } from "svelte";

interface ButtonProps {
    onclick?: () => void;
    children: Snippet;
    type?: "button" | "submit" | "reset" | "link";
    style?: "primary" | "secondary" | "alert" | "icon";
    href?: string;
    fillwidth?: boolean;
    disabled?: boolean;
    tooltip?: string
}

let {
    onclick = () => {},
    children,
    type = "submit",
    style = "primary",
    href,
    fillwidth = false,
    disabled = false,
    tooltip,
}: ButtonProps = $props();
</script>

{#if type === "link"}
    <a
        {href}
        class="button"
        class:button--primary={style === "primary"}
        class:button--secondary={style === "secondary"}
        class:button--alert={style === "alert"}
        class:button--icon={style === "icon"}
        class:button--fillwidth={fillwidth}
        style:pointer-events={disabled ? "none" : "all"}
        class:button--disabled={disabled}
    >
        {@render children()}
        {#if tooltip}
            <span class="button__tooltip">{tooltip}</span>
        {/if}
    </a>
{:else}
    <button
        {onclick}
        {type}
        {disabled}
        class="button"
        class:button--primary={style === "primary"}
        class:button--secondary={style === "secondary"}
        class:button--alert={style === "alert"}
        class:button--icon={style === "icon"}
        class:button--fillwidth={fillwidth}
    >
        {@render children()}
        {#if tooltip}
            <span class="button__tooltip">{tooltip}</span>
        {/if}
    </button>
{/if}

<style>
.button {
    position: relative;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 0;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    color: inherit;
    transition: background-color 200ms;
}

.button__tooltip {
    visibility: hidden;
    opacity: 0;
    background-color: #000;
    color: #fff;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: fit-content;
    padding: 0.25em 1em;
    border-radius: 0.25em;
    margin: 0em auto 0.75em;
    position: absolute;
    white-space: nowrap;
    background-color: var(--color-text);
    color: var(--color-background);
    z-index: 8;
    font-size: 0.875rem;
}

@media (prefers-reduced-motion: no-preference) {
    .button__tooltip {
        transition: opacity 300ms;
    }
}

.button__tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -0.5em;
    border-width: 0.5em;
    border-style: solid;
    border-color: var(--color-text) transparent transparent transparent;
    z-index: 8;
}

.button:hover .button__tooltip {
    visibility: visible;
    opacity: 1;
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

.button--alert {
    background-color: var(--color-error);
    color: var(--color-error-text);
}
</style>
