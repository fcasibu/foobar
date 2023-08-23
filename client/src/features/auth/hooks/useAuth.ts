import { useContext } from 'react';
import { AuthContext } from '../context';

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must only be used inside an AuthProvider');
    }

    return context;
}
