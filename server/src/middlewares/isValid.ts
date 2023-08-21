import type { NextFunction, Request, Response } from 'express';
import { ZodError, type AnyZodObject, ZodEffects } from 'zod';
import { sendResponse, httpStatus } from '../utils';

export const isValid =
    (dataSchema: AnyZodObject | ZodEffects<AnyZodObject>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await dataSchema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                sendResponse(res, httpStatus.BAD_REQUEST, {
                    error: error.issues?.[0],
                });
                return;
            }

            next(error);
        }
    };

export default isValid;
