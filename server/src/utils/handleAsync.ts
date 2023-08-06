import { NextFunction, Request, Response } from 'express';

export const handleAsync =
    (
        callback: (
            req: Request,
            res: Response,
            next: NextFunction,
        ) => Promise<unknown>,
    ) =>
    (req: Request, res: Response, next: NextFunction) =>
        callback(req, res, next).catch(next);
