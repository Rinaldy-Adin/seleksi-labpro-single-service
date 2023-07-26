import { AnyZodObject, ZodError, z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import AppError from '@/ts/classes/AppError';

export function validateBody(schema: AnyZodObject) {
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

const validateItemBody = validateBody(
    z.object({
        body: z.object({
            perusahaan_id: z
                .string()
                .nonempty({ message: 'perusahaan_id cannot be empty' }),
            nama: z.string().nonempty({ message: 'nama cannot be empty' }),
            harga: z
                .number()
                .int({ message: 'harga must be a round number' })
                .gt(0, 'harga must be bigger than 0'),
            stok: z
                .number()
                .int({ message: 'stok must be a round number' })
                .gt(0, 'stok must be bigger than 0'),
            kode: z.string().nonempty({ message: 'kode cannot be empty' }),
        }),
    })
);

export { validateItemBody };
