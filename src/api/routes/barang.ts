import { IUserDTO } from '@/ts/interfaces/IUser';
import { signIn } from '@/services/auth';
import { Request, Response, Application, NextFunction } from 'express';
import { validateBody } from '../middleware/validate';
import { z } from 'zod';
import authenticateToken from '../middleware/authenticateToken';
import AppError from '@/ts/classes/AppError';
import StandardRes from '@/ts/interfaces/StandarRes';
import { logger } from '@/utils/Logger';
import { queryItems } from '@/services/items';

export default function (app: Application): void {
    app.get(
        '/barang',
        authenticateToken,
        async (
            req: Request<{}, {}, {}, { q?: string; perusahaan?: string }>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const { q, perusahaan } = req.query;
                const items = await queryItems(q, perusahaan);
                return res.json({
                    status: 'success',
                    message: 'successfully queried items',
                    data: items,
                } as StandardRes);
            } catch (err) {
                next(err);
            }
        }
    );
}
