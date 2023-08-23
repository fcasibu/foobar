import { api } from '@lib';
import { User } from '../types';

export async function getUsers() {
    try {
        const { data } = await api.get<{ users: User[] }>('/users');
        return data.users;
    } catch (e) {
        console.error(e);
    }
}
