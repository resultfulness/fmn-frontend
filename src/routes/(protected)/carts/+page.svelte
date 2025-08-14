<script lang="ts">
import { getContext, onMount } from "svelte";
import type { LayoutHeader } from "../+layout.svelte";
import app from "$lib/app.svelte";

const header = getContext<LayoutHeader>("header");
header.title = "carts";

async function fetchCarts() {
    app.state.isLoading++;
    await app.updateCarts();
    app.state.isLoading--;
}

onMount(fetchCarts);
</script>

{#if app.state.carts}
    {#if app.state.carts.count < 1}
        <p class="empty-label">no carts yet</p>
    {:else}
        <ul class="card-list">
            {#each app.state.carts.carts as cart}
                <li class="card-list__item">
                    <a class="card" href={`/carts/${cart.cart_id}`}>
                        <h2 class="card__title">{cart.name}</h2>
                        <img
                            src={cart.icon}
                            alt="cart icon"
                            class="card__icon"
                        />
                    </a>
                </li>
            {/each}
        </ul>
    {/if}
{/if}

<style>
.card-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: grid;
    padding: 1rem;
    overflow: scroll;
    gap: 1rem;
}

.card {
    padding: 1rem;
    background-color: var(--color-surface1);
    border-radius: 1rem;
    display: flex;
    justify-content: space-between;
    text-decoration: none;
    color: inherit;
}

.card:hover {
    background-color: var(--color-surface2);
}

.card__title {
    margin: 0;
    gap: 1rem;
}

.card__icon {
    width: 96px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 0.5rem;
}
</style>
