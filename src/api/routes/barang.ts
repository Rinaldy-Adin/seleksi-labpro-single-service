import { IUserDTO } from '@/ts/interfaces/IUser';
import { signIn } from '@/services/auth';
import { Request, Response, Application, NextFunction } from 'express';
import { validateBody, validateItemBody } from '../middleware/validate';
import { z } from 'zod';
import authenticateToken from '../middleware/authenticateToken';
import AppError from '@/ts/classes/AppError';
import StandardRes from '@/ts/interfaces/StandarRes';
import { logger } from '@/utils/Logger';
import {
    ItemArrayToDTO,
    ItemToDTO,
    createNewItem,
    deleteExistingItem,
    queryItemById,
    queryItems,
    udpateExistingItem,
} from '@/services/items';
import { IItem, IItemDTO } from '@/ts/interfaces/IItem';

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
                    data: ItemArrayToDTO(items),
                } as StandardRes);
            } catch (err) {
                next(err);
            }
        }
    );

    app.get(
        '/barang/:id',
        authenticateToken,
        async (
            req: Request<{ id: string }>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const id = req.params.id;
                const item = await queryItemById(id);

                return res.json({
                    status: 'success',
                    message: 'successfully queried items',
                    data: ItemToDTO(item),
                } as StandardRes);
            } catch (err) {
                next(err);
            }
        }
    );

    app.post(
        '/barang',
        authenticateToken,
        validateItemBody,
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('owkring');
            try {
                const {
                    nama: name,
                    perusahaan_id,
                    harga: price,
                    stok: stock,
                    kode: code,
                } = req.body as IItemDTO;

                const item: IItem = await createNewItem({
                    name,
                    perusahaan_id,
                    price,
                    stock,
                    code,
                });

                return res.json({
                    status: 'success',
                    message: 'successfully created item',
                    data: ItemToDTO(item),
                } as StandardRes);
            } catch (err) {
                next(err);
            }
        }
    );

    app.put(
        '/barang/:id',
        authenticateToken,
        validateItemBody,
        async (
            req: Request<{ id: string }>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const {
                    nama: name,
                    perusahaan_id,
                    harga: price,
                    stok: stock,
                    kode: code,
                } = req.body as IItemDTO;

                const item: IItem = await udpateExistingItem({
                    id: req.params.id,
                    name,
                    perusahaan_id,
                    price,
                    stock,
                    code,
                });

                return res.json({
                    status: 'success',
                    message: 'successfully udpated item',
                    data: ItemToDTO(item),
                } as StandardRes);
            } catch (err) {
                next(err);
            }
        }
    );

    app.delete(
        '/barang/:id',
        authenticateToken,
        async (
            req: Request<{ id: string }>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const item: IItem = await deleteExistingItem(req.params.id);

                return res.json({
                    status: 'success',
                    message: 'successfully deleted item',
                    data: ItemToDTO(item),
                } as StandardRes);
            } catch (err) {
                next(err);
            }
        }
    );
}
