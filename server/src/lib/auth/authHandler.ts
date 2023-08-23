import { handleAsync, httpStatus, sendResponse } from 'utils';
import { UserService } from 'lib/user';
import type { AuthService } from './authService';

export function createAuthHandler(
    userService: typeof UserService,
    authService: typeof AuthService,
) {
    return handleAsync({
        loginWithUsernameAndPassword: async (req, res) => {
            const { token, user } = await authService.login(
                req.body,
                userService,
            );

            return sendResponse(res, httpStatus.SUCCESSFUL, { token, user });
        },

        registerWithUsernameAndPassword: async (req, res) => {
            const { token, user } = await authService.register(
                req.body,
                userService,
            );

            return sendResponse(res, httpStatus.CREATED, { user, token });
        },
    });
}
