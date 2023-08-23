import z from 'zod';
import { Types } from 'mongoose';
import { AppError, httpStatus, paginate } from 'utils';
import type { UserService } from 'lib/user';
import { Room, roomSchema } from './roomModel';

export class RoomService {
    private static readonly DATA_LIMIT = 50;

    public static getAllRoom() {
        return Room.find({}, 'name').exec();
    }

    public static async getRoom(id: Types.ObjectId, pageNumber: number) {
        const room = await Room.findById(id)
            .populate({
                path: 'members',
                options: {
                    skip: paginate(pageNumber, RoomService.DATA_LIMIT),
                    limit: RoomService.DATA_LIMIT,
                    projection: '-password',
                    sort: 'displayName username',
                },
            })
            .exec();

        if (!room) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                `Room with the id ${id} was not found.`,
            );
        }

        return room;
    }

    public static createRoom(name: string, owner: Types.ObjectId) {
        return Room.create({ name, owner });
    }

    public static async updateRoom(
        id: Types.ObjectId,
        data: Omit<z.infer<typeof roomSchema>, 'name'>,
    ) {
        const room = await Room.findById(id).exec();

        if (!room) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                `Room with the id ${id} was not found.`,
            );
        }

        Object.assign(room, data);
        await room.save();

        return room;
    }

    public static deleteRoom(id: Types.ObjectId) {
        return Room.findByIdAndDelete(id);
    }

    public static async joinRoom(
        { roomId, userId }: Record<'roomId' | 'userId', Types.ObjectId>,
        userService: typeof UserService,
    ) {
        const hasUser = await userService.hasUser({ _id: userId });

        if (!hasUser) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                `User with the id: ${userId} was not found.`,
            );
        }

        const room = await Room.findByIdAndUpdate(
            roomId,
            {
                $push: { members: userId },
            },
            { new: true },
        )
            .populate({
                path: 'members',
                options: {
                    limit: RoomService.DATA_LIMIT,
                    projection: '-password',
                    sort: 'displayName username',
                },
            })
            .exec();

        return room;
    }
}
