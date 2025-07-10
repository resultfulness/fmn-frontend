<script lang="ts">
import { getContext } from "svelte";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
let { cart } = data;

getContext("header").text = "cart " + cart.name;
</script>

{cart.name}

{#each cart.items as item}
    {item.name}
{/each}
