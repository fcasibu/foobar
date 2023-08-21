import { isValidObjectId, model, Schema, Types } from 'mongoose';
import { z } from 'zod';

export const roomSchema = z
    .object({
        owner: z.custom((val) => isValidObjectId(val), {
            message: 'Not a valid object id.',
        }),
        name: z
            .string()
            .nonempty({ message: 'Room name must not be empty.' })
            .min(4, {
                message: 'Room name must be at least 4 characters long.',
            }),
    })
    .strict();

const RoomSchema = new Schema({
    name: { type: String, required: true, min: 4 },
    owner: { type: Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Types.ObjectId, ref: 'User' }],
});

export const Room = model('Room', RoomSchema);
