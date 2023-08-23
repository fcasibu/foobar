import { useMutation } from 'react-query';
import { joinRoom } from '../api/joinRoom';
import { useAuth } from '@features';
import { client } from '@lib';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export function useJoinRoom() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: async (roomId: string) => {
            try {
                const room = await joinRoom(roomId, user!._id);
                return room;
            } catch (e) {
                if (typeof e === 'string' && e.includes('member')) {
                    navigate(`/rooms/${roomId}`, { replace: true });
                }
            }
        },
        onSuccess: (room) => {
            if (!room) return;

            client.setQueryData(['room', room], (old) => {
                if (Array.isArray(old)) {
                    return [...old, room];
                }
                return room;
            });
            navigate(`/rooms/${room._id}`);
        },
    });

    const join = useCallback((roomId: string) => {
        mutate(roomId);
    }, []);

    return join;
}
