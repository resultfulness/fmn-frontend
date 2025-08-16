<script lang="ts">
import { getContext, onMount } from "svelte";
import api from "$lib/api";
import Button from "$lib/components/button.svelte";
import Drawer from "$lib/components/drawer.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import { afterNavigate, goto } from "$app/navigation";
import Separator from "$lib/components/separator.svelte";
import { showConfirm } from "$lib/components/confirm.svelte";
import { showToast } from "$lib/toast.svelte";
import app from "$lib/app.svelte";
import unfocusOnMobileKeyboardHidden from "$lib/mobile-unfocus";
import type { LayoutHeader } from "../../+layout.svelte";
import type { Cart } from "$lib/types";

const header = getContext<LayoutHeader>("header");
afterNavigate(() => {
    header.left = back;
    header.right = opts;
});

$effect(() => {
    header.title = cart.name;
});

let { data } = $props();
let { id } = data;
let isDefault = $derived(
    app.state.defaultCart !== undefined &&
        app.state.defaultCart.cart_id !== undefined &&
        app.state.defaultCart.cart_id === id
);
let cart: Cart = $derived(
    app.state.defaultCart && isDefault
        ? app.state.defaultCart
        : { cart_id: id, name: "cart", icon: "", items: [] }
);

async function fetchDeps() {
    app.state.isLoading++;
    await app.updateItems();
    await app.updateRecipes();
    if (app.state.defaultCart && isDefault) {
        await app.updateDefaultCart();
        cart = app.state.defaultCart;
    } else {
        cart = await api.carts.get(id);
    }
    app.state.isLoading--;
}

onMount(async () => {
    fetchDeps();
    unfocusOnMobileKeyboardHidden("cart-items-search");
});

let searchterm = $state("");
let cartitems = $derived(cart.items);
let restitems = $derived(
    app.state.items.items
        .filter(
            item =>
                !cartitems.some(
                    cartitem =>
                        cartitem.item_id === item.item_id &&
                        cartitem.origin === ""
                )
        )
        .filter(item => item.name.includes(searchterm))
);
let recipes = $derived(
    app.state.recipes.recipes.filter(recipe => recipe.name.includes(searchterm))
);

async function add(id: number) {
    searchterm = "";
    cartitems = [
        ...cartitems,
        restitems.find(item => item.item_id === id)!,
    ].sort((a, b) => a.name.localeCompare(b.name));
    restitems = restitems.filter(item => item.item_id !== id);
    if (app.state.defaultCart && isDefault) {
        app.state.defaultCart.items = cartitems;
    }
    app.state.isLoading++;
    cart = await api.carts.putItem(cart.cart_id, id);
    app.state.isLoading--;
}

async function addRecipe(id: number) {
    app.state.isLoading++;
    cart = await api.carts.putRecipe(cart.cart_id, id);
    app.state.isLoading--;
}

async function remove(id: number, origin?: string) {
    restitems = [...restitems, cartitems.find(item => item.item_id === id)!];
    cartitems = cartitems.filter(item => item.item_id !== id);
    if (app.state.defaultCart && isDefault) {
        app.state.defaultCart.items = cartitems;
    }
    app.state.isLoading++;
    cart = await api.carts.deleteItem(cart.cart_id, id, origin);
    app.state.isLoading--;
}

let showRecipes = $state(false);
let h = $state(0);

