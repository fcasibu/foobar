import { api } from '@lib';
import { UserResponse } from '../types';

export async function getMe() {
    try {
        const { data } = await api.get<UserResponse>('/auth/me');

        return data.user;
    } catch (e) {
        console.error(e);
    }
}
