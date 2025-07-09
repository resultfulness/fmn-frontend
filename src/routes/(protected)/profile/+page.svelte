<script lang="ts">
import Button from "$lib/components/button.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import app from "$lib/app.svelte";
import api from "$lib/api";
import auth from "$lib/auth.svelte";
import { goto } from "$app/navigation";

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


async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    form.error = { username: "", email: "", newPassword: "" };

    if (!form.username) {
        form.error.username = "username required";
        return;
    }

    if (!form.email) {
        form.error.email = "email required";
        return;
    }

    if (form.email === user.email &&
        form.username === user.username &&
        form.newPassword.length < 1
    ) {
        return;
    }

    try {
        const data = await api.users.patch({
            username: form.username,
            email: form.email,
            password: form.newPassword.length > 0 ? form.newPassword : undefined
        });
        if (data) {
            app.user = data;
            goto("/profile");
        }
    } catch (e: any) {
        form.error.newPassword = e.message;
    }

}
</script>

<h1>
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
                <Button fillwidth>save</Button>
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
                        <td>
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
}}>
    logout
</Button>

<style>
h1 {
    text-align: center;
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

td { padding: 0; }
</style>
