<script lang="ts">
interface InputProps {
    type?: string;
    placeholder?: string;
    label?: string;
    id: string;
    value: string;
    required?: boolean;
    error?: string;
}

let {
    type = "text",
    placeholder,
    label,
    id,
    required,
    value = $bindable(),
    error,
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
        bind:value
        class="input-group__input"
        class:input-group__input--error={error}
    />
    {#if error}
        <span class="input-group__error">{error}</span>
    {/if}
</div>

<style>
.input-group {
    display: grid;
    gap: 0.5rem;
}

.input-group__input {
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 2px solid var(--color-muted);
    background-color: var(--color-surface1);
}

.input-group__input:focus {
    outline: 0;
    border: 2px solid var(--color-primary);
}

.input-group__input--error {
    border: 2px solid var(--color-error) !important;
}

.input-group__error {
    color: var(--color-error);
}

</style>
