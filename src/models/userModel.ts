import prisma from '@/prisma';

export async function createUser(
    username: string,
    name: string,
    password: string,
    email: string
) {
    return prisma.users.create({
        data: {
            username,
            name,
            password,
            email,
        },
    });
}

export async function getAllUsers() {
    return prisma.users.findMany();
}

export async function getUserByUsername(username: string) {
    return prisma.users.findUnique({
        where: {
            username,
        },
    });
}
