export default function unfocusOnMobileKeyboardHidden(id: string) {
    let initialHeight = window.innerHeight;
    window.addEventListener('resize', () => {
        if (document.activeElement?.id !== id) {
            return;
        }
        if (!window.visualViewport) {
            return;
        }

        const height = window.visualViewport.height;

        const diff = initialHeight - height;
        const threshold = 100;

        if (diff < threshold) {
            document.activeElement.blur();
        }
    });
}
