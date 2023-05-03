import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { createClient } from 'redis';

const generateTokenHash = (token: any) => createHash('sha256').update(token).digest('hex');

class RedisService {
    client: any;

    constructor () {
        this.client = createClient();
    }

    async set ({ key, value, timeType, time }) {
        await this.client.connect();
        await this.client.set(key, value, timeType, time);
        await this.client.disconnect();
    }

    async get (key) {
        await this.client.connect();
        const result = await this.client.get(key);
        await this.client.disconnect();
        return result;
    }

    async addToBlacklist (token: string) {
        if (token) {
            const expirationDate = (jwt.decode(token) as any).exp;
            const tokenHash = generateTokenHash(token);
            this.set({ key: tokenHash, value: 1, timeType: 'EX', time: expirationDate });
        }
    }

    async verifyBlacklistForToken (token: any) {
        const isTokenBlacklisted = await this.hasToken(token);
        if (isTokenBlacklisted) return true;
    }

    async hasToken (token: any) {
        const tokenHash = generateTokenHash(token);
        const result = await this.get(tokenHash);
        return result === '1';
    }
}

export default new RedisService();
