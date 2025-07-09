<script lang="ts">
import Button from "$lib/components/button.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import app from "$lib/app.svelte";
import api, { ApiError } from "$lib/api";
import auth from "$lib/auth.svelte";
import { goto } from "$app/navigation";
import { showToast } from "$lib/components/toast.svelte";

let user = $derived(app.user!);

let editMode = $state(false);
let form = $state({
    username: "",
    email: "",
    newPassword: "",
    error: {
        username: "",
        email: "",
        newPassword: "",
    },
});

let submitDisabled = $derived(
    (form.email === user.email || form.email.length < 1) &&
    (form.username === user.username || form.username.length < 1) &&
    form.newPassword.length < 1
);


async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    form.error = { username: "", email: "", newPassword: "" };

    if (submitDisabled) {
        return;
    }

    try {
        const data = await api.users.patch({
            username: form.username.length > 0 ? form.username : undefined,
            email: form.email.length > 0 ? form.email : undefined,
            password: form.newPassword.length > 0 ? form.newPassword : undefined
        });
        if (data) {
            app.user = data;
            showToast("data saved");
            // goto("/profile");
        }
    } catch (e) {
        const ae = e as ApiError;
        switch (ae.status) {
            case 409:
                form.error.email = ae.message;
                break;
        }
    }

}
</script>

<h1 title={user.username}>
    {user.username}
</h1>
<section class="card card--info">
    <h2 class="card__title">info</h2>
    <div class="card--info__edit">
        <Button style="transparent" onclick={() => {editMode = !editMode}}>
            <Icon name="edit" />
        </Button>
    </div>
    <span>role: {user.role}</span>
    {#if editMode}
        <form class="card--info__form" onsubmit={handleSubmit}>
            <h3 class="card--info__form__title">details (edit)</h3>

            <Input
                id="username"
                bind:value={form.username}
                label="username:"
                error={form.error.username}
                placeholder={user.username}
            />
            <Input
                id="email"
                bind:value={form.email}
                label="email:"
                type="email"
                error={form.error.email}
                placeholder={user.email}
            />
            <Input
                id="newPassword"
                bind:value={form.newPassword}
                label="new password (empty - no change):"
                type="password"
                error={form.error.newPassword}
            />

            <div class="card--info__form__actions">
                <Button
                    fillwidth
                    style="secondary"
                    onclick={() => editMode = false}
                    type="button"
                >
                    cancel
                </Button>
                <Button fillwidth disabled={submitDisabled}>
                    save
                </Button>
            </div>
        </form>
    {:else}
        <div class="card--info__details">
            <h3 class="card--info__details__title">details</h3>

            <table class="card--info__details__table">
                <tbody>
                    <tr class="card--info__details__entry">
                        <td>username:</td>
                        <td>{user.username}</td>
                    </tr>
                    <tr class="card--info__details__entry">
                        <td>email:</td>
                        <td>{user.email}</td>
                    </tr>
                    <tr class="card--info__details__entry">
                        <td>password:</td>
                        <td class="card--info__details__password">
                            {#each Array(8) as _}
                                <Icon name="circle" size={12} />
                            {/each}
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    {/if}
</section>
<Button fillwidth onclick={() => {
    auth.clear();
    goto("/login");
    showToast("logged out");
}}>
    logout
</Button>

<style>
h1 {
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card {
    position: relative;
    background-color: var(--color-surface0);
    padding: 1rem;
    border-radius: 1rem;
    margin-bottom: 1rem;
}

.card__title {
    margin: 0;
    margin-bottom: 1rem;
}

.card--info__edit {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
}

.card--info__form {
    display: grid;
    gap: 1rem;
}

.card--info__form__title {
    margin-bottom: 0;
}

.card--info__form__actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.card--info__details__table {
    width: 100%;
    border: 0;
    border-collapse: collapse;
}

.card--info__details__title {
    margin-bottom: 1rem;
}

.card--info__details__entry {
    display: flex;
    justify-content: space-between;
}

.card--info__details__password {
    display: flex;
    align-items: center;
}

td { padding: 0; }
</style>
