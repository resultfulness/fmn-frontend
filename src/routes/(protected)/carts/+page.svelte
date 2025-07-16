<script lang="ts">
import { showToast } from "$lib/components/toast.svelte";
import { getContext } from "svelte";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
let { carts } = data;

getContext("header").text = "carts";
</script>

{#if carts.count < 1}
    <p class="empty-label">no carts yet</p>
{:else}
    <ul class="card-list">
        {#each carts.carts as cart}
            <li class="card-list__item">
                <a class="card" href={`/carts/${cart.cart_id}`}>
                    <h2 class="card__title">{cart.name}</h2>
                    <img src={cart.icon} alt="cart icon" class="card__icon">
                </a>
            </li>
        {/each}
    </ul>
{/if}

<style>
.card-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: grid;
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
    /* filter: invert(); */
}
</style>
