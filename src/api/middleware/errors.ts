import AppError from '@/ts/classes/AppError';
import { logger } from '@/utils/Logger';
import { Application, NextFunction, Request, Response } from 'express';

export default function handleErrors(app: Application): void {
    app.use((req: Request, res: Response, next: NextFunction) => {
        const err: AppError = new AppError('Not Found', 404);
        next(err);
    });

    app.use(
        (
            err: AppError,
            req: Request,
            res: Response,
            next: NextFunction
        ): void => {
            logger.error(err.message);
            res.status(err.status || 500);
            res.json({
                status: 'error',
                message: `${err.message}`,
                data: null,
            });
        }
    );
}
