import { IUserDTO } from '@/ts/interfaces/IUser';
import { signIn } from '@/services/auth';
import { Request, Response, Application, NextFunction } from 'express';
import {
    validateBody,
    validateItemBody,
    validatePerusahaanBody,
} from '../middleware/validate';
import { z } from 'zod';
import authenticateToken from '../middleware/authenticateToken';
import AppError from '@/ts/classes/AppError';
import StandardRes from '@/ts/interfaces/StandarRes';
import { logger } from '@/utils/Logger';
import {
    createNewItem,
    deleteExistingItem,
    queryItemById,
    queryItems,
    udpateExistingItem,
} from '@/services/items';
import { IItem, IItemDTO } from '@/ts/interfaces/IItem';
import {
    PerusahaanArrayToDTO,
    PerusahaanToDTO,
    createNewPerusahaan,
    deleteExistingPerusahaan,
    queryPerusahaan,
    queryPerusahaanById,
    udpateExistingPerusahaan,
} from '@/services/perusahaan';
import { IPerusahaan, IPerusahaanDTO } from '@/ts/interfaces/IPerusahaan';

export default function (app: Application): void {
    app.get(
        '/perusahaan',
        authenticateToken,
        async (
            req: Request<{}, {}, {}, { q?: string }>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const { q } = req.query;
                const perusahaan = await queryPerusahaan(q);
                return res.json({
                    status: 'success',
                    message: 'successfully queried perusahaan',
                    data: PerusahaanArrayToDTO(perusahaan),
                } as StandardRes);
            } catch (err) {
                next(err);
            }
        }
    );

    app.get(
        '/perusahaan/:id',
        authenticateToken,
        async (
            req: Request<{ id: string }>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const id = req.params.id;
                const perusahaan = await queryPerusahaanById(id);

                return res.json({
                    status: 'success',
                    message: 'successfully queried perusahaan',
                    data: PerusahaanToDTO(perusahaan),
                } as StandardRes);
            } catch (err) {
                next(err);
            }
        }
    );

    app.post(
        '/perusahaan',
        authenticateToken,
        validatePerusahaanBody,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const {
                    nama: name,
                    alamat: address,
                    no_telp: phone,
                    kode: code,
                } = req.body as IPerusahaanDTO;

                const perusahaan: IPerusahaan = await createNewPerusahaan({
                    name,
                    address,
                    phone,
                    code,
                });

                return res.json({
                    status: 'success',
                    message: 'successfully created perusahaan',
                    data: PerusahaanToDTO(perusahaan),
                } as StandardRes);
            } catch (err) {
                next(err);
            }
        }
    );

    app.put(
        '/perusahaan/:id',
        authenticateToken,
        validatePerusahaanBody,
        async (
            req: Request<{ id: string }>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const {
                    nama: name,
                    alamat: address,
                    no_telp: phone,
                    kode: code,
                } = req.body as IPerusahaanDTO;

                const perusahaan: IPerusahaan = await udpateExistingPerusahaan({
                    id: req.params.id,
                    name,
                    address,
                    phone,
                    code,
                });

                return res.json({
                    status: 'success',
                    message: 'successfully udpated perusahaan',
                    data: PerusahaanToDTO(perusahaan),
                } as StandardRes);
            } catch (err) {
                next(err);
            }
        }
    );

    app.delete(
        '/perusahaan/:id',
        authenticateToken,
        async (
            req: Request<{ id: string }>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                const perusahaan: IPerusahaan = await deleteExistingPerusahaan(
                    req.params.id
                );

                return res.json({
                    status: 'success',
                    message: 'successfully deleted perusahaan',
                    data: PerusahaanToDTO(perusahaan),
                } as StandardRes);
            } catch (err) {
                next(err);
            }
        }
    );
}
