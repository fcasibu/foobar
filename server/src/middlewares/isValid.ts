import { sendResponse } from '../utils';
import type { NextFunction, Request, Response } from 'express';
import { ZodError, type AnyZodObject } from 'zod';

export const isValid =
    (dataSchema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await dataSchema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                sendResponse(res, 400, { error: error.issues?.[0] });
                return;
            }

            next(error);
        }
    };
