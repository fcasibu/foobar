import { Router } from 'express';
import { createUserHandler } from './userHandler';
import { baseUserSchema } from './userModel';
import { isValid } from '../../middlewares';
import { UserService } from './userService';

const handler = createUserHandler(UserService);
export const userRouter = Router();

userRouter.route('/').get(handler.getAll);

userRouter
    .route('/:userId')
    .get(handler.get)
    .delete(handler.delete)
    .patch(isValid(baseUserSchema.partial()), handler.update);
