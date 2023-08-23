import { z } from 'zod';
import { isValidObjectId } from 'mongoose';
import { Router } from 'express';
import { isAuthenticated, isValid } from 'middlewares';
import { UserService } from 'lib/user';
import { createRoomHandler } from './roomHandler';
import { RoomService } from './roomService';
import { roomSchema } from './roomModel';

const handler = createRoomHandler(RoomService, UserService);
export const roomRouter = Router();

roomRouter
    .route('/')
    .get(handler.getAll)
    .post(isValid(roomSchema), handler.post);

roomRouter.use(isAuthenticated);

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
