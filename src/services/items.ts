import { getItemsByQuery } from '@/models/itemModel';
import AppError from '@/ts/classes/AppError';
import { logger } from '@/utils/Logger';

export async function queryItems(query?: string, perusahaan?: string) {
    try {
        logger.info(`Querrying items ${query}, from company: ${perusahaan}`);
        const itemRecords = await getItemsByQuery(query, perusahaan);

        return itemRecords;
    } catch (err) {
        throw new AppError('Falied query', 500);
    }
}
