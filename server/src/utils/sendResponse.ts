import type { Response } from 'express';

export const sendResponse = <T = Record<string, unknown>>(
    res: Response,
    statusCode: number,
    data: T,
) =>
    res.status(statusCode).json({
        status: statusCode.toString().startsWith('4') ? 'fail' : 'success',
        ...data,
    });
