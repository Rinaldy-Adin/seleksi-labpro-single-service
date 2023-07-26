import config from '@/config';
import AppError from '@/ts/classes/AppError';
import { IUser } from '@/ts/interfaces/IUser';
import { logger } from '@/utils/Logger';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

export default function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers['authorization'];
    const token = authHeader;

    if (token == null) {
        const err = new AppError('Unauthorized request', 401);
        return next(err);
    }

    jwt.verify(token, config.jwtSecret as string, (err, decoded) => {
        if (err) {
            const appErr = new AppError('Forbidden', 403);
            return next(appErr);
        }

        const userPayload = decoded as IUser;
        req.user = { username: userPayload.username, name: userPayload.name };

        return next();
    });
}
