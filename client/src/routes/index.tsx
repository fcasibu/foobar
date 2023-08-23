import { useAuth } from '@features/auth';
import { useRoutes } from 'react-router-dom';
import { authRoutes } from './auth';
import { appRoutes } from './protected';

export function AppRoutes() {
    const { isLoggedIn, isLoading } = useAuth();

    const routes = isLoggedIn ? appRoutes : authRoutes;
    const loading = [{ path: '/', element: <h1>Loading...</h1> }];
    const element = useRoutes(isLoading ? loading : routes);

    return element;
}
