import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';
import { getRooms } from '..';

export function useRoomsInfiniteScroll() {
    const { ref, inView } = useInView({ threshold: 0.5, rootMargin: '0px' });
    const currentPage = useRef(1);

    const { data, isLoading, isFetchingNextPage, fetchNextPage } =
        useInfiniteQuery({
            queryKey: ['scrollable_rooms'],
            queryFn: async ({ pageParam }) => {
                return getRooms(pageParam);
            },
            retry: 3,
        });

    useEffect(() => {
        if (inView) {
            fetchNextPage({ pageParam: ++currentPage.current });
        }
    }, [inView]);

    return { ref, pages: data?.pages, isLoading, isFetchingNextPage };
}
