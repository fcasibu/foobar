import jwt from 'jsonwebtoken';

export const sign = (id: string) =>
    jwt.sign({ id }, process.env.PASSPORT_JWT_SECRET, {
        expiresIn: '30d',
    });

export const verify = (token: string) =>
    jwt.verify(token, process.env.PASSPORT_JWT_SECRET);
