type ToastVariant = "info" | "success" | "warn" | "error";
interface Toast {
    visible: boolean;
    message: string;
    variant: ToastVariant;
}

export let toast: Toast = $state({
    visible: false,
    message: "",
    variant: "info",
});

let t: number;

export function showToast(
    message: string,
    variant: ToastVariant,
    duration: number = 4000,
) {
    if (toast.visible) {
        clearTimeout(t);
        toast.visible = false;
        toast.message = "";
    }
    setTimeout(() => {
        toast.variant = variant;
        toast.message = message;
        toast.visible = true;
    }, 100);
    t = setTimeout(() => {
        toast.visible = false;
        toast.message = "";
    }, duration);
}

