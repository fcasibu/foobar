import { User } from '@features/users';

export type Message = {
    author: User;
    room: string;
    content?: string;
    attachment?: string;
};

export type MessageContent = Omit<Message, 'author' | 'room'>;

export type Messages = Message[];
