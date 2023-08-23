import { RoomSearch, Rooms } from '@components';
import { storage } from '@lib';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

const S = {
    Container: styled.div`
        display: grid;
        gap: 24px;
        grid-template-columns: 1fr 4fr;
        height: 100vh;
        margin: 0 auto;
        max-width: 1440px;
        padding: 24px;
    `,
};

export function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const lastRoomJoined = storage.get('lastRoomJoined');
        if (lastRoomJoined) navigate(`/rooms/${lastRoomJoined}`);
    }, []);

    return (
        <S.Container>
            <div>
                <Rooms />
                <RoomSearch />
            </div>

            <div>Hello, World!</div>
        </S.Container>
    );
}

export default Home;
