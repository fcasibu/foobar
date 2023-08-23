import { useEffect } from 'react';
import { getRoom } from '..';
import { socket, storage } from '@lib';
import { useQuery } from 'react-query';

export function useRoom(roomId?: string) {
    const { data: room, isLoading } = useQuery({
        queryKey: ['room', roomId],
        queryFn: async () => {
            if (!roomId) return;
            return getRoom(roomId);
        },
        retry: 3,
        enabled: !!roomId,
    });

    useEffect(() => {
        if (!!roomId && !!room && !isLoading)
            storage.set('lastRoomJoined', roomId);
    }, [room, isLoading]);

    useEffect(() => {
        socket.emit('room:join', roomId);

        return () => {
            socket.emit('room:leave', roomId);
            socket.removeListener('room:leave');
            socket.removeListener('room:join');
        };
    }, [roomId]);

    return { room, isRoomLoading: isLoading };
}
