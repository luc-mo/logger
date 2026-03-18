import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['cjs', 'esm'],
	tsconfig: './tsconfig.json',
	minify: true,
	clean: true,
	treeshake: true,
	dts: true,
	external: [
		'@google-cloud/secret-manager',
		'google-auth-library',
		'express',
		'cors',
		'firebase-admin',
	],
})
