<script>
import { page } from "$app/state";
</script>

<div class="error-page">
    <main>
        <h1>oh no! an error occurred :(</h1>

        <p>error details:</p>

        <ul>
            <li>status code: {page.status}</li>
            <li>details: {page.error.message}</li>
        </ul>
    </main>
</div>

<style>
.error-page {
    height: 100vh;
    height: 100dvh;
    display: grid;
    place-items: center;
}

main {
    padding: 1rem;
}

ul {
    list-style-type: none;
    padding: 0;
}
</style>
