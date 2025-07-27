<script lang="ts">
import { getContext, onMount } from "svelte";
import type { PageProps } from "./$types";
import api from "$lib/api";
import Button from "$lib/components/button.svelte";
import Drawer from "$lib/components/drawer.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import { afterNavigate, goto } from "$app/navigation";
import Separator from "$lib/components/separator.svelte";
import { showConfirm } from "$lib/components/confirm.svelte";
import { showToast } from "$lib/components/toast.svelte";
import app from "$lib/app.svelte";
import unfocusOnMobileKeyboardHidden from "$lib/mobile-unfocus";

let { data }: PageProps = $props();
let { cart } = $derived(data);
let cartitems = $derived(cart.items);
let { items } = $derived(data);
let searchQuery = $state("");

let restitems = $derived(
    items.items
        .filter(
            item =>
                !cartitems.some(cartitem => cartitem.item_id === item.item_id)
        )
        .filter(item => item.name.includes(searchQuery))
);

async function add(id: number) {
    searchQuery = "";
    cartitems = [...cartitems, restitems.find(item => item.item_id === id)!];
    restitems = restitems.filter(item => item.item_id !== id);
    cart = await api.carts.putItem(data.cart!.cart_id, id);
}

async function remove(id: number) {
    restitems = [...restitems, cartitems.find(item => item.item_id === id)!];
    cartitems = cartitems.filter(item => item.item_id !== id);
    cart = await api.carts.deleteItem(data.cart!.cart_id, id);
}

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
        const res = await api.carts.patch({
            cart_id: cart.cart_id,
            name: form.name,
            icon: form.icon,
        });
        if (res) {
            noedit();
            showToast("cart updated", "success");
            header.title = res.name;
            cart = res;
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
                if (app.user.cart_id === res.cart_id) {
                    app.user.cart_id = null;
                }
                goto("/carts");
            }
        } catch (e) {}
    }
}

async function handleSetDefault() {
    try {
        await api.users.putDefaultCart(cart.cart_id);
        app.user.cart_id = cart.cart_id;
        showToast("cart set as default", "success");
    } catch (e) {}
}

onMount(() => {
    unfocusOnMobileKeyboardHidden("cart-items-search");
});

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
    <Button style="icon" onclick={edit}>
        <Icon name="edit" size={28} />
    </Button>
{/snippet}

<section class="items items--cart">
    <h2 class="items__title">cart</h2>
    {#if cartitems.length > 0}
        <ul class="items__list items--cart__list">
            {#each cartitems as item}
                <li class="items__list__item items--cart__list__item">
                    <button
                        onclick={() => remove(item.item_id)}
                        class="items__list__item__button items--cart__list__item__button"
                    >
                        <img
                            src={item.icon}
                            alt={item.name + " icon"}
                            class="items__list__item__icon items--cart__list__item__icon"
                        />
                        <p class="items__list__item__name">{item.name}</p>
                    </button>
                </li>
            {/each}
        </ul>
    {:else}
        <p class="empty-label">cart empty :)</p>
    {/if}
</section>

<section class="items items--rest">
    <h2 class="items__title">items</h2>
    <div class="items__search">
        <Input
            id="cart-items-search"
            placeholder="search for items..."
            bind:value={searchQuery}
            showClear
        />
    </div>
    <ul class="items__list items--rest__list">
        {#each restitems as item}
            <li class="items__list__item items--rest__list__item">
                <button
                    onclick={() => add(item.item_id)}
                    class="items__list__item__button items--rest__list__item__button"
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
    </ul>
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
            disabled={app.user?.cart_id === cart.cart_id}
            tooltip={app.user?.cart_id === cart.cart_id
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
.items__title {
    padding-inline: 1rem;
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
    gap: 0.5rem;
    overflow: scroll;
}

.items__list__item__icon {
    width: 64px;
}

.items__list__item__name {
    margin: 0;
}

.items__list__item__button {
    width: 100%;
    aspect-ratio: 1 / 1;
    border: 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    font-weight: 600;
    background-color: transparent;
    border-radius: 1rem;
    padding: 2rem;
}

.items--cart__list__item__button {
    background-color: var(--color-surface2);
}

.items--rest__list__item__button {
    background-color: var(--color-surface1);
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
        gap: 0.5rem;
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
        background-color: var(--color-surface2);
        z-index: 4;
        display: flex;
        flex-direction: column;
    }
    .items__list {
        flex: 1;
    }
}
</style>
