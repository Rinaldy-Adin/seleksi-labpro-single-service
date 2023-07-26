import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import AppError from '@/ts/classes/AppError';

export default function validateBody(schema: AnyZodObject) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (err) {
            if (err instanceof ZodError)
                return next(new AppError(err.issues[0].message));
            return next(err);
        }
    };
}
