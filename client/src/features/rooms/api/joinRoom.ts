import { api } from '@lib';
import { Room } from '../types';

export async function joinRoom(roomId: string, userId: string) {
    try {
        const { data } = await api.patch<{ room: Room }>(
            `/rooms/${roomId}/join`,
            {
                userId,
            },
        );
        return data.room;
    } catch (e) {
        console.error(e);
        return Promise.reject(e);
    }
}
