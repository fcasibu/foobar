import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { GlobalStyle } from './reset.ts';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <BrowserRouter>
        <GlobalStyle />
        <App />
    </BrowserRouter>,
);
