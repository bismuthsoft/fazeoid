import { CustomError } from './customError';

export class UnauthorizedError extends CustomError {
    constructor(message: string) {
        super(message, 401);
    }
}
