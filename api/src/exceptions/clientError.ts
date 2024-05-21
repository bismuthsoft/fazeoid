import { CustomError } from './customError';

export class ClientError extends CustomError {
    constructor(message: string) {
        super(message, 400);
    }
}
