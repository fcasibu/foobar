import { AppError, handleAsync, httpStatus, sendResponse } from 'utils';

export function createAuthHandler() {
    return handleAsync({
        getMe: async (req, res) => {
            if (!req.user) {
                throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
            }

            return sendResponse(res, httpStatus.SUCCESSFUL, { user: req.user });
        },
    });
}
