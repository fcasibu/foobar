import type { NextFunction, Request, Response } from 'express';

type Handler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<Response>;

type Handlers<T> = {
    [P in keyof T]: T[P];
};

export const handleAsync = <T extends Record<string, Handler>>(
    handlers: Handlers<T>,
): Handlers<T> => {
    const entries = Object.entries(handlers).map(([key, callback]) => [
        key,
        (req: Request, res: Response, next: NextFunction) =>
            callback(req, res, next).catch(next),
    ]);

    return Object.fromEntries(entries);
};
