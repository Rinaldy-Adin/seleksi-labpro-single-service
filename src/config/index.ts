import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
    // This error should crash whole process

    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const config = {
    jwtSecret: process.env.JWT_SECRET || 'SECRET',
    port: 8080,
    logs: {
        level: process.env.LOG_LEVEL || 'debug',
    },
};

export default config;
