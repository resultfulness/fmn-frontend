<script lang="ts">
import { getContext, onMount } from "svelte";
import type { PageProps } from "./$types";

onMount(() => {
    getContext("header").title = "recipes";
});

let { data }: PageProps = $props();

let { recipes } = $derived(data);
</script>

<ul class="recipe-list">
    {#each recipes.recipes as recipe}
        <li class="recipe-list__item">
            <a class="recipe" href={`/recipes/${recipe.recipe_id}`}>
                <h2 class="recipe__title">{recipe.name}</h2>
                <img
                    class="recipe__icon"
                    src={recipe.icon}
                    alt={recipe.name + " icon"}
                />
            </a>
        </li>
    {/each}
</ul>

<style>
.recipe-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: grid;
    padding: 1rem;
    overflow: scroll;
    gap: 1rem;
}

.recipe {
    padding: 1rem;
    background-color: var(--color-surface1);
    border-radius: 1rem;
    display: flex;
    justify-content: space-between;
    text-decoration: none;
    color: inherit;
}

.recipe:hover {
    background-color: var(--color-surface2);
}

.recipe__title {
    margin: 0;
    gap: 1rem;
}

.recipe__icon {
    width: 64px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 0.5rem;
}
</style>
