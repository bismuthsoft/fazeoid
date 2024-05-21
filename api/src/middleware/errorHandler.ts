import { Request, Response, NextFunction } from 'express';
import { CustomError, IResponseError } from '../exceptions/customError';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (!(err instanceof CustomError)) {
        res.status(500).send(JSON.stringify({
            message: "Server error, please try again later"
        }));
    } else {
        const customError = err as CustomError;
        let response = {
            message: customError.message
        } as IResponseError;
        // Check if more info to return
        if (customError.additionalInfo) {
            response.additionalInfo = customError.additionalInfo;
        }
        res.status(customError.status).type('json').send(JSON.stringify(response));
    }
}
