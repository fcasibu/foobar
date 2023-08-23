import { ReactNode, useMemo, createContext } from 'react';
import { getMe } from '..';
import { useQuery } from 'react-query';
import { User } from '@features/users';

type AuthContextProps = {
    user?: User;
    isLoggedIn: boolean;
    isLoading: boolean;
};

export const AuthContext = createContext<AuthContextProps | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const {
        data: user,
        isLoading,
        isSuccess,
    } = useQuery('user', getMe, { retry: 0 });

    const isLoggedIn = isSuccess && !!user;

    const value = useMemo(
        () => ({ user, isLoggedIn, isLoading }),
        [user, isLoggedIn, isLoading],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
