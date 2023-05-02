import { createClient } from 'redis';

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
}

export default new RedisService();
