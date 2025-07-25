<script lang="ts">
import Button from "$lib/components/button.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import app from "$lib/app.svelte";
import api, { ApiError } from "$lib/api";
import auth from "$lib/auth.svelte";
import { goto } from "$app/navigation";
import { showToast } from "$lib/components/toast.svelte";
import { getContext } from "svelte";

getContext("header").title = "profile";

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
            password:
                form.newPassword.length > 0 ? form.newPassword : undefined,
        });
        if (data) {
            app.user = data;
            showToast("data saved", "success");
            editMode = false;
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

<section class="card card--info">
    <h2 class="card__title">info</h2>
    <span>role: {user.role}</span>
    {#if editMode}
        <form class="form card--info__form" onsubmit={handleSubmit}>
            <h3 class="form__title">details (edit)</h3>

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

            <div class="form__submit">
                <Button
                    fillwidth
                    style="secondary"
                    onclick={() => {
                        editMode = false;
                    }}
                    type="button"
                >
                    cancel
                </Button>
                <Button
                    fillwidth
                    disabled={submitDisabled}
                    tooltip={submitDisabled
                        ? "change something first!"
                        : undefined}
                >
                    save
                </Button>
            </div>
        </form>
    {:else}
        <div class="card--info__details">
            <div class="card--info__details__header">
                <h3 class="card--info__details__title">details</h3>
                <Button
                    style="icon"
                    onclick={() => {
                        editMode = !editMode;
                    }}
                >
                    <Icon name="edit" />
                </Button>
            </div>

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
<div class="logout">
    <Button
        fillwidth
        tooltip="logout"
        onclick={() => {
            auth.clear();
            goto("/login");
            showToast("logged out", "info");
        }}
    >
        logout
    </Button>
</div>

<style>
.card {
    position: relative;
    background-color: var(--color-surface1);
    padding: 1rem;
    border-radius: 1rem;
    margin: 1rem 1rem 0;
}

.card__title {
    margin: 0;
    margin-bottom: 1rem;
}

.card--info__form {
    margin-top: 1rem;
}

@media screen and (max-height: 560px) {
    .card--info__form {
        position: fixed;
        inset: 0;
        overflow-x: hidden;
        margin: 1rem;
        background-color: var(--color-surface1);
        border-radius: 1rem;
        padding: 1rem;
        z-index: 4;
    }

    .form__title {
        display: none;
    }
}

.card--info__details__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block: 1rem;
}

.card--info__details__table {
    width: 100%;
    border: 0;
    border-collapse: collapse;
}

.card--info__details__title {
    margin: 0;
}

.card--info__details__entry {
    display: flex;
    justify-content: space-between;
}

.card--info__details__password {
    display: flex;
    align-items: center;
}

td {
    padding: 0;
}

.logout {
    margin: 1rem;
}
</style>
