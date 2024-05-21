import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import config from '../config';

export interface CustomRequest extends Request {
    token: JwtPayload;
}

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // Get the jwt token from the head
    const token = <string>req.headers['authorization'];
    let jwtPayload;

    // Try to validate the token and get data
    try {
        jwtPayload = <any>verify(token?.split(' ')[1], config.jwt.secret!, {
            complete: true,
            audience: config.jwt.audience,
            issuer: config.jwt.issuer,
            algorithms: ['HS256'],
            clockTolerance: 0,
            ignoreExpiration: false,
            ignoreNotBefore: false
        });
        (req as CustomRequest).token = jwtPayload;
    } catch (error) {
        res.status(401)
            .type('json')
            .send(JSON.stringify({ message: 'Missing or invalid token' }));
        return;
    }

    // Call the next middleware or controller
    next();
};
