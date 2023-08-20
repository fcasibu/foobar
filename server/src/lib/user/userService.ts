import { AppError, httpStatus } from 'utils';
import { User, userSchema } from '.';
import z from 'zod';

export class UserService {
    public static async getUser(id: string) {
        const user = await User.findById(id, '-password')
            .populate('rooms')
            .exec();

        if (!user) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                `User with the id ${id} was not found.`,
            );
        }

        return user;
    }

    public static async getAllUser() {
        return User.find({}, '-password').exec();
    }

    public static async updateUser(
        id: string,
        data: z.infer<typeof userSchema>,
    ) {
        return User.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    public static async deleteUser(id: string) {
        return User.findByIdAndDelete(id).exec();
    }
}
