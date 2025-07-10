<script lang="ts">
import api, { ApiError } from "$lib/api";
import Button from "$lib/components/button.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import type { Item } from "$lib/types";
import type { PageProps } from "./$types";
import { showToast } from "$lib/components/toast.svelte";
import { invalidateAll } from "$app/navigation";
import { getContext } from "svelte";

let { data }: PageProps = $props();
let { items } = $derived(data);

let searchterm = $state("");

const header = getContext("header");

$effect(() => {
    if (searchterm) {
        header.text = `items for '${searchterm}'`
    } else {
        header.text = "items";
    }
})

let filteredItems = $derived(items.items.filter(i => i.name.includes(searchterm)));

let form = $state({
    item_id: -1,
    name: "",
    icon: "",
    error: { name: "", icon: "" },
});
let itemEdited: Item = $state({
    item_id: -1,
    name: "",
    icon: "",
});

let dialog: HTMLDialogElement = $state()!;
function editItem(item: Item) {
    form.item_id = item.item_id;
    form.name = item.name;
    form.icon = item.icon;
    itemEdited = item;
    dialog.showModal();
}

async function handleSubmit(e: SubmitEvent) {
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
        const data = await api.items.patch({
            item_id: form.item_id,
            name: form.name,
            icon: form.icon
        });
        await invalidateAll();
        dialog.close();
        showToast("item updated");
    } catch (e) {
        const ae = e as ApiError;
        switch (ae.status) {
            case 409:
                form.error.name = "item already exists";
                break;
        }
    }
}

function cancelEdit() {
    dialog.close();
    form.error = { name: "", icon: "" };
    form.item_id = -1;
    form.name = "";
    form.icon = "";
    itemEdited = {
        item_id: -1,
        name: "",
        icon: "",
    };
}
</script>

<div class="items">
    <ul class="items__list">
        {#each filteredItems as item}
            <li class="item">
                <img
                    src={item.icon}
                    alt={item.name + " icon"}
                    class="item__icon"
                />
                <p class="item__name">{item.name}</p>
                <button
                    onclick={() => editItem(item)}
                    aria-label={"edit item " + item.name}
                    class="item__edit"
                ></button>
            </li>
        {/each}
    </ul>
    <div class="items__search">
        <Input
            id="items-search__input"
            bind:value={searchterm}
            placeholder="search for items..."
            ariaLabel="search for items..."
        />
    </div>
</div>
<dialog class="dialog" bind:this={dialog}>
    <form onsubmit={handleSubmit} class="form">
        <header class="dialog__header">
            <h2 class="dialog__title">editing item</h2>
            <Button style="icon" onclick={cancelEdit} type="button">
                <Icon name="close" size={32} />
            </Button>
        </header>
        <Input
            id="name"
            bind:value={form.name}
            label="name:"
            error={form.error.name}
        />
        <Input
            id="icon"
            bind:value={form.icon}
            label="icon link:"
            error={form.error.icon}
        />
        <div class="form__submit">
            <Button fillwidth>save</Button>
        </div>
    </form>
</dialog>

<style>
.items {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.items__list {
    flex: 1;
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow: auto;
}

.item {
    position: relative;
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

.items__search {
    bottom: 0;
    left: 0;
    right: 0;
}

.item__edit {
    position: absolute;
    inset: 0;
    border: 0;
    background: 0;
    cursor: pointer;
}

.dialog {
    position: absolute;
    inset: 0;
    margin: auto;
    padding: 2rem;
    border: 2px solid var(--color-surface2);
    border-radius: 1rem;
    background-color: var(--color-background);
    width: min(100% - 2rem, 560px);
}

.dialog::backdrop {
    background-color: rgba(0 0 0 / 0.5);
}

.form {
    display: grid;
    gap: 1rem;
}

.dialog__title {
    margin: 0;
}

.dialog__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.form__submit {
    margin-top: 0.5rem;
}
</style>
