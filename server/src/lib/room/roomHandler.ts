import { Types, isValidObjectId } from 'mongoose';
import { AppError, handleAsync, httpStatus, sendResponse } from 'utils';
import type { UserService } from 'lib/user';
import type { RoomService } from './roomService';

export function createHandler(
    roomService: typeof RoomService,
    userService: typeof UserService,
) {
    return handleAsync({
        getAll: async (_req, res) => {
            const rooms = await roomService.getAllRoom();
            return sendResponse(res, httpStatus.SUCCESSFUL, { rooms });
        },

        get: async (req, res) => {
            if (!req.params.roomId || !isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid room id');
            }

            const room = await roomService.getRoom(
                new Types.ObjectId(req.params.roomId),
                Number(req.query.page ?? 1),
            );
            return sendResponse(res, httpStatus.SUCCESSFUL, { room });
        },

        post: async (req, res) => {
            const { name, owner } = req.body;
            const room = await roomService.createRoom(
                name,
                new Types.ObjectId(owner),
            );

            return sendResponse(res, httpStatus.CREATED, { room });
        },

        update: async (req, res) => {
            if (!req.params.roomId || !isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Invalid room id');
            }

            const room = await roomService.updateRoom(
                new Types.ObjectId(req.params.roomId),
                req.body,
            );

            return sendResponse(res, httpStatus.SUCCESSFUL, { room });
        },

        delete: async (req, res) => {
            if (!req.params.roomId || !isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Invalid room id');
            }

            await roomService.deleteRoom(new Types.ObjectId(req.params.roomId));

            return sendResponse(res, httpStatus.NO_CONTENT);
        },

        join: async (req, res) => {
            if (!req.params.roomId || !isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Invalid room id');
            }

            const room = await roomService.joinRoom(
                {
                    roomId: new Types.ObjectId(req.params.roomId),
                    userId: new Types.ObjectId(req.body.userId),
                },
                userService,
            );

            return sendResponse(res, httpStatus.SUCCESSFUL, { room });
        },
    });
}
