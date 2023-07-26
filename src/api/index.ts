import { Router, Application } from 'express';
import auth from './routes/auth';
import handleErrors from './middleware/errors';
import barang from './routes/barang';

export default function loadRoutes(app: Application): void {
    auth(app);
    barang(app);
    handleErrors(app);
}
