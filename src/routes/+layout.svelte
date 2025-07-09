<script>
import "../app.css";
import Toast, { showToast } from "$lib/components/toast.svelte";

let { children } = $props();
</script>

{@render children()}

<Toast />
