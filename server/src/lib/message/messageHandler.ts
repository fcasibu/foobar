import { Types, isValidObjectId } from 'mongoose';
import DataUriParser from 'datauri/parser';
import { AppError, handleAsync, httpStatus, sendResponse } from 'utils';
import { MessageService } from './messageService';
import { CloudinaryUploader } from './cloudinaryUploader';

export function createMessageHandler(messageService: typeof MessageService) {
    const cloudinaryUploader = new CloudinaryUploader();

    return handleAsync({
        getAll: async (req, res) => {
            if (!isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid room id');
            }

            const pageNumber = Number(req.query.page ?? 1);
            const messages = await messageService.getAllMessage(pageNumber);

            return sendResponse(res, httpStatus.SUCCESSFUL, { messages });
        },

        get: async (req, res) => {
            if (!isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid room id');
            }

            if (!isValidObjectId(req.params.messageId)) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid message id');
            }

            const message = await messageService.getMessage({
                _id: req.params.messageId,
            });

            return sendResponse(res, httpStatus.SUCCESSFUL, { message });
        },

        post: async (req, res) => {
            if (!isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid room id');
            }

            let attachment;
            if (req.file) {
                const parser = new DataUriParser();
                attachment = await cloudinaryUploader.upload(
                    parser.format(
                        req.file?.originalname ?? '',
                        req.file?.buffer ?? '',
                    ),
                );
            }

            const data = {
                attachment,
                content: req.body.content,
                room: new Types.ObjectId(req.params.roomId),
                author: new Types.ObjectId(
                    (req.user as Express.User & { id: string }).id,
                ),
            };
            const message = await messageService.createMessage(data);

            return sendResponse(res, httpStatus.CREATED, { message });
        },

        update: async (req, res) => {
            if (!req.params.roomId || !isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Invalid room id');
            }

            if (!isValidObjectId(req.params.userId)) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid user id');
            }

            if (!isValidObjectId(req.params.messageId)) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid message id');
            }

            const message = await messageService.updateMessage(
                { _id: req.params.messageId },
                { content: req.body.content },
            );

            return sendResponse(res, httpStatus.SUCCESSFUL, { message });
        },

        delete: async (req, res) => {
            if (!isValidObjectId(req.params.roomId)) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid room id');
            }

            if (!isValidObjectId(req.params.userId)) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid user id');
            }

            if (!isValidObjectId(req.params.messageId)) {
                throw new AppError(httpStatus.NOT_FOUND, 'Invalid message id');
            }

            await messageService.deleteMessage({ _id: req.params.messageId });

            return sendResponse(res, httpStatus.NO_CONTENT);
        },
    });
}
