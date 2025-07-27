<span class="loader"></span>

<style>
.loader {
    position: absolute;
    inset: 0;
    background-color: rgba(0 0 0 / 0.1);
    z-index: 10;

}

.loader::after {
    position: absolute;
    inset: 0;
    margin: auto;
    content: "";
    width: 4rem;
    height: 4rem;
    border: 8px solid var(--color-text);
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-radius: 50%;
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
