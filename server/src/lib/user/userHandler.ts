import { handleAsync, sendResponse, httpStatus, AppError } from 'utils';
import { UserService } from './userService';

export function createUserHandler(userService: typeof UserService) {
    return {
        getAll: handleAsync(async (_req, res) => {
            const users = await userService.getAllUser();

            sendResponse(res, httpStatus.SUCCESSFUL, { users });
        }),

        get: handleAsync(async (req, res) => {
            if (!req.params.userId) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid user id');
            }

            const user = await userService.getUser(req.params.userId);

            sendResponse(res, httpStatus.SUCCESSFUL, { user });
        }),

        update: handleAsync(async (req, res) => {
            if (!req.params.userId) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid user id');
            }

            const user = await userService.updateUser(
                req.params.userId,
                req.body,
            );

            sendResponse(res, httpStatus.SUCCESSFUL, { user });
        }),

        delete: handleAsync(async (req, res) => {
            if (!req.params.userId) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid user id');
            }

            await userService.deleteUser(req.params.userId);

            sendResponse(res, httpStatus.SUCCESSFUL, {});
        }),
    };
}
