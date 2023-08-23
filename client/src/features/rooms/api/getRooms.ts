import { api } from '@lib';
import { Rooms } from '../types';

export async function getRooms(pageNumber = 1) {
    try {
        const { data } = await api.get<{ rooms: Rooms }>(
            `/rooms?page=${pageNumber}`,
        );
        return data.rooms;
    } catch (e) {
        console.error(e);
        return Promise.reject(e);
    }
}
