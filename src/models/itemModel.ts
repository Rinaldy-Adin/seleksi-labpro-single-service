import prisma from '@/prisma';
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
