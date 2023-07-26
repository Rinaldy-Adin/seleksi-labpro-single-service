import prisma from '@/prisma';
import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export async function createPerusahaan(
    name: string,
    address: string,
    phone: string,
    code: string
) {
    return prisma.perusahaan.create({
        data: {
            id: uuid(),
            name,
            address,
            phone,
            code,
        },
    });
}

export async function getAllPerusahaan() {
    return prisma.perusahaan.findMany();
}

export async function getPerusahaanById(id: string) {
    return prisma.perusahaan.findUnique({
        where: {
            id,
        },
    });
}

export async function updatePerusahaan(
    id: string,
    dataToUpdate: Prisma.perusahaanUpdateInput
) {
    return prisma.perusahaan.update({
        where: {
            id,
        },
        data: dataToUpdate,
    });
}

export async function deletePerusahaan(id: string) {
    return prisma.perusahaan.delete({
        where: {
            id,
        },
    });
}