// {{{ cart edit
let form = $state({
    name: "",
    icon: "",
    error: { name: "", icon: "" },
});
let submitDisabled = $derived(
    (form.name === cart.name && form.icon === cart.icon) ||
        (!form.name && !form.icon)
);
let editDrawer: HTMLDialogElement = $state()!;
function edit() {
    form.name = cart.name;
    form.icon = cart.icon;
    editDrawer.show();
    editDrawer.focus();
}
function noedit() {
    editDrawer.close();
    form.error.name = "";
    form.error.icon = "";
}
async function handleEdit(e: SubmitEvent) {
    e.preventDefault();
    form.error = { name: "", icon: "" };

    if (!form.name) {
        form.error.name = "name required";
        return;
    }

    if (!form.icon) {
        form.error.icon = "icon required";
        return;
    }

    if (submitDisabled) {
        return;
    }

    try {
        if (app.state.defaultCart && isDefault) {
            app.state.defaultCart.name = form.name;
            app.state.defaultCart.icon = form.icon;
        } else {
            cart.name = form.name;
            cart.icon = form.icon;
        }
        const res = await api.carts.patch({
            cart_id: cart.cart_id,
            name: form.name,
            icon: form.icon,
        });
        if (res) {
            noedit();
            showToast("cart updated", "success");
            if (isDefault) {
                app.state.defaultCart = res;
            } else {
                cart = res;
            }
        }
    } catch (e) {}
}
async function handleDelete() {
    if (
        await showConfirm(
            "delete confirmation",
            `are you sure you want to remove '${cart.name}'?`
        )
    ) {
        try {
            const res = await api.carts.delete(cart.cart_id);
            if (res) {
                showToast(`cart '${res.name}' deleted`, "success");
                if (app.state.user?.cart_id === res.cart_id) {
                    app.state.user.cart_id = null;
                    app.state.defaultCart = undefined;
                }
                goto("/carts");
            }
        } catch (e) {}
    }
}

async function handleSetDefault() {
    try {
        await api.users.putDefaultCart(id);
        app.state.user!.cart_id = id;
        app.updateDefaultCart();
        showToast("cart set as default", "success");
    } catch (e) {}
}
// }}}
</script>

