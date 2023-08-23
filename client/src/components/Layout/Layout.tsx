import { ReactNode } from 'react';
import { styled } from 'styled-components';

const S = {
    Container: styled.main`
        margin: 0 auto;
        max-width: 1440px;
    `,
};

export function Layout({ children }: { children: ReactNode }) {
    return <S.Container>{children}</S.Container>;
}

export default Layout;
