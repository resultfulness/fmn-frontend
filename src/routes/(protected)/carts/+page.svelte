<script lang="ts">
import { getContext, onMount } from "svelte";
import type { LayoutHeader } from "../+layout.svelte";
import app from "$lib/app.svelte";
import api from "$lib/api";
import Button from "$lib/components/button.svelte";
import Drawer from "$lib/components/drawer.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import Search from "$lib/components/search.svelte";
import { showToast } from "$lib/toast.svelte";

const header = getContext<LayoutHeader>("header");
header.title = "carts";

async function fetchCarts() {
    app.state.isLoading++;
    await app.updateCarts();
    app.state.isLoading--;
}

onMount(fetchCarts);

let searchterm = $state("");
let filteredcarts = $derived(
    app.state.carts.carts.filter(c => c.name.includes(searchterm))
);

let form = $state({
    name: "",
    icon: "",
    error: {
        name: "",
        icon: "",
    },
});

// {{{ add
let addDrawer: HTMLDialogElement = $state()!;
function add() {
    form.name = searchterm;
    addDrawer.show();
}
function noadd() {
    addDrawer.close();
    form.name = "";
    form.icon = "";
    form.error = { name: "", icon: "" };
}
async function handleAdd(e: SubmitEvent) {
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

    try {
        const data = await api.carts.new({
            name: form.name,
            icon: form.icon,
        });
        if (data) {
            app.state.carts.carts.push(data);
            noadd();
            showToast("cart added", "success");
        }
    } catch (e) {}
}
/// }}}
</script>

{#if app.state.carts}
    {#if app.state.carts.count < 1}
        <p class="empty-label">no carts yet</p>
    {:else}
        <ul class="card-list">
            {#each filteredcarts as cart}
                <li>
                    <a class="card cart" href={`/carts/${cart.cart_id}`}>
                        <h2 class="card__title">{cart.name}</h2>
                        <img
                            src={cart.icon}
                            alt="cart icon"
                            class="cart__icon"
                        />
                    </a>
                </li>
            {/each}
        </ul>
    {/if}
{/if}
<Search
    id="carts-search"
    placeholder="search for carts..."
    bind:searchterm
    onadd={add}
/>
<Drawer bind:ref={addDrawer} onclose={noadd}>
    <form class="form" onsubmit={handleAdd}>
        <header class="form__header">
            <h2 class="form__title">adding cart</h2>
            <Button type="button" onclick={noadd} style="icon">
                <Icon name="close" size={32} />
            </Button>
        </header>
        <Input
            id="cart-name"
            label="name:"
            bind:value={form.name}
            error={form.error.name}
        />
        <Input
            id="cart-icon"
            label="icon url:"
            bind:value={form.icon}
            error={form.error.icon}
        />
        <div class="form__submit">
            <Button fillwidth>add</Button>
        </div>
    </form>
</Drawer>

<style>
.cart__icon {
    width: 96px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 0.5rem;
}
</style>
