<script lang="ts">
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
let { cart } = data;
</script>

{cart.name}

{#each cart.items as item}
    {item.name}
{/each}
