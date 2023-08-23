import type { NextFunction, Request, Response } from 'express';
import { httpStatus, AppError } from '../utils';

export const isAuthenticated = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    if (!req.user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    next();
};

export default isAuthenticated;
