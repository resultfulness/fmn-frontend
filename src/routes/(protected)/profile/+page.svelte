<script>
import Button from "$lib/components/button.svelte";
import app from "$lib/app.svelte";
import auth from "$lib/auth.svelte";
import { goto } from "$app/navigation";
</script>

<div class="profile-page">
    <h1>
        {app.user?.username}
    </h1>
    <section class="card card--info">
        <h2 class="card__title">info</h2>
        <div class="card--info__grid">
            <span>email:</span>
            <span>{app.user?.email}</span>
            <span>role:</span>
            <span>{app.user?.role}</span>
        </div>
    </section>
    <Button onclick={() => {
        auth.clear();
        goto("/login");
    }}>
        logout
    </Button>
</div>

<style>
h1 {
    text-align: center;
}


.card {
    background-color: var(--color-surface0);
    padding: 1rem;
    border-radius: 1rem;
    margin-bottom: 1rem;
}

.card__title {
    margin: 0;
    margin-bottom: 1rem;
}

.card--info__grid {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 1fr 1fr;
    gap: 0.25rem;
}
</style>
