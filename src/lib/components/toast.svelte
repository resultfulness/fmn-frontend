<script module lang="ts">
let toast = $state({
    visible: false,
    message: "",
});

let t: number;

export function showToast(message: string, duration: number = 4000) {
    if (toast.visible) {
        clearTimeout(t);
        toast.visible = false;
        toast.message = "";
    }
    setTimeout(() => {
        toast.message = message;
        toast.visible = true;
    }, 100);
    t = setTimeout(() => {
        toast.visible = false;
        toast.message = "";
    }, duration);
}
</script>

<script lang="ts">
import { fly } from "svelte/transition";
import Icon from "./icon.svelte";
</script>

{#if toast.visible}
    <div
        class="toast"
        transition:fly={{ y: 200 }}
    >
        <button
            onclick={() => toast.visible = false}
            aria-label="close toast"
            class="toast__close"
        ></button>
        <div class="toast__icon">
            <Icon name="info" size={40} />
        </div>
        <p class="toast__message">{toast.message}</p>
    </div>
{/if}

<style>
.toast {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 6rem;
    max-width: 240px;
    margin-inline: auto;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    background-color: var(--color-muted);
    color: var(--color-text);
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.1);
}

.toast__icon {
    padding: 1rem;
}

.toast__message {
    overflow: hidden;
    max-width: 1049px;
    font-size: 1.1rem;
}

.toast__close {
    position: absolute;
    inset: 0;
    border: 0;
    background: 0;
}
</style>
