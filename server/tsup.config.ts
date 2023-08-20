import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    splitting: false,
    sourcemap: 'inline',
    clean: true,
    watch: ['src'],
    ignoreWatch: ['src/**/*.d.ts'],
    minify: true,
});
