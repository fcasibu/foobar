import { api } from '@lib';
import { Messages } from '../types';

export async function getMessages(roomId: string, pageNumber = 1) {
    try {
        const { data } = await api.get<{ messages: Messages }>(
            `/rooms/${roomId}/messages?page=${pageNumber}`,
        );
        return data.messages;
    } catch (e) {
        console.error(e);
        return Promise.reject(e);
    }
}
