import { DateTime } from 'luxon';
import { model, Schema, Types } from 'mongoose';
import { z } from 'zod';

export const messageSchema = z.object({
    content: z.string().max(1500),
});

const MessageSchema = new Schema(
    {
        author: { type: Types.ObjectId, required: true, ref: 'User' },
        room: { type: Types.ObjectId, required: true, ref: 'Room' },
        content: { type: String, maxLength: 1500 },
        attachment: String,
    },
    { timestamps: true },
);

MessageSchema.virtual('formattedDate').get(function getFormattedDate() {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(
        DateTime.TIME_24_SIMPLE,
    );
});

export const Message = model('Message', MessageSchema);
