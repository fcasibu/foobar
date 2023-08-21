import type { Response } from 'express';

export const sendResponse = (
    res: Response,
    statusCode: number,
    data: Record<string, unknown>,
) =>
    res.status(statusCode).json({
        status: statusCode.toString().startsWith('4') ? 'fail' : 'success',
        ...data,
    });
