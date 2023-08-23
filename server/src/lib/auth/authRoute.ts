import { Router } from 'express';
import passport from 'passport';
import { UserService, refinedUserSchema } from 'lib/user';
import { isValid } from 'middlewares';
import { createAuthHandler } from './authHandler';
import { AuthService } from './authService';

const handler = createAuthHandler(UserService, AuthService);
export const authRouter = Router();

authRouter.route('/login').post(handler.loginWithUsernameAndPassword);

authRouter
    .route('/register')
    .post(isValid(refinedUserSchema), handler.registerWithUsernameAndPassword);

authRouter.route('/google').get(
    passport.authenticate('google', {
        scope: ['profile'],
    }),
);

authRouter.route('/google/callback').get(
    passport.authenticate('google', {
        successRedirect: '/',
    }),
);
