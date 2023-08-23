import ReactDOM from 'react-dom/client';
import { GlobalStyle } from './reset.ts';
import { StrictMode } from 'react';
import App from '@App.tsx';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AuthProvider } from '@features/auth/context/AuthProvider.tsx';
import { client } from './lib/queryClient';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GlobalStyle />
        <QueryClientProvider client={client}>
            {import.meta.env.DEV && <ReactQueryDevtools />}
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>,
);
