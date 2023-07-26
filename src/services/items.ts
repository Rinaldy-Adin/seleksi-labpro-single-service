import {
    createItem,
    deleteItem,
    getItemByCode,
    getItemByCodeExcludeId,
    getItemById,
    getItemsByQuery,
    updateItem,
} from '@/models/itemModel';
import { getPerusahaanById } from '@/models/perusahaanModel';
import AppError from '@/ts/classes/AppError';
import { IItem, IItemDTO, IItemWithId } from '@/ts/interfaces/IItem';
import { logger } from '@/utils/Logger';
import { v4 as uuid } from 'uuid';

export async function queryItems(query?: string, perusahaan?: string) {
    try {
        logger.info(`Querrying items ${query}, from company: ${perusahaan}`);
        const itemRecords = await getItemsByQuery(query, perusahaan);

        return itemRecords;
    } catch (err) {
        throw new AppError('Falied query', 500);
    }
}

export async function queryItemById(id: string) {
    try {
        logger.info(`Querrying item with id ${id}`);
        const itemRecords = await getItemById(id);

        if (!itemRecords) throw new AppError('Item not found', 404);

        return itemRecords;
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw new AppError('Failed query', 500);
    }
}

export async function createNewItem({
    name,
    perusahaan_id,
    price,
    stock,
    code,
}: IItem): Promise<IItem> {
    try {
        if ((await getPerusahaanById(perusahaan_id)) === null)
            throw new AppError('Given perusahaan_id does not exist', 400);

        if ((await getItemByCode(code)) !== null)
            throw new AppError('Given code already exists', 400);

        logger.info(`Creating new item...`);
        const itemRecords = await createItem(
            uuid().toString(),
            perusahaan_id,
            name,
            price,
            stock,
            code
        );
        logger.info(`Item ${name} successfully created`);

        return itemRecords;
    } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error(err);
        throw new AppError('Failed create', 500);
    }
}

export async function udpateExistingItem({
    id,
    name,
    perusahaan_id,
    price,
    stock,
    code,
}: IItemWithId): Promise<IItem> {
    try {
        if ((await getItemById(id)) === null)
            throw new AppError('Item does not exist', 404);

        if ((await getPerusahaanById(perusahaan_id)) === null)
            throw new AppError('Given perusahaan_id does not exist', 400);

        if ((await getItemByCodeExcludeId(code, id)) !== null)
            throw new AppError('Given code already exists', 400);

        logger.info(`Updating item...`);
        const itemRecords = await updateItem(
            id,
            perusahaan_id,
            name,
            price,
            stock,
            code
        );
        logger.info(`Item ${name} successfully updated`);

        return itemRecords;
    } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error(err);
        throw new AppError('Failed create', 500);
    }
}

export async function deleteExistingItem(id: string): Promise<IItem> {
    try {
        if ((await getItemById(id)) === null)
            throw new AppError('Item does not exist', 404);

        logger.info(`Deleting item...`);
        const itemRecords = await deleteItem(id);
        logger.info(`Item ${itemRecords.name} successfully deleted`);

        return itemRecords;
    } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error(err);
        throw new AppError('Failed create', 500);
    }
}

export function ItemToDTO(item: IItem): IItemDTO {
    return {
        id: item.id,
        nama: item.name,
        harga: item.price,
        kode: item.code,
        perusahaan_id: item.perusahaan_id,
        stok: item.stock,
    };
}

export function ItemArrayToDTO(arr: IItem[]): IItemDTO[] {
    return arr.map((item) => ItemToDTO(item));
}
