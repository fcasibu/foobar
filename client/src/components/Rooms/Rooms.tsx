import { useRooms } from '@features';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const S = {
    Rooms: styled.ul`
        max-height: 90vh;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            display: none;
        }
    `,

    Room: styled.li``,
};

export function Rooms() {
    const { rooms, isLoading } = useRooms();
    const navigate = useNavigate();
    const { roomId } = useParams();

    if (isLoading) return <p>Loading...</p>;

    const handleClick = (roomId: string) => () => {
        navigate(`/rooms/${roomId}`, { replace: true });
    };

    return (
        <S.Rooms>
            {rooms?.map((room, index) => (
                <S.Room key={`${room.name}-${index}`}>
                    <button
                        type="button"
                        onClick={handleClick(room._id)}
                        disabled={room._id === roomId}
                    >
                        # {room.name}
                    </button>
                </S.Room>
            ))}
        </S.Rooms>
    );
}

export default Rooms;
