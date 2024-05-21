import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { CustomRequest } from './checkJwt';

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Find the user within the database
        const user = await User.findById((req as CustomRequest).token.payload.userId);

        if (!user) {
            res.status(404)
                .type('json')
                .send(JSON.stringify({ message: 'User not found' }));
            return;
        }

        // Check if array of authorized roles includes the user's role
        if (roles.indexOf(user.role) > -1) next();
        else {
            res.status(403)
                .type('json')
                .send(JSON.stringify({ message: 'Not enough permissions' }));
            return;
        }
    };
};
