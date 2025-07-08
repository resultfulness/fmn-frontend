<script lang="ts">
interface SeparatorProps {
    text: string;
    spacing?: string;
}
let {
    text,
    spacing
}: SeparatorProps = $props();
</script>

<div class="separator" style:margin-block={spacing}>{text}</div>

<style>
.separator {
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--color-muted);
}

.separator::before,
.separator::after {
    content: '';
    flex: 1;
    border-bottom: 2px solid var(--color-muted);
}

.separator:not(:empty)::before {
    margin-right: .5em;
}

.separator:not(:empty)::after {
    margin-left: .5em;
}
</style>
