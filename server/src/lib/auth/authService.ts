import type { UserService } from 'lib/user';
import { AppError, httpStatus, sign } from 'utils';

type Credentials = { username: string; password: string };

export class AuthService {
    public static async login(
        { username, password }: Credentials,
        userService: typeof UserService,
    ) {
        const user = await userService.getUser({ username }, true);

        if (!(await user.validatePassword(password))) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'Entered username or password is invalid.',
            );
        }

        const token = sign(user.id);
        user.password = undefined!;

        return { token, user };
    }

    public static async register(
        { username, password }: Credentials,
        userService: typeof UserService,
    ) {
        if (await userService.hasUser({ username })) {
            throw new AppError(
                httpStatus.CONFLICT,
                `User with the username ${username} already exists.`,
            );
        }

        const user = await userService.createUser(username, password);

        const token = sign(user.id);

        return { token, user };
    }
}
