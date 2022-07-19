import redis from 'redis';

export default redis.createClient({ prefix: 'blacklist:' });
