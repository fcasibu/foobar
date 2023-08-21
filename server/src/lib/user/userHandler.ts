import { handleAsync, sendResponse, httpStatus, AppError } from 'utils';
import { UserService } from './userService';

export function createUserHandler(userService: typeof UserService) {
    return handleAsync({
        getAll: async (_req, res) => {
            const users = await userService.getAllUser();

            return sendResponse(res, httpStatus.SUCCESSFUL, { users });
        },

        get: async (req, res) => {
            if (!req.params.userId) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid user id');
            }

            const user = await userService.getUser(req.params.userId);

            return sendResponse(res, httpStatus.SUCCESSFUL, { user });
        },

        update: async (req, res) => {
            if (!req.params.userId) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid user id');
            }

            const user = await userService.updateUser(
                req.params.userId,
                req.body,
            );

            return sendResponse(res, httpStatus.SUCCESSFUL, { user });
        },

        delete: async (req, res) => {
            if (!req.params.userId) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid user id');
            }

            await userService.deleteUser(req.params.userId);

            return sendResponse(res, httpStatus.NO_CONTENT, {});
        },
    });
}
