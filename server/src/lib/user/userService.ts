import { AppError, httpStatus, paginate } from 'utils';
import { User } from './userModel';

export class UserService {
    private static DATA_LIMIT = 50;

    public static async getUser(filter: Record<string, unknown>) {
        const user = await User.findOne(filter)
            .populate('rooms', '-members')
            .exec();

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'User was not found.');
        }

        return user;
    }

    public static async getAllUser(pageNumber: number) {
        return User.find({})
            .skip(paginate(pageNumber, UserService.DATA_LIMIT))
            .limit(UserService.DATA_LIMIT)
            .exec();
    }

    public static async updateUser(
        filter: Record<string, unknown>,
        data: { displayName: string },
    ) {
        const user = await User.findOne(filter).exec();

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'User was not found.');
        }

        Object.assign(user, data);
        await user.save();

        return user;
    }

    public static deleteUser(filter: Record<string, unknown>) {
        return User.findByIdAndUpdate(filter, {
            isAccountDisabled: true,
        }).exec();
    }

    public static hasUser(filter: Record<string, unknown>) {
        return User.exists(filter).exec();
    }
}
