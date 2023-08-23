import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const reactPlugin =
    process.env.NODE_ENV === 'development'
        ? react({
              babel: {
                  plugins: [
                      [
                          'babel-plugin-styled-components',
                          { displayName: true, fileName: true },
                      ],
                  ],
              },
          })
        : react();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactPlugin, tsconfigPaths()],
});
