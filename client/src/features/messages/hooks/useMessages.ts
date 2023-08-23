import { useEffect, useState } from 'react';
import { Message, Messages, getMessages } from '..';
import { socket, storage } from '@lib';

export function useMessages(roomId?: string) {
    const [messages, setMessages] = useState<{ [k: string]: Messages }>(() => {
        const item = storage.get('messages');
        return item ?? { [roomId!]: [] };
    });

    useEffect(() => {
        // async function init() {
        //     if (!roomId) return;
        //
        //     try {
        //         const initialMessages = await getMessages(roomId);
        //         setMessages(initialMessages);
        //     } catch (e) {
        //         console.error(e);
        //     }
        // }
        //
        // init();
    }, [roomId]);

    useEffect(() => {
        storage.set('messages', messages);
    }, [messages]);

    useEffect(() => {
        if (!roomId) return;

        socket.on('chat:message', (message: Message) => {
            const msgsCopy = { ...messages };
            msgsCopy[roomId] = msgsCopy[roomId]?.concat(message) ?? [message];
            setMessages(msgsCopy);
        });

        return () => {
            socket.off('chat:message');
        };
    }, [roomId, messages]);

    if (!roomId) return null;

    return messages[roomId];
}
