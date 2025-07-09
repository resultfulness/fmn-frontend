<script lang="ts">
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
let { items } = data;
</script>

{#each items.items as item}
    {item.name}
{/each}
