import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { readFileSync } from 'node:fs';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		plugins: [sveltekit()],
		server: {
			hmr: {
				host: env.VITE_HOST
			},
			https: {
				key: readFileSync(`${env.VITE_CERT_PATH}/${env.VITE_HOST}.key`),
				cert: readFileSync(`${env.VITE_CERT_PATH}/${env.VITE_HOST}.crt`),
			}
		}
	}
});
