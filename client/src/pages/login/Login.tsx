import { useAuth } from '@features';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            navigate(0);
        }
    }, [isLoggedIn]);

    return (
        <div>
            <a href={`${import.meta.env.VITE_SERVER_URL}/auth/google`}>
                Click Me for google
            </a>

            <a href={`${import.meta.env.VITE_SERVER_URL}/auth/github`}>
                Click Me for github
            </a>
        </div>
    );
}

export default Login;
