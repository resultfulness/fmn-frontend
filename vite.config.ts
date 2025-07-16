import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		https: {
			key: readFileSync('cert/localhost.key'),
			cert: readFileSync('cert/localhost.crt'),
		}
	}

});
