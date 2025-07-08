<script lang="ts">
import Icon from "$lib/components/icon.svelte";
import app from "$lib/app.svelte";
import type { LayoutProps } from "./$types";
let { children }: LayoutProps = $props();
import { page } from "$app/state";

let path = $derived(page.url.pathname);
</script>

<div class="page">
    <header></header>
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
                        <Icon name="shopping_cart" />
                        carts
                    </a>
                </li>
                <li class="main-nav__item">
                    <a
                        href="/recipes"
                        class="main-nav__link"

                        class:main-nav__link--active={path === "/recipes"}
                    >
                        <Icon name="restaurant" />
                        recipes
                    </a>
                </li>
                {#if app.user?.role === "admin"}
                    <li class="main-nav__item">
                        <a
                            href="/items"
                            class="main-nav__link"
                            class:main-nav__link--active={path === "/items"}
                        >
                            <Icon name="kitchen" />
                            items
                        </a>
                    </li>
                {/if}
                <li class="main-nav__item">
                    <a
                        href="/profile"
                        class="main-nav__link"
                        class:main-nav__link--active={path === "/profile"}
                    >
                        <Icon name="person" />
                        profile
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

    display: flex;
    flex-direction: column;
}

main {
    flex: 1;
    overflow: auto;
    width: min(100% - 2rem, 720px);
    margin: 1rem auto;
}

footer {
    background-color: var(--color-surface0);
}

.main-nav__list {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    display: flex;
    max-width: 360px;
}

.main-nav__item {
    flex-basis: 100%;
}

.main-nav__link {
    display: grid;
    place-items: center;
    text-decoration: none;
    color: var(--color-muted);
    padding: 1rem;
    gap: 0.25rem;
    font-size: 14px;
}

.main-nav__link--active {
    color: var(--color-text);
}
</style>
