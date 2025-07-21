<script module lang="ts">
type ToastVariant = "info" | "success" | "warn" | "error";
interface Toast {
    visible: boolean;
    message: string;
    variant: ToastVariant;
}

let toast: Toast = $state({
    visible: false,
    message: "",
    variant: "info",
});

let t: number;

export function showToast(
    message: string,
    variant: ToastVariant,
    duration: number = 4000,
) {
    if (toast.visible) {
        clearTimeout(t);
        toast.visible = false;
        toast.message = "";
    }
    setTimeout(() => {
        toast.variant = variant;
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
        transition:fly={{ y: -200, opacity: 1 }}
        class:toast--success={toast.variant === "success"}
        class:toast--warn={toast.variant === "warn"}
        class:toast--error={toast.variant === "error"}
        class:toast--info={toast.variant === "info"}
    >
        <button
            onclick={() => (toast.visible = false)}
            aria-label="close toast"
            class="toast__close"
        ></button>
        <div class="toast__icon">
            <Icon
                name={toast.variant === "success"
                    ? "check"
                    : toast.variant === "warn"
                      ? "warning"
                      : toast.variant === "error"
                        ? "error"
                        : "info"}
                size={40}
            />
        </div>
        <p class="toast__message">{toast.message}</p>
    </div>
{/if}

<style>
.toast {
    z-index: 9;
    position: absolute;
    left: 0;
    right: 0;
    top: 5rem;
    max-width: 240px;
    margin-inline: auto;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    color: var(--color-error-text);
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.1);
}

.toast--success {
    background-color: var(--color-success);
}
.toast--warn {
    background-color: var(--color-warn);
}
.toast--error {
    background-color: var(--color-error);
}
.toast--info {
    background-color: var(--color-muted);
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
