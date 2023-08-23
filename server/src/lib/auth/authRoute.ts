import { Router } from 'express';
import passport from 'passport';
import { createAuthHandler } from './authHandler';

const handler = createAuthHandler();
export const authRouter = Router();

authRouter.route('/github').get(
    passport.authenticate('github', {
        scope: ['user:email'],
    }),
);

authRouter
    .route('/github/callback')
    .get(passport.authenticate('github', { session: true }), (_req, res) => {
        res.redirect(process.env.CLIENT_URL);
    });

authRouter.route('/google').get(
    passport.authenticate('google', {
        scope: ['profile'],
    }),
);

authRouter
    .route('/google/callback')
    .get(passport.authenticate('google', { session: true }), (_req, res) => {
        res.redirect(process.env.CLIENT_URL);
    });

authRouter.route('/me').get(handler.getMe);
