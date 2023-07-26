import prisma from '@/prisma';
import { logger } from '@/utils/Logger';
import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export async function createItem(
    id: string,
    perusahaan_id: string,
    name: string,
    price: number,
    stock: number,
    code: string
) {
    return prisma.items.create({
        data: {
            id,
            name,
            price,
            stock,
            code,
            perusahaan: {
                connect: {
                    id: perusahaan_id,
                },
            },
        },
    });
}

export async function getAllItems() {
    return prisma.items.findMany();
}

export async function getItemById(id: string) {
    return prisma.items.findUnique({
        where: {
            id,
        },
    });
}

export async function getItemsByQuery(
    query: string = '',
    perusahaan: string = ''
) {
    if (query.trim() !== '' && perusahaan.trim() !== '')
        return prisma.items.findMany({
            where: {
                AND: [
                    {
                        perusahaan: {
                            name: { contains: perusahaan, mode: 'insensitive' },
                        },
                    },
                    {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { code: { contains: query, mode: 'insensitive' } },
                        ],
                    },
                ],
            },
        });

    if (query.trim() !== '')
        return prisma.items.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { code: { contains: query, mode: 'insensitive' } },
                ],
            },
        });

    if (perusahaan.trim() !== '')
        return prisma.items.findMany({
            where: {
                perusahaan: {
                    name: { contains: perusahaan, mode: 'insensitive' },
                },
            },
        });

    return getAllItems();
}

export async function updateItem(
    id: string,
    dataToUpdate: Prisma.itemsUpdateInput
) {
    return prisma.items.update({
        where: {
            id,
        },
        data: dataToUpdate,
    });
}

export async function deleteItem(id: string) {
    return prisma.items.delete({
        where: {
            id,
        },
    });
}
