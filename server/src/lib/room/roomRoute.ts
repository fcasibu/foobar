import { z } from 'zod';
import { isValidObjectId } from 'mongoose';
import { Router } from 'express';
import { isValid } from 'middlewares';
import { UserService } from 'lib/user';
import { createHandler } from './roomHandler';
import { RoomService } from './roomService';
import { roomSchema } from './roomModel';

const handler = createHandler(RoomService, UserService);
export const roomRouter = Router();

roomRouter
    .route('/')
    .get(handler.getAll)
    .post(isValid(roomSchema), handler.post);

roomRouter
    .route('/:roomId')
    .get(handler.get)
    .delete(handler.delete)
    .patch(isValid(roomSchema.partial()), handler.update);

roomRouter.route('/:roomId/join').patch(
    isValid(
        z
            .object({
                userId: z.custom((val) => isValidObjectId(val), {
                    message: 'Not a valid object id.',
                }),
            })
            .strict(),
    ),
    handler.join,
);