{#snippet back()}
    <Button style="icon" type="link" href="/carts">
        <Icon name="arrow_back" size={32} />
    </Button>
{/snippet}

{#snippet opts()}
    <Button style="icon" onclick={edit}>
        <Icon name="edit" size={28} />
    </Button>
{/snippet}

{#if app.state.carts && app.state.items}
    <section class="items items--cart">
        <h2 class="items__title">cart</h2>
        {#if cartitems.length > 0}
            <ul class="items__list items--cart__list">
                {#each cartitems as item}
                    <li class="items__list__item items--cart__list__item">
                        <button
                            onclick={() => remove(item.item_id, item.origin)}
                            class="items__list__item__button items--cart__list__item__button"
                        >
                            <img
                                src={item.icon}
                                alt={item.name + " icon"}
                                class="items__list__item__icon items--cart__list__item__icon"
                            />
                            <p class="items__list__item__name">{item.name}</p>
                            <!-- {#if item.origin} -->
                            <p class="items__list__item__origin">
                                {item.origin}
                            </p>
                            <!-- {/if} -->
                        </button>
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="empty-label" style:height={40 + h + "px"}>
                cart empty :)
            </p>
        {/if}
    </section>
{/if}

<section class="items items--rest">
    <div class="items__tabs">
        <button
            onclick={() => (showRecipes = false)}
            class="items__tabs__button"
            class:items__tabs__button--active={showRecipes === false}
        >
            items
        </button>
        <button
            onclick={() => (showRecipes = true)}
            class="items__tabs__button"
            class:items__tabs__button--active={showRecipes === true}
        >
            recipes
        </button>
    </div>
    <div class="items__search">
        <Input
            id="cart-items-search"
            placeholder={"search for " +
                (!showRecipes ? "items" : "recipes") +
                "..."}
            bind:value={searchterm}
            showClear
        />
    </div>
    {#if app.state.items && app.state.recipes}
        <ul class="items__list items--rest__list">
            {#if !showRecipes}
                {#each restitems as item (item.item_id)}
                    <li class="items__list__item items--rest__list__item">
                        <button
                            onclick={() => add(item.item_id)}
                            class="items__list__item__button items--rest__list__item__button"
                            bind:clientHeight={h}
                        >
                            <img
                                src={item.icon}
                                alt={item.name + " icon"}
                                class="items__list__item__icon items--rest__list__item__icon"
                            />
                            <p class="items__list__item__name">{item.name}</p>
                        </button>
                    </li>
                {/each}
            {:else}
                {#each recipes as recipe (recipe.recipe_id)}
                    <li class="items__list__item items--rest__list__item">
                        <button
                            onclick={() => addRecipe(recipe.recipe_id)}
                            class="items__list__item__button items--rest__list__item__button"
                        >
                            <img
                                src={recipe.icon}
                                alt={recipe.name + " icon"}
                                class="items__list__item__icon items--rest__list__item__icon"
                            />
                            <p class="items__list__item__name">{recipe.name}</p>
                        </button>
                    </li>
                {/each}
            {/if}
        </ul>
    {/if}
</section>

<Drawer bind:ref={editDrawer} onclose={noedit}>
    <div class="edit-drawer">
        <form class="form edit-drawer__form" onsubmit={handleEdit}>
            <header class="form__header">
                <h2 class="form__title">editing {cart.name}</h2>
            </header>
            <Input
                id="cart-name"
                bind:value={form.name}
                error={form.error.name}
                label="name:"
            />
            <Input
                id="cart-icon"
                bind:value={form.icon}
                error={form.error.icon}
                label="icon:"
            />
            <div class="form__submit">
                <Button
                    fillwidth
                    disabled={submitDisabled}
                    tooltip={submitDisabled
                        ? "change something first!"
                        : undefined}
                >
                    save
                </Button>
            </div>
        </form>
        <Separator />
        <Button
            fillwidth
            onclick={handleSetDefault}
            disabled={app.state.user?.cart_id === cart.cart_id}
            tooltip={app.state.user?.cart_id === cart.cart_id
                ? "cart already default"
                : undefined}
        >
            set as default cart
        </Button>
        <Separator />
        <Button fillwidth onclick={handleDelete} style="alert">
            delete cart
        </Button>
    </div>
</Drawer>

<style>
.items--rest {
    background-color: var(--color-surface1);
    flex: 1;
}

.items__title {
    margin: 0.5rem 1rem 0;
}

.items__tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 1rem;
    background-color: var(--color-surface1);
}

.items__tabs__button {
    cursor: pointer;
    background-color: transparent;
    border: 0;
    padding: 1rem;
    border-bottom: 2px solid var(--color-muted);
}

.items__tabs__button--active {
    border-bottom: 2px solid var(--color-primary);
    background-color: var(--color-surface2);
}

.items__search {
    margin: 0 1rem 1rem;
}

.items__list {
    list-style-type: none;
    padding: 1rem;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto 1fr;
    gap: 0.5rem;
    overflow: scroll;
}

.items__list__item__icon {
    width: 64px;
}

.items__list__item__name {
    margin: 0;
}

.items__list__item__origin {
    font-size: 0.675rem;
    margin: 0;
}

.items__list__item__button {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border: 0;
    cursor: pointer;
    font-weight: 600;
    background-color: transparent;
    border-radius: 1rem;
    display: grid;
    justify-items: center;
    align-items: center;
    gap: 0.5rem;
    padding: 2rem;
}

.items--cart__list__item__button {
    background-color: var(--color-surface2);
}

.items--rest__list__item__button {
    background-color: var(--color-surface2);
}

.empty-label {
    margin: 0;
    display: grid;
    place-items: center;
}

@media screen and (max-width: 570px) {
    .items__list {
        grid-template-columns: repeat(3, 1fr);
    }
    .items__list__item__icon {
        max-width: 48px;
    }
    .items__list__item__button {
        padding: 0.75rem;
        gap: 0.125rem;
    }
}

@media screen and (min-width: 720px) {
    .items--rest {
        overflow: hidden;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
    }
}

.edit-drawer {
    display: grid;
    gap: 1rem;
}

@media screen and (max-height: 560px) {
    .edit-drawer__form {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: var(--color-surface2);
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        padding: 1rem;
        z-index: 4;
    }
}

@media screen and (max-height: 560px) {
    .items--rest {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: 4;
        display: flex;
        flex-direction: column;
    }
    .items__list {
        flex: 1;
    }
}
</style>
