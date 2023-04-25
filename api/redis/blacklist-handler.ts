import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import blacklist from './blacklist';
const existsAsync = promisify(blacklist.exists).bind(blacklist);
const setAsync = promisify(blacklist.set).bind(blacklist);

const generateTokenHash = (token: any) => createHash('sha256').update(token).digest('hex');

export const add = async (token: any) => {
    if (token) {
        const expirationDate = (jwt.decode(token) as any).exp;
        const tokenHash = generateTokenHash(token);
        await setAsync(tokenHash, '');
        blacklist.expireat(tokenHash, expirationDate);
    }
};

export const hasToken = async (token: any) => {
    const tokenHash = generateTokenHash(token);
    const result = await existsAsync(tokenHash);
    return result === 1;
};

export const verifyBlacklistForToken = async (token: any) => {
    const isTokenBlacklisted = await hasToken(token);
    if (isTokenBlacklisted) throw new jwt.JsonWebTokenError('Token invalidated by logout');
};
