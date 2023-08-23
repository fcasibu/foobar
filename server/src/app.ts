import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { User, authRouter, roomRouter, userRouter } from 'lib';
import { PassportService } from 'services';
import { AppError, httpStatus } from 'utils';

const app = express();

app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const passportService = new PassportService(User);
passportService.init();

app.use('/users', userRouter);
app.use('/rooms', roomRouter);
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
