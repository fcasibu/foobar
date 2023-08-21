export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        public override readonly message: string,
    ) {
        super(message);

        if (typeof Error.captureStackTrace !== 'undefined') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
