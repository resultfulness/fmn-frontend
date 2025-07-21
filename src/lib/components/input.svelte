<script lang="ts">
import Icon from "./icon.svelte";

interface InputProps {
    type?: string;
    placeholder?: string;
    label?: string;
    id: string;
    value: string;
    required?: boolean;
    error?: string;
    ariaLabel?: string;
    showClear?: boolean;
}

let {
    type = "text",
    placeholder,
    label,
    id,
    required,
    value = $bindable(),
    error,
    ariaLabel,
    showClear = false,
}: InputProps = $props();
</script>

<div class="input-group">
    {#if label}
        <label for={id}>
            <span>{label}</span>
        </label>
    {/if}
    <input
        {type}
        {placeholder}
        {id}
        {required}
        aria-label={ariaLabel}
        bind:value
        class="input"
        class:input--error={error}
    />
    {#if error}
        <span class="input-group__error">{error}</span>
    {/if}
    {#if showClear && value.length > 0}
        <button class="input__clear" onclick={() => (value = "")}>
            <Icon name="close" />
        </button>
    {/if}
</div>

<style>
.input-group {
    position: relative;
    display: grid;
    gap: 0.5rem;
}

.input {
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 2px solid var(--color-outline);
    background-color: var(--color-surface0);
}

.input:focus {
    outline: 0;
    border: 2px solid var(--color-primary);
}

.input::placeholder {
    color: var(--color-outline);
}

.input--error {
    border: 2px solid var(--color-error) !important;
}

.input-group__error {
    color: var(--color-error);
}

.input__clear {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    padding-inline: 1rem;
    background: transparent;
    border: 0;
}
</style>
