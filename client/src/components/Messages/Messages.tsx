import { useAuth, useMessages } from '@features';
import { forwardRef, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useInView } from 'react-intersection-observer';

const S = {
    Container: styled.div`
        bottom: 60px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: absolute;
        width: 100%;
    `,
    Messages: styled.ul`
        overflow-y: scroll;

        li:last-child {
            margin-bottom: 8px;
        }
    `,

    Message: styled.li`
        white-space: pre-wrap;
        display: flex;
        gap: 8px;

        > strong {
            font-weight: 700;
        }

        p {
            overflow-wrap: anywhere;
        }
    `,
};

type MessagesProps = {
    roomId: string;
};

export const Messages = forwardRef<HTMLDivElement, MessagesProps>(
    ({ roomId }, ref) => {
        const messages = useMessages(roomId);
        const { user } = useAuth();
        const scrollRef = useRef<HTMLLIElement | null>(null);
        const { ref: viewScrollRef, inView } = useInView();

        useEffect(() => {
            if (user?._id !== messages?.at(-1)?.author._id && !inView) return;

            scrollRef.current?.scrollIntoView();
        }, [messages, inView, user]);

        return (
            <S.Container ref={ref}>
                <S.Messages>
                    {messages?.map((message, index) => (
                        <S.Message key={`${message}-${index}`}>
                            <strong>[{message.author.displayName}]</strong>
                            <div>
                                <ReactMarkdown
                                    children={message.content ?? ''}
                                    remarkPlugins={[remarkGfm]}
                                />
                            </div>
                        </S.Message>
                    ))}
                    <li
                        ref={(ref) => {
                            scrollRef.current = ref;
                            viewScrollRef(ref);
                        }}
                    />
                </S.Messages>
            </S.Container>
        );
    },
);

Messages.displayName = 'Messages';

export default Messages;
