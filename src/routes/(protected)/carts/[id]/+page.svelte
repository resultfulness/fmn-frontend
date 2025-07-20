<script lang="ts">
import { getContext } from "svelte";
import type { PageProps } from "./$types";
import api from "$lib/api";
import Button from "$lib/components/button.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import { afterNavigate } from "$app/navigation";

let { data }: PageProps = $props();
let cart = $derived(data.cart!);
let cartitems = $derived(cart.items);
let items = $derived(data.items!);
let searchQuery = $state("");

let restitems = $derived(
    items.items
        .filter((i) => !cartitems.some((ci) => ci.item_id === i.item_id))
        .filter((i) => i.name.includes(searchQuery)),
);

async function add(id: number) {
    cart = await api.carts.putItem(data.cart!.cart_id, id);
}

async function remove(id: number) {
    cart = await api.carts.deleteItem(data.cart!.cart_id, id);
}

const header: any = getContext("header");
afterNavigate(() => {
    header.title = cart.name;
    header.left = back;
    header.right = opts;
});
</script>

{#snippet back()}
    <Button style="icon" type="link" href="/carts">
        <Icon name="arrow_back" size={32} />
    </Button>
{/snippet}

{#snippet opts()}
    <Button style="icon" onclick={() => {}}>
        <Icon name="edit" size={28} />
    </Button>
{/snippet}

<h2>cart</h2>
{#if cartitems.length > 0}
    <ul class="items-list">
        {#each cartitems as item}
            <li class="item item--cart">
                <button
                    onclick={() => remove(item.item_id)}
                    class="item__button item--cart__button"
                >
                    <img
                        src={item.icon}
                        alt={item.name + " icon"}
                        class="item__icon"
                    />
                    {item.name}
                </button>
            </li>
        {/each}
    </ul>
{:else}
    <p class="empty-label">cart empty :)</p>
{/if}

<h2>items</h2>
<div class="items-search">
    <Input
        id="cart-search-items"
        placeholder="search for items..."
        bind:value={searchQuery}
    />
</div>
<ul class="items-list">
    {#each restitems as item}
        <li class="item item--rest">
            <button
                onclick={() => add(item.item_id)}
                class="item__button item--rest__button"
            >
                <img
                    src={item.icon}
                    alt={item.name + " icon"}
                    class="item__icon"
                />
                {item.name}
            </button>
        </li>
    {/each}
</ul>

<style>
.items-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
}
.item__icon {
    filter: invert();
}

@media screen and (max-width: 500px) {
    .items-list {
        grid-template-columns: repeat(3, 1fr);
    }
    .item__icon {
        width: 64px;
    }
}

.item__button {
    width: 100%;
    aspect-ratio: 1 / 1;
    border: 0;
    cursor: pointer;
    display: grid;
    place-items: center;
    font-weight: 600;
    background-color: transparent;
    border: 2px solid var(--color-outline);
    border-radius: 1rem;
}

.item--cart__button {
    background-color: var(--color-surface2);
}

.item--rest__button {
    background-color: var(--color-surface1);
}

.items-search {
    margin-bottom: 1rem;
}
</style>
