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

export async function getPerusahaanByCode(code: string) {
    return prisma.perusahaan.findFirst({
        where: {
            code,
        },
    });
}

export async function getPerusahaanByCodeExcludeId(code: string, id: string) {
    return prisma.perusahaan.findFirst({
        where: {
            code,
            NOT: { id },
        },
    });
}

export async function getPerusahaanByQuery(query: string = '') {
    if (query.trim() !== '')
        return prisma.perusahaan.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { code: { contains: query, mode: 'insensitive' } },
                ],
            },
        });

    return getAllPerusahaan();
}

export async function updatePerusahaan(
    id: string,
    name: string,
    address: string,
    phone: string,
    code: string
) {
    return prisma.perusahaan.update({
        where: {
            id,
        },
        data: {
            name,
            address,
            phone,
            code,
        },
    });
}

export async function deletePerusahaan(id: string) {
    return prisma.perusahaan.delete({
        where: {
            id,
        },
    });
}
