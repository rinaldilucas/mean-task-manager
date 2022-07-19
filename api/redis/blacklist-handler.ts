import { promisify } from 'util';
import { createHash } from 'crypto';
import blacklist from './blacklist';
import jwt from 'jsonwebtoken';
const existsAsync = promisify(blacklist.exists).bind(blacklist);
const setAsync = promisify(blacklist.set).bind(blacklist);

const generateTokenHash = (token) => createHash('sha256').update(token).digest('hex');

export const add = async (token) => {
    if (token) {
        const expirationDate = jwt.decode(token).exp;
        const tokenHash = generateTokenHash(token);
        await setAsync(tokenHash, '');
        blacklist.expireat(tokenHash, expirationDate);
    }
};

export const hasToken = async (token) => {
    const tokenHash = generateTokenHash(token);
    const result = await existsAsync(tokenHash);
    return result === 1;
};

export const verifyBlacklistForToken = async (token) => {
    const isTokenBlacklisted = await hasToken(token);
    if (isTokenBlacklisted) throw new jwt.JsonWebTokenError('Token invalidated by logout.');
};
