import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Chat = lazy(() => import('@pages/chat/Chat'));
const Home = lazy(() => import('@pages/home/Home'));

function App() {
    return (
        <Suspense fallback={<h1>Loading..</h1>}>
            <Outlet />
        </Suspense>
    );
}

export const appRoutes = [
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'rooms/:roomId', element: <Chat /> },
            { path: '*', element: <Navigate replace to="/" /> },
        ],
    },
];
