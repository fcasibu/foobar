import { ReactNode, useState } from 'react';
import { styled } from 'styled-components';
import * as Dialog from '@radix-ui/react-dialog';
import { useJoinRoom, useRoomsInfiniteScroll } from '@features';

const S = {
    Rooms: styled.ul``,
    Overlay: styled(Dialog.Overlay)`
        background: rgba(0 0 0 / 0.5);
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        overflow-y: auto;
    `,
    Title: styled(Dialog.Title)``,
    Content: styled(Dialog.Content)`
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: white;
        width: 400px;
        height: 720px;
        padding: 24px;

        > button {
            position: absolute;
            right: 25px;
        }

        > div {
            height: 100%;
            width: 100%;
            overflow-y: scroll;
            padding-block: 24px;
            &::-webkit-scrollbar {
                display: none;
            }
        }
    `,
    Trigger: styled(Dialog.Trigger)``,
};

function Modal({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return (
        <Dialog.Root open={isOpen}>
            <S.Trigger onClick={open}>Join Room</S.Trigger>
            <Dialog.Portal>
                <S.Overlay />
                <S.Content onPointerDownOutside={close} onEscapeKeyDown={close}>
                    <S.Title>Rooms</S.Title>
                    <button type="button" onClick={close}>
                        Close
                    </button>
                    <div>{children}</div>
                </S.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export function RoomSearch() {
    const { ref, pages, isLoading, isFetchingNextPage } =
        useRoomsInfiniteScroll();
    const join = useJoinRoom();

    return (
        <Modal>
            <S.Rooms>
                {isLoading && <p>Loading...</p>}
                {!isLoading &&
                    pages?.map((page) =>
                        page.map(({ _id, name }) => (
                            <li key={_id}>
                                <button type="button" onClick={() => join(_id)}>
                                    {name}
                                </button>
                            </li>
                        )),
                    )}
            </S.Rooms>
            <div ref={ref} />
            {isFetchingNextPage && <p>Loading...</p>}
        </Modal>
    );
}

export default RoomSearch;
