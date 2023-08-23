import { Types, isValidObjectId } from 'mongoose';
import { AppError, handleAsync, httpStatus, sendResponse } from 'utils';
import type { UserService } from 'lib/user';
import type { RoomService } from './roomService';

export function createRoomHandler(
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

            const roomId = new Types.ObjectId(req.params.roomId);
            const pageNumber = Number(req.query.page ?? 1);
            const room = await roomService.getRoom(roomId, pageNumber);

            return sendResponse(res, httpStatus.SUCCESSFUL, { room });
        },

        post: async (req, res) => {
            const { name, owner } = req.body;
            const ownerId = new Types.ObjectId(owner);
            const room = await roomService.createRoom(name, ownerId);

            return sendResponse(res, httpStatus.CREATED, { room });
        },

        update: async (req, res) => {
            if (!req.params.roomId || !isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Invalid room id');
            }

            const roomId = new Types.ObjectId(req.params.roomId);
            const room = await roomService.updateRoom(roomId, req.body);

            return sendResponse(res, httpStatus.SUCCESSFUL, { room });
        },

        delete: async (req, res) => {
            if (!req.params.roomId || !isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Invalid room id');
            }

            const roomId = new Types.ObjectId(req.params.roomId);
            await roomService.deleteRoom(roomId);

            return sendResponse(res, httpStatus.NO_CONTENT);
        },

        join: async (req, res) => {
            if (!req.params.roomId || !isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Invalid room id');
            }

            const roomId = new Types.ObjectId(req.params.roomId);
            const userId = new Types.ObjectId(req.body.userId);
            const room = await roomService.joinRoom(
                { roomId, userId },
                userService,
            );

            return sendResponse(res, httpStatus.SUCCESSFUL, { room });
        },
    });
}
