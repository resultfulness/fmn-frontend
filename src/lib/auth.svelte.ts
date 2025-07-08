const auth = {
    get token(): string | null {
        const cookies = document.cookie.split(";")
        for (const cookie of cookies) {
            const c = cookie.trim();
            if (c.startsWith("token=")) {
                return c.split("=")[1];
            }
        }
        return null;
    },
    clear() {
        if (this.token) {
            document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    }
}

export default auth;
