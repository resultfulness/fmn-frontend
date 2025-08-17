<script lang="ts">
import Button from "$lib/components/button.svelte";
import Icon from "$lib/components/icon.svelte";
import Input from "$lib/components/input.svelte";
import app from "$lib/app.svelte";
import api, { ApiError } from "$lib/api";
import auth from "$lib/auth.svelte";
import { showToast } from "$lib/toast.svelte";
import { getContext } from "svelte";
import type { LayoutHeader } from "../+layout.svelte";

getContext<LayoutHeader>("header").title = "profile";

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
    (form.email === app.state.user?.email || form.email.length < 1) &&
        (form.username === app.state.user?.username ||
            form.username.length < 1) &&
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
            app.state.user = data;
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

{#if app.state.user}
    <section class="card card--vertical info">
        <h2 class="card__title">info</h2>
        <p class="info__role">role: {app.state.user.role}</p>
        {#if editMode}
            <form class="form form--popout" onsubmit={handleSubmit}>
                <h3 class="form__title">details (edit)</h3>

                <Input
                    id="username"
                    bind:value={form.username}
                    label="username:"
                    error={form.error.username}
                    placeholder={app.state.user.username}
                />
                <Input
                    id="email"
                    bind:value={form.email}
                    label="email:"
                    type="email"
                    error={form.error.email}
                    placeholder={app.state.user.email}
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
            <div class="info__details">
                <div class="info__details__header">
                    <h3 class="info__details__title">details</h3>
                    <Button
                        style="icon"
                        onclick={() => {
                            editMode = !editMode;
                        }}
                    >
                        <Icon name="edit" />
                    </Button>
                </div>

                <table class="info__details__table">
                    <tbody>
                        <tr class="info__details__entry">
                            <td>username:</td>
                            <td>{app.state.user.username}</td>
                        </tr>
                        <tr class="info__details__entry">
                            <td>email:</td>
                            <td>{app.state.user.email}</td>
                        </tr>
                        <tr class="info__details__entry">
                            <td>password:</td>
                            <td class="info__details__password">
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
                auth.logout();
                showToast("logged out", "info");
            }}
        >
            logout
        </Button>
    </div>
{/if}

<style>
.info {
    margin: 1rem;
}

.info__role {
    margin: 0;
}

.info__details__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.info__details__table {
    width: 100%;
    border: 0;
    border-collapse: collapse;
}

.info__details__title {
    margin: 0;
}

.info__details__entry {
    display: flex;
    justify-content: space-between;
}

.info__details__password {
    display: flex;
    align-items: center;
}

td {
    padding: 0;
}

.logout {
    margin-inline: 1rem;
}
</style>
