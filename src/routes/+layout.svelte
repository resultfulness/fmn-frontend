<script>
import "../app.css";
import "$lib/style/form.css";
import "$lib/style/card.css";
import Confirm from "$lib/components/confirm.svelte";
import Toast from "$lib/components/toast.svelte";

let { children } = $props();
</script>

{@render children()}

<Toast />
<Confirm />
