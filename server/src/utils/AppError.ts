export const httpStatus = {
    SUCCESSFUL: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
} as const;

export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        public override readonly message: string,
        public readonly isOperational = true,
    ) {
        super(message);

        Error.captureStackTrace &&
            Error.captureStackTrace(this, this.constructor);
    }
}
