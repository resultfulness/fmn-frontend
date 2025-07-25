<script lang="ts">
import { invalidateAll } from "$app/navigation";
import type { ApiError } from "$lib/api";
import api from "$lib/api";
import Button from "$lib/components/button.svelte";
import { showConfirm } from "$lib/components/confirm.svelte";
import Drawer from "$lib/components/drawer.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import { showToast } from "$lib/components/toast.svelte";
import type { Item } from "$lib/types";
import type { PageProps } from "./$types";
import { getContext, onMount } from "svelte";
import unfocusOnMobileKeyboardHidden from "$lib/mobile-unfocus";

let { data }: PageProps = $props();
let { items } = $derived(data);
let searchterm = $state("");
let filteredItems = $derived(
    items.items.filter(i => i.name.includes(searchterm))
);

let form = $state({
    name: "",
    icon: "",
    error: {
        name: "",
        icon: "",
    },
});
let itemEdited: Item | undefined = $state();
let submitDisabled = $derived(
    (form.name === itemEdited?.name || form.name.length < 1) &&
        (form.icon === itemEdited?.icon || form.icon.length < 1)
);

// {{{ edit
let editDrawer: HTMLDialogElement = $state()!;
function edit(item: Item) {
    itemEdited = item;
    form.name = itemEdited.name;
    form.icon = itemEdited.icon;
    editDrawer.show();
}
function noedit() {
    editDrawer.close();
    form.name = "";
    form.icon = "";
    form.error = { name: "", icon: "" };
    itemEdited = undefined;
}
async function handleEdit(e: SubmitEvent) {
    e.preventDefault();
    if (!itemEdited) return;
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
        const data = await api.items.patch({
            item_id: itemEdited.item_id,
            name: form.name,
            icon: form.icon,
        });
        if (data) {
            noedit();
            showToast("item saved", "success");
            await invalidateAll();
        }
    } catch (e) {
        const ae = e as ApiError;
        switch (ae.status) {
            case 409:
                form.error.name = ae.message;
                break;
        }
    }
}
// }}}

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
        const data = await api.items.new({
            name: form.name,
            icon: form.icon,
        });
        if (data) {
            noadd();
            showToast("item added", "success");
            await invalidateAll();
        }
    } catch (e) {
        const ae = e as ApiError;
        switch (ae.status) {
            case 409:
                form.error.name = ae.message;
                break;
        }
    }
}
/// }}}

// {{{ delete
async function handleDelete(id: number) {
    if (itemEdited === undefined) return;

    if (
        await showConfirm(
            "delete confirmation",
            `are you sure you want to remove '${itemEdited.name}'?`
        )
    ) {
        try {
            filteredItems = filteredItems.filter(item => item.item_id !== id);
            const res = await api.items.delete(id);
            if (res) {
                noedit();
                showToast(`item '${res.name}' deleted`, "success");
                await invalidateAll();
            }
        } catch (e) {}
    }
}
// }}}

// {{{ search
let searchMode = $state(false);
let searchDrawer: HTMLDialogElement = $state()!;
function search() {
    searchMode = true;
    searchDrawer.show();
}
function nosearch() {
    searchMode = false;
    searchDrawer.close();
}
// }}}

const header = getContext("header");
header.title = "items";

onMount(() => {
    unfocusOnMobileKeyboardHidden("items-search");
})
</script>

<ul class="items__list">
    {#if filteredItems.length > 0}
        {#each filteredItems as item}
            <li class="item">
                <img
                    src={item.icon}
                    alt={item.name + " icon"}
                    class="item__icon"
                />
                <p class="item__name">{item.name}</p>
                <div class="item__edit">
                    <Button style="icon" onclick={() => edit(item)}>
                        <Icon name="edit" size={28} />
                    </Button>
                </div>
            </li>
        {/each}
    {:else}
        <p class="empty-label">no items for '{searchterm}'</p>
    {/if}
</ul>
{#if !searchMode}
    <section class="fake-search">
        <div class="fake-input">
            {#if searchterm}
                <span class="fake-input__searchterm">{searchterm}</span>
            {:else}
                search for items...
            {/if}
            <button
                class="fake-input__action"
                aria-label="open item search"
                onclick={search}
            ></button>
            {#if searchterm}
                <button
                    class="fake-input__clear"
                    onclick={() => (searchterm = "")}
                >
                    <Icon name="close" />
                </button>
            {/if}
        </div>
        <Button style="icon" onclick={add}>
            <Icon name="add" size={36} />
        </Button>
    </section>
{/if}
<Drawer bind:ref={searchDrawer} onclose={nosearch} noanim>
    <div class="search-drawer">
        <Input
            id="items-search"
            bind:value={searchterm}
            placeholder="search for items..."
            ariaLabel="search for items"
            showClear
        />
        <Button style="icon" onclick={add}>
            <Icon name="add" size={36} />
        </Button>
    </div>
</Drawer>
<Drawer bind:ref={editDrawer} onclose={noedit}>
    <form class="form" onsubmit={handleEdit}>
        <header class="form__header">
            <h2 class="form__title">editing item</h2>
            <Button type="button" onclick={noedit} style="icon">
                <Icon name="close" size={32} />
            </Button>
        </header>
        <Input id="item-name" bind:value={form.name} error={form.error.name} />
        <Input id="item-icon" bind:value={form.icon} error={form.error.icon} />
        <div class="form__submit">
            <Button
                fillwidth
                style="alert"
                type="button"
                onclick={() => handleDelete(itemEdited!.item_id)}
            >
                delete
            </Button>
            <Button
                fillwidth
                disabled={submitDisabled}
                tooltip={submitDisabled ? "change something first!" : undefined}
            >
                save
            </Button>
        </div>
    </form>
</Drawer>
<Drawer bind:ref={addDrawer} onclose={noadd}>
    <form class="form" onsubmit={handleAdd}>
        <header class="form__header">
            <h2 class="form__title">adding item</h2>
            <Button type="button" onclick={noadd} style="icon">
                <Icon name="close" size={32} />
            </Button>
        </header>
        <Input
            id="item-name"
            label="name:"
            bind:value={form.name}
            error={form.error.name}
        />
        <Input
            id="item-icon"
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
.items__list {
    flex: 1;
    list-style-type: none;
    padding: 1rem;
    margin: 0;
    overflow: auto;
}

.item {
    background-color: var(--color-surface1);
    padding: 0.5rem;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 1rem;
    border-radius: 1rem;
    margin-bottom: 0.5rem;
}

.item__name {
    margin: 0;
}

.item__icon {
    width: 32px;
    object-fit: cover;
}

.item__edit {
    margin-left: auto;
    margin-right: 0.25rem;
    display: grid;
}

.fake-search {
    background-color: var(--color-surface2);
    padding: 1rem;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
}

.fake-input {
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 2px solid var(--color-outline);
    background-color: var(--color-surface0);
    color: var(--color-outline);
    position: relative;
}

.fake-input__searchterm {
    color: var(--color-text);
}

.fake-input__action {
    position: absolute;
    inset: 0;
    background-color: transparent;
    border: none;
    cursor: text;
}

.fake-input__clear {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    padding-inline: 1rem;
    background: transparent;
    border: 0;
}

.search-drawer {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
}
</style>
