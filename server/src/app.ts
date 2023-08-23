import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import { User, authRouter, roomRouter, userRouter, messageRouter } from 'lib';
import { PassportService } from 'services';
import { AppError, httpStatus } from 'utils';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    }),
);
app.use(passport.initialize());
app.use(passport.session());

const passportService = new PassportService(User);
passportService.init();

app.use('/users', userRouter);
app.use('/rooms', roomRouter, messageRouter);
app.use('/auth', authRouter);

app.use((_req, _res, next) => {
    next(new AppError(httpStatus.NOT_FOUND, 'Not Found'));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);

    res.status(err.statusCode || httpStatus.SERVER_ERROR).json({
        status: 'fail',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
        }),
    });
});

export default app;
