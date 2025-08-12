<script>
import { navigating } from "$app/state";
import app from "$lib/app.svelte";
</script>

{#if app.state.isLoading > 0 || navigating.to}
    <span class="loader">
        <span class="bar"></span>
    </span>
{/if}

<style>
.loader {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 0;
    overflow: visible;
}

.bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;

    --_bg-color: var(--color-muted);
    --_progress-color: var(--color-primary);

    background-color: var(--_bg-color);
    animation: movebgright 1s infinite linear;
    background-image: linear-gradient(
        90deg,
        var(--_bg-color) 0%,
        var(--_progress-color) 50%,
        var(--_bg-color) 50%,
        var(--_bg-color) 50%,
        var(--_progress-color)
    );
    background-size: 200% 100%;
}

@keyframes movebgright {
    0% {
        background-position: 100% 0;
    }
    100% {
        background-position: 0 0;
    }
}
</style>
