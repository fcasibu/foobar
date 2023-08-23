import { getUsers } from '..';
import { useQuery } from 'react-query';

export function useUsers() {
    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
        retry: 3,
    });

    return users;
}
