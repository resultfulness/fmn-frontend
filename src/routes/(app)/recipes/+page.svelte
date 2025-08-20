<script lang="ts">
import { getContext, onMount } from "svelte";
import type { LayoutHeader } from "../+layout.svelte";
import app from "$lib/app.svelte";
import { showToast } from "$lib/toast.svelte";
import api from "$lib/api";
import Button from "$lib/components/button.svelte";
import Drawer from "$lib/components/drawer.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import Search from "$lib/components/search.svelte";

async function fetchRecipes() {
    app.state.isLoading++;
    await app.updateRecipes();
    app.state.isLoading--;
}

onMount(() => {
    fetchRecipes();
    getContext<LayoutHeader>("header").title = "recipes";
});

let searchterm = $state("");
let filteredrecipes = $derived(
    app.state.recipes.recipes.filter(c => c.name.includes(searchterm))
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
        const data = await api.recipes.new({
            name: form.name,
            icon: form.icon,
        });
        if (data) {
            app.state.recipes.recipes.push(data);
            noadd();
            showToast("recipe added", "success");
        }
    } catch (e) {}
}
/// }}}
</script>

{#if app.state.recipes}
    <ul class="card-list">
        {#each filteredrecipes as recipe}
            <li>
                <a class="card recipe" href={`/recipes/${recipe.recipe_id}`}>
                    <h2 class="card__title">{recipe.name}</h2>
                    <img
                        class="recipe__icon"
                        src={recipe.icon}
                        alt={recipe.name + " icon"}
                    />
                </a>
            </li>
        {/each}
    </ul>
{/if}
<Search
    id="recipe-search"
    placeholder="search for recipes..."
    bind:searchterm
    onadd={add}
/>
<Drawer bind:ref={addDrawer} onclose={noadd}>
    <form class="form" onsubmit={handleAdd}>
        <header class="form__header">
            <h2 class="form__title">adding recipe</h2>
            <Button type="button" onclick={noadd} style="icon">
                <Icon name="close" size={32} />
            </Button>
        </header>
        <Input
            id="recipe-name"
            label="name:"
            bind:value={form.name}
            error={form.error.name}
        />
        <Input
            id="recipe-icon"
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
.recipe__icon {
    width: 64px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 0.5rem;
}
</style>
