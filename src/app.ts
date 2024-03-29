import 'module-alias/register';
import express from 'express';
import { default as expressPinoLogger } from 'express-pino-logger';
import { logger } from './utils/Logger';
import config from '@/config';
import loadRoutes from './api';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(expressPinoLogger({ logger }));
app.use(express.json());

loadRoutes(app);

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
