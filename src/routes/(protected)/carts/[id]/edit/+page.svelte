<script lang="ts">
import api from "$lib/api";
import app from "$lib/app.svelte";
import Button from "$lib/components/button.svelte";
import Input from "$lib/components/input.svelte";
import Separator from "$lib/components/separator.svelte";
import { showConfirm } from "$lib/components/confirm.svelte";
import { showToast } from "$lib/toast.svelte";
import { getContext, onMount } from "svelte";
import type { LayoutHeader } from "../../../+layout.svelte";
import { afterNavigate, goto } from "$app/navigation";
import Icon from "$lib/components/icon.svelte";
import type { Cart } from "$lib/types";

const header = getContext<LayoutHeader>("header");
afterNavigate(() => {
    header.left = back;
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
    if (app.state.defaultCart && isDefault) {
        await app.updateDefaultCart();
        cart = app.state.defaultCart;
    } else {
        cart = await api.carts.get(id);
    }
    app.state.isLoading--;
}

onMount(fetchDeps);

// {{{ cart edit
let form = $state({
    name: "",
    icon: "",
    error: { name: "", icon: "" },
});
$effect(() => {
    form.name = cart.name;
    form.icon = cart.icon;
});
let submitDisabled = $derived(
    (form.name === cart.name && form.icon === cart.icon) ||
        (!form.name && !form.icon)
);
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
    <Button style="icon" type="link" href={`/carts/${cart.cart_id}`}>
        <Icon name="arrow_back" size={32} />
    </Button>
{/snippet}

<section class="card card--vertical cart-edit">
    <form class="form form--popout" onsubmit={handleEdit}>
        <h2 class="form__title">editing {cart.name}</h2>
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
                tooltip={submitDisabled ? "change something first!" : undefined}
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
    <Button fillwidth onclick={handleDelete} style="alert">delete cart</Button>
</section>

<style>
.cart-edit {
    margin: 1rem;
}
</style>
