import { IUser } from '@/ts/IUser';
import { logger } from '@/utils/Logger';
import { getUserByUsername } from '@/models/userModel';
import jwt from 'jsonwebtoken';
import config from '@/config';

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
        throw new Error('User not registered');
    }

    if (password === userRecord.password) {
        logger.info('Checking password');
        const token = generateToken(userRecord);

        return { user: userRecord, token };
    } else {
        throw new Error('Invalid Password');
    }
}
