import { default as pino } from 'pino';

export const logger = pino({
    name: 'single-service',
    level: 'debug',
});
