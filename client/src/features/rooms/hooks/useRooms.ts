import { getRooms } from '..';
import { useQuery } from 'react-query';

export function useRooms() {
    const { data: rooms, isLoading } = useQuery({
        queryKey: ['rooms'],
        queryFn: async () => getRooms(),
        retry: 3,
    });

    return { rooms, isLoading };
}
