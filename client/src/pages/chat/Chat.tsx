import {
    ChangeEvent,
    FormEvent,
    KeyboardEvent,
    useEffect,
    useRef,
} from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
    Messages,
    RoomSearch,
    Rooms,
    Textarea,
    TextareaHandle,
    Users,
} from '@components';
import { useAuth, useRoom } from '@features';
import { sendMessage, useMessages } from '@features/messages';
import { socket, storage } from '@lib';

const S = {
    Container: styled.div`
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        gap: 24px;
        height: 100vh;
        margin: 0 auto;
        max-width: 1440px;
        padding: 24px;
    `,

    Chat: styled.div`
        margin-top: auto;
        position: relative;
        width: 100%;
        height: 90vh;

        > form {
            width: 100%;
            display: flex;
            position: absolute;
            bottom: 0;
        }

        textarea {
            width: 100%;
            resize: none;
            height: 60px;
            max-height: 300px;
            padding: 16px;
            scroll-padding-block: 16px;
        }
    `,

    RoomSection: styled.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
    `,
};

export function Chat() {
    const { roomId } = useParams();
    const { user } = useAuth();
    const { room, isRoomLoading } = useRoom(roomId);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        if (!roomId) return;
        const formElement = event.target as HTMLFormElement;

        event.preventDefault();

        const formData = new FormData(formElement);
        if (!formData.get('content')?.length) return;

        try {
            // const message = await sendMessage({
            //     roomId,
            //     userId: user!.id,
            //     data: Object.fromEntries(formData),
            // });
            socket.emit('chat:send_message', {
                roomId,
                message: {
                    author: user,
                    content: formData.get('content'),
                },
            });
        } catch (e) {
            console.error(e);
        } finally {
            formElement.reset();
        }
    };

    const formRef = useRef<HTMLFormElement>(null);
    const textareaRef = useRef<TextareaHandle>(null);
    const messagesRef = useRef<HTMLDivElement>(null);

    const handleChange = () => {
        if (textareaRef.current) {
            const height = textareaRef.current.expand();
            if (messagesRef.current) messagesRef.current.style.bottom = height;
        }
    };

    const handleKeydown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        const textareaHandle = textareaRef.current;
        const messagesContainer = messagesRef.current;
        if (
            !textareaHandle ||
            !messagesContainer ||
            !(event.key === 'Enter' || event.key === 'Backspace')
        )
            return;

        switch (event.key) {
            case 'Enter':
                {
                    const isShiftKeyHeldDown = event.shiftKey;
                    if (isShiftKeyHeldDown) return;

                    event.preventDefault();
                    formRef.current?.dispatchEvent(
                        new Event('submit', {
                            bubbles: true,
                            cancelable: false,
                        }),
                    );
                    const height = textareaHandle.reset();
                    messagesContainer.style.bottom = height;
                }
                break;
            case 'Backspace':
                {
                    const isTextSelected = !!window.getSelection();
                    let height: string;

                    if (isTextSelected) {
                        height = textareaHandle.reset();
                    } else {
                        height = textareaHandle.shrink();
                    }
                    messagesContainer.style.bottom = height;
                }
                break;
        }
    };

    if (!room && !isRoomLoading) return <Navigate replace to="/" />;
    if (!roomId || !room) return <p>Loading...</p>;

    return (
        <S.Container>
            {roomId && (
                <>
                    <S.RoomSection>
                        <Rooms />
                        <RoomSearch />
                    </S.RoomSection>
                    <S.Chat>
                        <Messages roomId={roomId} ref={messagesRef} />
                        <form onSubmit={handleSubmit} ref={formRef}>
                            <Textarea
                                aria-label="Message"
                                autoComplete="off"
                                onChange={handleChange}
                                onKeyDown={handleKeydown}
                                name="content"
                                placeholder="Message"
                                ref={textareaRef}
                            />
                        </form>
                    </S.Chat>
                    <Users users={room?.members} />
                </>
            )}
        </S.Container>
    );
}

export default Chat;
