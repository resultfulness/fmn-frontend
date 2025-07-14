<script module lang="ts">
import Button from "./button.svelte";

let confirm: (() => void) | undefined = $state();
let cancel: (() => void) | undefined = $state();
let dialogTitle: string = $state("");
let dialogMessage: string = $state("");
let dialog: HTMLDialogElement = $state()!;
export function showConfirm(title: string, message: string): Promise<boolean> {
    dialogTitle = title;
    dialogMessage = message;
    dialog.showModal();
    return new Promise((res) => {
        confirm = () => res(true);
        cancel = () => res(false);
    })
};
</script>

<dialog class="dialog" bind:this={dialog}>
    <p class="dialog__title">{dialogTitle}</p>
    <hr />
    <p class="dialog__subtitle">{dialogMessage}</p>
    <div class="dialog__submit">
        <form method="dialog" onsubmit={cancel}>
            <Button fillwidth style="secondary">cancel</Button>
        </form>
        <form method="dialog" onsubmit={confirm}>
            <Button fillwidth>confirm</Button>
        </form>
    </div>
</dialog>

<style>
.dialog {
    position: absolute;
    border: 0;
    inset: 0;
    border-radius: 1rem;
    background-color: var(--color-surface2);
    color: var(--color-text);
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.1);
}

.dialog::backdrop {
    background-color: rgba(0 0 0 / 0.5);
}

.dialog__title {
    text-align: center;
    font-size: 1.5rem;
    margin: 0.5rem auto;
    font-weight: bold;
}

.dialog__subtitle {
    text-align: center;
    margin-bottom: 1.5rem;
}

.dialog__submit {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr;
}

.dialog__submit > * {
    display: grid;
}
</style>
