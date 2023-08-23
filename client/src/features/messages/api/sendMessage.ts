import { api } from '@lib';
import { Message, MessageContent } from '../types';

type SendMessageProps = {
    roomId: string;
    userId: string;
    data: MessageContent;
};

export async function sendMessage({
    roomId,
    userId,
    data: dataToSend,
}: SendMessageProps) {
    try {
        const { data } = await api.post<Message>(
            `/rooms/${roomId}/users/${userId}`,
            dataToSend,
        );
        return data;
    } catch (e) {
        console.error(e);
        return Promise.reject(e);
    }
}
