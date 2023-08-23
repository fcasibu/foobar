import { api } from '@lib';
import { Room } from '../types';

export async function getRoom(roomId: string, pageNumber = 1) {
    try {
        const { data } = await api.get<{ room: Room }>(
            `/rooms/${roomId}?page=${pageNumber}`,
        );

        return data.room;
    } catch (e) {
        console.error(e);
    }
}
