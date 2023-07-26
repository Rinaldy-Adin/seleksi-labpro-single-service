import { IUserDTO } from '@/ts/interfaces/IUser';
import { signIn } from '@/services/auth';
import { Request, Response, Application, NextFunction } from 'express';
import { validateBody } from '../middleware/validate';
import { z } from 'zod';
import authenticateToken from '../middleware/authenticateToken';
import AppError from '@/ts/classes/AppError';
import StandardRes from '@/ts/interfaces/StandarRes';
import { logger } from '@/utils/Logger';

export default function (app: Application): void {
    app.post(
        '/login',
        validateBody(
            z.object({
                body: z.object({
                    username: z
                        .string()
                        .nonempty({ message: 'Username cannot be empty' }),
                    password: z
                        .string()
                        .nonempty({ message: 'Password cannot be empty' }),
                }),
            })
        ),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { username, password } = req.body as IUserDTO;

                const { user, token } = await signIn(username, password);

                return res.json({
                    status: 'success',
                    message: 'User successfully fetched',
                    data: { user, token },
                } as StandardRes);
            } catch (error) {
                next(error);
            }
        }
    );

    app.get(
        '/self',
        authenticateToken,
        (req: Request, res: Response, next: NextFunction) => {
            try {
                logger.info(req);
                if (req.user) {
                    return res.json({
                        status: 'success',
                        message: 'User successfully fetched',
                        data: req.user,
                    } as StandardRes);
                } else {
                    throw new AppError('User payload not received', 500);
                }
            } catch (error) {
                next(error);
            }
        }
    );
}
