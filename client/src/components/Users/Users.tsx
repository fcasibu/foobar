import { User } from '@features/users';
import styled from 'styled-components';

const S = {
    Users: styled.ul``,

    User: styled.li``,
};

type UsersProps = {
    users?: User[];
};

export function Users({ users }: UsersProps) {
    if (!users?.length) return null;

    return (
        <S.Users>
            {users.map((user, index) => (
                <S.User key={`${user}-${index}`}>{user.displayName}</S.User>
            ))}
        </S.Users>
    );
}

export default Users;
