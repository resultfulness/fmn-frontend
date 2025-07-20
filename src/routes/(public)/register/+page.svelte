<script lang="ts">
import Button from "$lib/components/button.svelte";
import Input from "$lib/components/input.svelte";
import Separator from "$lib/components/separator.svelte";
import api, { ApiError } from "$lib/api";
import app from "$lib/app.svelte";
import { goto } from "$app/navigation";

let form = $state({
    email: "",
    password: "",
    password2: "",
    error: {
        email: "",
        password: "",
        password2: "",
    },
});

async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    form.error = { email: "", password: "", password2: "" };

    if (!form.email) {
        form.error.email = "email required";
        return;
    }

    if (!form.password) {
        form.error.password = "password required";
        return;
    }

    if (form.password !== form.password2) {
        form.error.password2 = "passwords do not match";
        return;
    }

    try {
        const data = await api.users.register(form.email, form.password);
        if (data) {
            app.user = data;
            goto("/");
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

<svelte:head>register | forget me not</svelte:head>

<main>
    <form onsubmit={handleSubmit} class="form form--auth">
        <h1 class="form__title">register</h1>
        <Input
            id="email"
            type="email"
            label="email:"
            bind:value={form.email}
            error={form.error.email}
        />
        <Input
            id="password"
            type="password"
            label="password:"
            bind:value={form.password}
            error={form.error.password}
        />
        <Input
            id="password2"
            type="password"
            label="confirm password"
            bind:value={form.password2}
            error={form.error.password2}
        />
        <div class="form__submit">
            <Button fillwidth>register</Button>
        </div>
        <Separator text="or" spacing="0.5rem" />
        <Button style="secondary" type="link" href="/login">login here</Button>
    </form>
</main>

<style>
main {
    height: 100vh;
    height: 100dvh;
    display: grid;
    place-items: center;
}
</style>
