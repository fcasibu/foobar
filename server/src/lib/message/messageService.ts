import z from 'zod';
import type { Types } from 'mongoose';
import { paginate } from 'utils';
import { Message, type messageSchema } from './messageModel';

type MessageData = z.infer<typeof messageSchema> & {
    attachment?: string | null;
    author: Types.ObjectId;
    room: Types.ObjectId;
};

export class MessageService {
    private static readonly DATA_LIMIT = 50;

    public static getAllMessage(pageNumber: number) {
        return Message.find({})
            .populate('author')
            .skip(paginate(pageNumber, MessageService.DATA_LIMIT))
            .limit(MessageService.DATA_LIMIT)
            .exec();
    }

    public static getMessage(filter: Record<string, unknown>) {
        return Message.findOne(filter).populate('author').exec();
    }

    public static createMessage(data: MessageData) {
        return Message.create(data);
    }

    public static updateMessage(
        filter: Record<string, unknown>,
        data: z.infer<typeof messageSchema>,
    ) {
        return Message.findOneAndUpdate(filter, data, { new: true })
            .populate('author')
            .exec();
    }

    public static deleteMessage(filter: Record<string, unknown>) {
        return Message.findOneAndDelete(filter).exec();
    }
}
