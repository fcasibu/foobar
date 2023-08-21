import z from 'zod';
import type { Types } from 'mongoose';
import { AppError, httpStatus } from 'utils';
import { User, baseUserSchema } from './userModel';

export class UserService {
    public static async getUser(id: Types.ObjectId) {
        const user = await User.findById(id, '-password')
            .populate('rooms', '-members')
            .exec();

        if (!user) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                `User with the id ${id} was not found.`,
            );
        }

        return user;
    }

    public static getAllUser() {
        return User.find({}, '-password').exec();
    }

    public static async updateUser(
        id: Types.ObjectId,
        data: z.infer<typeof baseUserSchema>,
    ) {
        const user = await User.findById(id).exec();

        if (!user) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                `User with the id ${id} was not found.`,
            );
        }

        Object.assign(user, data);
        await user.save();
        user.password = undefined!;

        return user;
    }

    public static deleteUser(id: Types.ObjectId) {
        return User.findByIdAndUpdate(id, { isAccountDisabled: true }).exec();
    }

    public static hasUser(id: Types.ObjectId) {
        return User.exists({ _id: id }).exec();
    }
}
