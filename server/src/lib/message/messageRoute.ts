import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { AppError, httpStatus } from 'utils';
import { isValid } from 'middlewares';
import { createMessageHandler } from './messageHandler';
import { MessageService } from './messageService';
import { messageSchema } from './messageModel';

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname ?? '');
        if (!/(.jpg|.jpeg|.png|.gif)$/.test(ext)) {
            return cb(
                new AppError(
                    httpStatus.BAD_REQUEST,
                    'Only image files are accepted.',
                ),
            );
        }

        return cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024,
    },
});

const handler = createMessageHandler(MessageService);
export const messageRouter = Router();

messageRouter.route('/:roomId/messages').get(handler.getAll);

messageRouter
    .route('/:roomId/messages')
    .post(upload.single('image'), isValid(messageSchema), handler.post);
