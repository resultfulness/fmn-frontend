<script lang="ts">
import Icon from "$lib/components/icon.svelte";
import app from "$lib/app.svelte";
import type { LayoutProps } from "./$types";
import { page } from "$app/state";
import { setContext, type Snippet } from "svelte";
import { beforeNavigate } from "$app/navigation";

let { children }: LayoutProps = $props();

let header: {
    title: string;
    left?: Snippet;
    right?: Snippet;
} = $state({
    title: "forget me not",
    left: undefined,
    right: undefined,
});

setContext("header", header);

beforeNavigate(() => {
    header.left = undefined;
    header.right = undefined;
});

let path = $derived(page.url.pathname);
</script>

<div class="page">
    <header>
        <div class="header__layout">
            <div class="header__left">
                {@render header.left?.()}
            </div>
            <div class="header__center">
                <h1 class="header__title">{header.title}</h1>
            </div>
            <div class="header__right">
                {@render header.right?.()}
            </div>
        </div>
    </header>
    <main>{@render children()}</main>
    <footer>
        <nav class="main-nav">
            <ul class="main-nav__list">
                <li class="main-nav__item">
                    <a
                        href="/carts"
                        class="main-nav__link"
                        class:main-nav__link--active={path.startsWith("/carts")}
                    >
                        <div class="main-nav__link__icon">
                            <Icon name="shopping_cart" />
                        </div>
                    </a>
                </li>
                <li class="main-nav__item">
                    <a
                        href="/recipes"
                        class="main-nav__link"
                        class:main-nav__link--active={path === "/recipes"}
                    >
                        <div class="main-nav__link__icon">
                            <Icon name="restaurant" />
                        </div>
                    </a>
                </li>
                {#if app.user?.role === "admin"}
                    <li class="main-nav__item">
                        <a
                            href="/items"
                            class="main-nav__link"
                            class:main-nav__link--active={path === "/items"}
                        >
                            <div class="main-nav__link__icon">
                                <Icon name="kitchen" />
                            </div>
                        </a>
                    </li>
                {/if}
                <li class="main-nav__item">
                    <a
                        href="/profile"
                        class="main-nav__link"
                        class:main-nav__link--active={path === "/profile"}
                    >
                        <div class="main-nav__link__icon">
                            <Icon name="person" />
                        </div>
                    </a>
                </li>
            </ul>
        </nav>
    </footer>
</div>

<style>
.page {
    height: 100vh;
    height: 100dvh;

    background-color: var(--color-surface0);
    display: flex;
    flex-direction: column;
}

header {
    background-color: var(--color-background);
}

.header__layout {
    display: grid;
    grid-template-columns: 48px 1fr 48px;
    align-items: center;
    padding: 1rem;
    width: min(100%, 720px);
    margin-inline: auto;
}

.header__center {
    text-align: center;
}

.header__right {
    display: flex;
    justify-content: right;
}

.header__title {
    margin: 0;
}

main {
    position: relative;
    flex: 1;
    overflow: auto;
    width: min(100%, 720px);
    margin-inline: auto;
    padding: 1rem;
    background-color: var(--color-surface0);
}

footer {
    background-color: var(--color-background);
}

.main-nav__list {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    display: flex;
    max-width: 300px;
}

.main-nav__item {
    flex-basis: 100%;
}

.main-nav__link {
    display: block;
    text-decoration: none;
    color: var(--color-muted);
    padding: 1rem 0.5rem 1rem;
}

.main-nav__link__icon {
    width: 100%;
    padding-block: 0.25rem;
    display: grid;
    place-items: center;
}

.main-nav__link--active {
    color: var(--color-background);
}

.main-nav__link--active .main-nav__link__icon {
    background-color: var(--color-primary);
    border-radius: 100vw;
}
</style>
