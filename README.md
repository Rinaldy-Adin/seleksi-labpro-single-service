# seleksi-labpro-single-service

## Identitas diri

**Nama:** Rinaldy Adin
<br>
**NIM:** 13521134

## Cara menjalankan

### Setup

1. Clone repository
   `git clone https://github.com/Rinaldy-Adin/seleksi-labpro-single-service.git`

2. Masuk ke dalam folder program
   `cd seleksi-labpro-single-service`

3. Install dependencies yang diperlukan
   `npm i`

4. Copy `.example.env` menjadi `.env` dan set environment variabel yang sesuai

### Database Migration & Seeding (PostgreSQL)

1. Buat database baru pada postgres untuk program ini

2. Set variabel `DATABASE_URL` pada `.env` dengan [connection url database postgres](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
   `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

3. Inisialisasi/migrate schema yang ada pada `prisma/schema.prisma` ke database yang telah dibuat
   `npx prisma db push`

4. Jalankan prisma generate untuk menghasilkan prisma client
   `npx prisma generate`

5. Jalankan seeder untuk mengisi database dengan data inisial
   `node seeder.ts`

## Design Pattern yang digunakan

### 1. Chain of Responsibility

Chain of Responsibility adalah design pattern behaioral yang memungkinkan adanya penanganan request secara sekuaensial melalui berbagai handler dengan perilaku yang berbeda. Setiap handler dalam rantai memutuskan apakah dia dapat menangani permintaan tersebut. Jika dia bisa menanganinya, maka dia akan menanganinya; jika tidak, maka permintaan tersebut akan diteruskan ke handler berikutnya dalam rantai. Pengirim permintaan tidak perlu tahu struktur internal dari rantai objek penangan, sehingga memungkinkan penanganan yang dinamis dan terpisah.

Pada program ini, design pattern Chain of Responsibility dimanfaatkan pada penggunaan middleware yang digunakan untuk melakukan otentikasi pengguna serta validasi pada body request.

```js
app.post(
    '/barang',
    authenticateToken,
    validateItemBody,
    async (req: Request, res: Response, next: NextFunction) => {
        ...
    }
);
```

Pada snippet program di atas, middleware/handler `authenticateToken` dan `validateItemBody` bisa saja menghentikan Chain of Responsibility, jika dikira menerima request yang tidak sesuai, atau bisa melanjutkan request hingga di handle oleh handler terakhir.

### 2. Facade Pattern

Facade Pattern (Pola Fasad) adalah structural design pattern yang menyediakan interface yang lebih sederhana untuk mengakses sistem yang kompleks. Pola ini menyembunyikan kompleksitas dari sistem di balik interface yang lebih mudah digunakan. Penggunaan pola ini dilakukan pada handler yang menerima request (pada folder `api/`) untuk menggunakan fungsi-fungsi pada `services/`

```js
// src/api/routes/barang.ts
...
async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            ...
        } = req.body as IItemDTO;

        const item: IItem = await createNewItem({ // Pemanggilan facade
            name,
            perusahaan_id,
            price,
            stock,
            code,
        });

        return res.json({
            ...
        } as StandardRes);
    } catch (err) {
        next(err);
    }
}
...
```

Pada snippet program di atas, dilakukan pemanggilan fungsi `createNewItem` yang akan membuat record `item` baru pada basis data. Fungsi tersebut merupakan Facade karena menyembunyikan implementasi yang kompleks dibalik fungsi tersebut.

```js
// src/services/items.ts
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
```

### 3. Singleton

Singleton Pattern adalah creational pattern yang memastikan bahwa sebuah kelas memiliki hanya satu instansi (instance) dan menyediakan cara untuk mengakses instansi tersebut secara global. Dengan pola ini, sebuah kelas dapat memiliki hanya satu titik akses ke instansinya, sehingga memastikan bahwa tidak ada lebih dari satu objek dari kelas tersebut yang dapat dibuat. Pola ini digunakan pada pemanfaatan ORM (Object Relational Mapper) `prisma`, yang hanya terdapat satu instans yang global.

```js
// src/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

Pada implementasi `PrismaClient` di atas, satu instans dari `PrismaClient` tersebut akan digunakan oleh semua bagian program. Meskipun pola singleton umumnya patut dihindari, penggunaan singleton pada kasus ini tepat karena memastikan akan hanya ada satu instans ORM yang terhubung dengan basis data.

## Technology Stack

**Bahasa:** Typescript<br>
**Framework**: Express<br>
**Package Lainnya:**<br>

```json
// package.json
{
    "devDependencies": {
        "dotenv": "^16.3.1",
        "express": "^4.18.2",
        "nodemon": "^3.0.1",
        "pino-pretty": "^10.2.0",
        "prisma": "^5.0.0",
        "ts-node": "^10.9.1",
        "typescript": "^5.1.6"
    },
    "dependencies": {
        "@prisma/client": "^5.0.0",
        "cors": "^2.8.5",
        "express-pino-logger": "^7.0.0",
        "jsonwebtoken": "^9.0.1",
        "module-alias": "^2.2.3",
        "pg": "^8.11.1",
        "pino": "^8.14.1",
        "uuid": "^9.0.0",
        "zod": "^3.21.4"
    }
}
```

## Endpoints

**POST login/ :** Login untuk mendapat token
<br>
**GET self/ :** Data pengguna (admin) sekarang
<br>
**GET barang/?q=&perusahaan= :** Data seluruh barang yang sesuai query
<br>
**GET barang/:id :** Data barang tertentu berdasarkan id
<br>
**POST barang/ :** Create record barang baru
<br>
**PUT barang/:id :** Update data barang berdasarkan id
<br>
**DELETE barang/:id :** Delete record barang berdasarkan id
<br>
**GET perusahaan/?q= :** Data seluruh perusahaan yang sesuai query
<br>
**GET perusahaan/:id :** Data perusahaan tertentu berdasarkan id
<br>
**POST perusahaan/ :** Create record perusahaan baru
<br>
**PUT perusahaan/:id :** Update data perusahaan berdasarkan id
<br>
**DELETE perusahaan/:id :** Delete record perusahaan berdasarkan id

## Bonus

-   Implementasi menggunakan typescript
