import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    splitting: false,
    sourcemap: false,
    clean: true,
    watch: ['.env', 'src'],
    ignoreWatch: ['src/**/*.d.ts'],
    minify: true,
});
