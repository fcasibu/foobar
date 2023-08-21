import type { Response } from 'express';

export const sendResponse = <T extends Record<string, unknown>>(
    res: Response,
    statusCode: number,
    data?: T[keyof T] extends PromiseLike<unknown> ? never : T,
) =>
    res.status(statusCode).json({
        status: statusCode.toString().startsWith('4') ? 'fail' : 'success',
        ...data,
    });
