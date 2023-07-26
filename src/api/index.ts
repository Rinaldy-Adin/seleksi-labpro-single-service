import { Router, Application } from 'express';
import auth from './routes/auth';
import handleErrors from './middleware/errors';

export default function loadRoutes(app: Application): void {
    auth(app);
    handleErrors(app);
}
