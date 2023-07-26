import { IUser } from '@/ts/interfaces/IUser';
import { logger } from '@/utils/Logger';
import { getUserByUsername } from '@/models/userModel';
import jwt from 'jsonwebtoken';
import config from '@/config';
import AppError from '@/ts/classes/AppError';

function generateToken(user: IUser): string {
    logger.info(`Signing JWT for user: ${user.name}`);
    return jwt.sign(
        {
            username: user.username,
            name: user.name,
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpire }
    );
}

export async function signIn(
    username: string,
    password: string
): Promise<{ user: IUser; token: string }> {
    logger.info('Checking user');
    const userRecord = await getUserByUsername(username);
    if (!userRecord) {
        throw new AppError('User not registered', 401);
    }

    if (password === userRecord.password) {
        logger.info('Checking password');
        const token = generateToken(userRecord);

        return { user: userRecord, token };
    } else {
        throw new AppError('Invalid Password', 401);
    }
}
