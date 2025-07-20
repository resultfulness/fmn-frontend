<script lang="ts">
import Button from "$lib/components/button.svelte";
import Input from "$lib/components/input.svelte";
import api, { ApiError } from "$lib/api";
import app from "$lib/app.svelte";
import { goto } from "$app/navigation";
import Separator from "$lib/components/separator.svelte";

let form = $state({
    email: "",
    password: "",
    error: {
        email: "",
        password: "",
    },
});

async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    form.error = { email: "", password: "" };

    if (!form.email) {
        form.error.email = "email required";
        return;
    }

    if (!form.password) {
        form.error.password = "password required";
        return;
    }

    try {
        const data = await api.users.login(form.email, form.password);
        if (data) {
            app.user = data;
            goto("/");
        }
    } catch (e) {
        const ae = e as ApiError;
        switch (ae.status) {
            case 401:
                form.error.password = ae.message;
                break;
        }
    }
}
</script>

<svelte:head>login | forget me not</svelte:head>

<main>
    <form onsubmit={handleSubmit} class="form form--auth">
        <h1 class="form__title">login</h1>
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
        <div class="form__submit">
            <Button fillwidth>login</Button>
        </div>
        <Separator text="or" spacing="0.5rem" />
        <Button style="secondary" type="link" href="/register">
            register here
        </Button>
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
