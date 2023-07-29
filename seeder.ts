const { PrismaClient } = require('@prisma/client');
const { v4: uuid } = require('uuid');

const prisma = new PrismaClient();

async function seed() {
    try {
        // Create sample data for the 'perusahaan' model
        const perusahaanData = [
            {
                id: uuid(),
                name: 'Company A',
                address: '123 Main St',
                phone: '123-456-7890',
                code: 'COMP1',
            },
            {
                id: uuid(),
                name: 'Company B',
                address: '456 Elm St',
                phone: '987-654-3210',
                code: 'COMP2',
            },
        ];

        for (const data of perusahaanData) {
            await prisma.perusahaan.create({
                data,
            });
        }

        // Create sample data for the 'items' model
        const itemsData = [
            {
                id: uuid(),
                perusahaan_id: perusahaanData[0].id,
                name: 'Item 1',
                price: 100,
                stock: 50,
                code: 'ITM1',
            },
            {
                id: uuid(),
                perusahaan_id: perusahaanData[0].id,
                name: 'Item 2',
                price: 150,
                stock: 30,
                code: 'ITM2',
            },
            {
                id: uuid(),
                perusahaan_id: perusahaanData[1].id,
                name: 'Item 3',
                price: 200,
                stock: 20,
                code: 'ITM3',
            },
        ];

        for (const data of itemsData) {
            await prisma.items.create({
                data,
            });
        }

        // Create sample data for the 'users' model
        const usersData = [
            {
                username: 'admin',
                password: 'pass',
                email: 'admin@admin.com',
                name: 'nama admin',
            },
        ];

        for (const data of usersData) {
            await prisma.users.create({
                data,
            });
        }

        console.log('Seeder executed successfully.');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
