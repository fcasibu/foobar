import { NextFunction, Request, Response } from 'express';

type Callback = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<unknown>;

export const handleAsync =
    (callback: Callback): Callback =>
    (req, res, next) =>
        callback(req, res, next).catch(next);
