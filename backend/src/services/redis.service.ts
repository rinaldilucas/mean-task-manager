import { createHash } from 'crypto';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import { promisify } from 'util';

class RedisService {
  private redisClient: Redis;

  constructor() {
    dotenv.config();
    this.redisClient = new Redis(process.env.REDIS_HOST as string);
  }

  private async redisSet(key: string, value: string, expiration: number): Promise<any> {
    const redisSetFunction = promisify(this.redisClient.setex).bind(this.redisClient);
    return redisSetFunction(key, expiration, value);
  }

  private async redisGet(key: string): Promise<any> {
    const redisGetFunction = promisify(this.redisClient.get).bind(this.redisClient);
    return redisGetFunction(key);
  }

  private generateTokenHash(token: any): any {
    return createHash('sha256').update(token).digest('hex');
  }

  private async hasToken(token: string): Promise<any> {
    const tokenHash = this.generateTokenHash(token);
    const result = await this.redisGet(tokenHash);
    return !!result;
  }

  async addToBlacklist(token: string): Promise<any> {
    const expiration = Number(process.env.JWT_ACCESS_TIME);
    const keyHash = this.generateTokenHash(token);
    return this.redisSet(keyHash, token, expiration);
  }

  async findBlacklistedToken(token: string): Promise<any> {
    const isTokenBlacklisted = await this.hasToken(token);
    return isTokenBlacklisted;
  }
}

export default new RedisService();
