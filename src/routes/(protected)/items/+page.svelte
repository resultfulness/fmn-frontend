<script lang="ts">
import { invalidateAll } from "$app/navigation";
import api, { ApiError } from "$lib/api";
import Button from "$lib/components/button.svelte";
import { showConfirm } from "$lib/components/confirm.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import { showToast } from "$lib/components/toast.svelte";
import type { Item } from "$lib/types";
import type { PageProps } from "./$types";
import { getContext } from "svelte";

let { data }: PageProps = $props();
let { items } = $derived(data);

const header = getContext("header");

$effect(() => {
    if (searchterm) {
        header.text = `items for '${searchterm}'`
    } else {
        header.text = "items";
    }
})

let searchterm = $state("");
let filteredItems = $derived(items.items.filter(i => i.name.includes(searchterm)));

let form = $state({
    name: "",
    icon: "",
    error: {
        name: "",
        icon: "",
    },
});

// {{{ edit
let editMode = $state(false);
let itemEdited: Item | null = $state(null);
function edit(item: Item) {
    itemEdited = item;
    form.name = itemEdited.name;
    form.icon = itemEdited.icon;
    editMode = true;
}
function noedit() {
    editMode = false;
    form.name = "";
    form.icon = "";
    form.error = { name: "", icon: "" };
    itemEdited = null;
}
$effect(() => {
    if (searchterm) {
        noedit();
    }
});
let submitDisabled = $derived(
    (form.name === itemEdited?.name || form.name.length < 1) &&
    (form.icon === itemEdited?.icon || form.icon.length < 1)
);
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
            showToast("item saved");
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
let addMode = $state(false);
function add() {
    form.name = searchterm;
    addMode = true;
}
function noadd() {
    addMode = false;
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
            showToast("item added");
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

async function handleDelete() {
    if (!itemEdited) return;

    if (await showConfirm(
        "delete confirmation",
        `are you sure you want to remove '${itemEdited.name}'?`
    )) {
        try {
            const data = await api.items.delete(itemEdited.item_id);
            if (data) {
                noedit();
                showToast(`item '${data.name}' deleted`);
                await invalidateAll();
            }
        } catch (e) {}
    }
}
</script>

<ul class="items__list">
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
</ul>
<section class="items__actions">
    {#if editMode}
        <form class="form" onsubmit={handleEdit}>
            <header class="form__header">
                <h2 class="form__title">editing item</h2>
                <Button
                    type="button"
                    onclick={noedit}
                    style="icon"
                >
                    <Icon name="close" size={32}/>
                </Button>
            </header>
            <Input
                id="item-name"
                bind:value={form.name}
                error={form.error.name}
            />
            <Input
                id="item-icon"
                bind:value={form.icon}
                error={form.error.icon}
            />
            <div class="form__submit">
                <Button
                    fillwidth
                    style="alert"
                    type="button"
                    onclick={handleDelete}
                >
                    delete
                </Button>
                <Button fillwidth disabled={submitDisabled}>save</Button>
            </div>
        </form>
        <hr />
    {:else if addMode}
        <form class="form" onsubmit={handleAdd}>
            <header class="form__header">
                <h2 class="form__title">adding item</h2>
                <Button
                    type="button"
                    onclick={noadd}
                    style="icon"
                >
                    <Icon name="close" size={32}/>
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
        <hr />
    {/if}
    <div class="items__search-add">
        <Input
            id="item-search"
            bind:value={searchterm}
            placeholder="search for items..."
            ariaLabel="search for items..."
        />
        <Button onclick={add} style="icon">
            <Icon name="add" size={32}/>
        </Button>
    </div>
</section>

<style>
.items__list {
    flex: 1;
    list-style-type: none;
    padding: 0;
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
    filter: invert();
}

.item__edit {
    margin-left: auto;
    margin-right: 0.25rem;
    display: grid;
}

.items__actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-surface2);
    padding: 1rem;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}

@media screen and (max-height: 600px) {
    .form {
        position: fixed;
        inset: 0;
        background-color: var(--color-surface2);
        padding: 2rem;
        display: flex;
        flex-direction: column;
    }
}

.items__search-add {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
}
</style>
