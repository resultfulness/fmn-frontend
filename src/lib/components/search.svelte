<script lang="ts">
import unfocusOnMobileKeyboardHidden from "$lib/mobile-unfocus";
import { onMount } from "svelte";
import Button from "./button.svelte";
import Icon from "./icon.svelte";
import Input from "./input.svelte";

interface SearchDrawerProps {
    id: string;
    searchterm: string;
    onadd?: () => void;
    placeholder?: string;
}

let {
    id,
    searchterm = $bindable(),
    onadd,
    placeholder,
}: SearchDrawerProps = $props();

onMount(() => {
    unfocusOnMobileKeyboardHidden(id);
});
</script>

<div class="search" style:grid-template-columns={onadd ? "1fr auto" : "1fr"}>
    <Input
        {id}
        bind:value={searchterm}
        {placeholder}
        showClear
        ariaLabel={placeholder}
    />
    {#if onadd}
        <Button style="icon" onclick={onadd}>
            <Icon name="add" size={36} />
        </Button>
    {/if}
</div>

<style>
.search {
    background-color: var(--color-surface2);
    padding: 1rem;

    display: grid;
    gap: 1rem;
}

@media screen and (min-width: 720px) {
    .search {
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
    }
}

@media screen and (max-height: 570px) {
    .search {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: var(--z-above-footer);
    }
}
</style>
