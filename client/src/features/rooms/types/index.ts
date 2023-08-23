import { User } from '@features/users';

export type Room = {
    _id: string;
    owner: string;
    name: string;
    members: User[];
};

export type Rooms = Room[];
