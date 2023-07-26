import { Router, Application } from 'express';
import auth from './routes/auth';
import handleErrors from './middleware/errors';
import barang from './routes/barang';
import perusahaan from './routes/perusahaan';

export default function loadRoutes(app: Application): void {
    auth(app);
    barang(app);
    perusahaan(app);
    handleErrors(app);
}
