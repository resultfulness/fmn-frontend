<script lang="ts">
import { onMount, type Snippet } from "svelte";

interface DrawerProps {
    children: Snippet;
    onclose?: () => void;
    ref?: HTMLDialogElement;
    noanim?: boolean;
}

onMount(() => {
    drawer.addEventListener("focusout", e => {
        if (drawer.contains(e.relatedTarget)) return;
        drawer.close();
    });
});

let {
    ref = $bindable(),
    children,
    onclose = () => {},
    noanim = false,
}: DrawerProps = $props();

let drawer: HTMLDialogElement = $state()!;
</script>

<div class="drawer-anchor">
    <dialog
        bind:this={drawer}
        class="drawer drawer--open"
        {onclose}
        bind:this={ref}
        class:drawer--noanim={noanim}
    >
        {@render children()}
    </dialog>
</div>

<style>
.drawer-anchor {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
}

.drawer {
    width: min(100%, 720px);
    padding: 1rem;
    border: none;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    background-color: var(--color-surface2);
}

@media (prefers-reduced-motion: no-preference) {
    .drawer {
        transition: transform 300ms;
    }
}

.drawer--noanim {
    transition: none;
}

.drawer--open {
    transform: translateY(-100%);
    @starting-style {
        transform: translateY(0);
    }
}

@media screen and (min-height: 1000px) {
    .drawer-anchor {
        z-index: 1;
    }
    .drawer--open {
        transform: translateY(calc(-100% - 4rem));
        @starting-style {
            transform: translateY(0);
        }
    }
}
</style>
