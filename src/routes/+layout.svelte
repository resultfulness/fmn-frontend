<script>
import "../app.css";
import "$lib/style/form.css";
import Confirm from "$lib/components/confirm.svelte";
import Toast from "$lib/components/toast.svelte";
import { navigating } from "$app/state";
import Loading from "./loading.svelte";

let { children } = $props();
</script>

{#if navigating.to}
    <Loading />
{/if}

{@render children()}

<Toast />
<Confirm />
