import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Login = lazy(() => import('@pages/login/Login'));
// const Register = lazy(() => import('@pages/register/register'));

export function AuthRoutes() {
    return (
        <Suspense fallback={<h1>Loading..</h1>}>
            <Outlet />
        </Suspense>
    );
}

export const authRoutes = [
    {
        path: '/',
        element: <AuthRoutes />,
        children: [
            { index: true, element: <Login /> },
            { path: '*', element: <Navigate replace to="/" /> },
        ],
    },
];
