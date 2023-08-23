import { Router } from 'express';
import { isAuthenticated } from 'middlewares';
import { createUserHandler } from './userHandler';
import { UserService } from './userService';

const handler = createUserHandler(UserService);
export const userRouter = Router();

userRouter.use(isAuthenticated);

userRouter.route('/').get(handler.getAll);

userRouter.route('/:userId').get(handler.get).delete(handler.delete);
