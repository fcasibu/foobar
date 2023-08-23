import { handleAsync, sendResponse, httpStatus, AppError } from 'utils';
import { Types, isValidObjectId } from 'mongoose';
import { UserService } from './userService';

export function createUserHandler(userService: typeof UserService) {
    return handleAsync({
        getAll: async (req, res) => {
            const pageNumber = Number(req.query.page);
            const users = await userService.getAllUser(pageNumber);

            return sendResponse(res, httpStatus.SUCCESSFUL, { users });
        },

        get: async (req, res) => {
            if (!req.params.userId || !isValidObjectId(req.params.userId)) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user id');
            }

            const userId = new Types.ObjectId(req.params.userId);
            const user = await userService.getUser({ _id: userId });

            return sendResponse(res, httpStatus.SUCCESSFUL, { user });
        },

        update: async (req, res) => {
            if (!req.params.userId || !isValidObjectId(req.params.userId)) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user id');
            }

            const userId = new Types.ObjectId(req.params.userId);
            const user = await userService.updateUser(
                { _id: userId },
                req.body,
            );

            return sendResponse(res, httpStatus.SUCCESSFUL, { user });
        },

        delete: async (req, res) => {
            if (!req.params.userId || !isValidObjectId(req.params.userId)) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user id');
            }

            const userId = new Types.ObjectId(req.params.userId);
            await userService.deleteUser({ _id: userId });

            return sendResponse(res, httpStatus.NO_CONTENT);
        },
    });
}
