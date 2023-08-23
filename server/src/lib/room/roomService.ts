import z from 'zod';
import { Types } from 'mongoose';
import { AppError, httpStatus, paginate } from 'utils';
import type { UserService } from 'lib/user';
import { Room, type roomSchema } from './roomModel';

export class RoomService {
    private static readonly DATA_LIMIT = 50;

    public static getAllRoom(pageNumber: number) {
        return Room.find({}, 'name')
            .skip(paginate(pageNumber, RoomService.DATA_LIMIT))
            .limit(RoomService.DATA_LIMIT)
            .exec();
    }

    public static async getRoom(id: Types.ObjectId, pageNumber: number) {
        const room = await Room.findById(id)
            .populate({
                path: 'members',
                options: {
                    skip: paginate(pageNumber, RoomService.DATA_LIMIT),
                    limit: RoomService.DATA_LIMIT,
                    sort: 'displayName',
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

    public static async deleteRoom(id: Types.ObjectId) {
        const room = await Room.findOne({ _id: id }).exec();
        return room?.deleteOne();
    }

    public static async joinRoom(
        { roomId, userId }: Record<'roomId' | 'userId', Types.ObjectId>,
        userService: typeof UserService,
    ) {
        const isUserAlreadyInRoom = await Room.exists({
            _id: roomId,
            members: { _id: userId },
        });

        if (isUserAlreadyInRoom) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                `User already a member.`,
            );
        }

        const hasUser = await userService.hasUser({ _id: userId });

        if (!hasUser) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                `User with the id: ${userId} was not found.`,
            );
        }

        const room = await Room.findOneAndUpdate(
            { _id: roomId },
            {
                $addToSet: { members: userId },
            },
            { new: true },
        )
            .populate({
                path: 'members',
                options: {
                    limit: RoomService.DATA_LIMIT,
                    sort: 'displayName',
                },
            })
            .exec();

        return room;
    }
}
