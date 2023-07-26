import {
    createItem,
    deleteItem,
    getItemByCode,
    getItemByCodeExcludeId,
    getItemById,
    getItemsByQuery,
    updateItem,
} from '@/models/itemModel';
import {
    createPerusahaan,
    deletePerusahaan,
    getAllPerusahaan,
    getPerusahaanByCode,
    getPerusahaanByCodeExcludeId,
    getPerusahaanById,
    getPerusahaanByQuery,
    updatePerusahaan,
} from '@/models/perusahaanModel';
import AppError from '@/ts/classes/AppError';
import { IItem, IItemWithId } from '@/ts/interfaces/IItem';
import {
    IPerusahaan,
    IPerusahaanDTO,
    IPerusahaanWithId,
} from '@/ts/interfaces/IPerusahaan';
import { logger } from '@/utils/Logger';
import { v4 as uuid } from 'uuid';

export async function queryPerusahaan(query?: string) {
    try {
        logger.info(`Querrying perusahaan ${query}`);
        const perusahaanRecords = await getPerusahaanByQuery(query);

        return perusahaanRecords;
    } catch (err) {
        throw new AppError('Falied query', 500);
    }
}

export async function queryPerusahaanById(id: string) {
    try {
        logger.info(`Querrying perusahaan with id ${id}`);
        const perusahaanRecord = await getPerusahaanById(id);

        if (!perusahaanRecord) throw new AppError('Perusahaan not found', 404);

        return perusahaanRecord;
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw new AppError('Failed query', 500);
    }
}

export async function createNewPerusahaan({
    name,
    address,
    phone,
    code,
}: IPerusahaan): Promise<IPerusahaan> {
    try {
        if ((await getPerusahaanByCode(code)) !== null)
            throw new AppError('Given code already exists', 400);

        logger.info(`Creating new perusahaan...`);
        const perusahaanRecords = await createPerusahaan(
            name,
            address,
            phone,
            code
        );
        logger.info(`Perusahaan ${name} successfully created`);

        return perusahaanRecords;
    } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error(err);
        throw new AppError('Failed create', 500);
    }
}

export async function udpateExistingPerusahaan({
    id,
    name,
    address,
    phone,
    code,
}: IPerusahaanWithId): Promise<IPerusahaan> {
    try {
        if ((await getPerusahaanById(id)) === null)
            throw new AppError('Perusahaan does not exist', 404);

        if ((await getPerusahaanByCodeExcludeId(code, id)) !== null)
            throw new AppError('Given code already exists', 400);

        logger.info(`Updating perusahaan...`);
        const perusahaanRecord = await updatePerusahaan(
            id,
            name,
            address,
            phone,
            code
        );
        logger.info(`Perusahaan ${name} successfully updated`);

        return perusahaanRecord;
    } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error(err);
        throw new AppError('Failed update', 500);
    }
}

export async function deleteExistingPerusahaan(
    id: string
): Promise<IPerusahaan> {
    try {
        if ((await getPerusahaanById(id)) === null)
            throw new AppError('Perusahaan does not exist', 404);

        logger.info(`Deleting perusahaan...`);
        const perusahaanRecord = await deletePerusahaan(id);
        logger.info(`Perusahaan ${perusahaanRecord.name} successfully deleted`);

        return perusahaanRecord;
    } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error(err);
        throw new AppError('Failed create', 500);
    }
}

export function PerusahaanToDTO(perusahaan: IPerusahaan): IPerusahaanDTO {
    return {
        id: perusahaan.id,
        nama: perusahaan.name,
        alamat: perusahaan.address,
        no_telp: perusahaan.phone,
        kode: perusahaan.code,
    };
}

export function PerusahaanArrayToDTO(arr: IPerusahaan[]): IPerusahaanDTO[] {
    return arr.map((perusahaan) => PerusahaanToDTO(perusahaan));
}
