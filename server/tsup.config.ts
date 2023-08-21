import { defineConfig } from 'tsup';

const isDevelopment = process.env.NODE_ENV === 'development';

export default defineConfig({
    entry: ['src/index.ts'],
    clean: true,
    ...(isDevelopment
        ? {
              watch: ['src', '**/.env'],
              ignoreWatch: ['src/**/*.d.ts'],
              sourcemap: true,
          }
        : {
              bundle: false,
              minify: true,
              splitting: true,
          }),
});
