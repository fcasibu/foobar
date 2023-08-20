import { defineConfig } from 'tsup';

const isDevelopment = process.env.NODE_ENV === 'development';

export default defineConfig({
    entry: ['src/index.ts'],
    splitting: true,
    clean: true,
    ...(isDevelopment
        ? {
              watch: ['src', '**/.env'],
              ignoreWatch: ['src/**/*.d.ts'],
              sourcemap: 'inline',
          }
        : { bundle: true }),
    minify: true,
});
