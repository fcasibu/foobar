import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { AppError, httpStatus } from '@/utils';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((_req, _res, next) => {
    next(new AppError(httpStatus.NOT_FOUND, 'Not Found'));
});

app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.message);

    res.status(err.statusCode || httpStatus.SERVER_ERROR).json({
        status: 'error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

export default app;
