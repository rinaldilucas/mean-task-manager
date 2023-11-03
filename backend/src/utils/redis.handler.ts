import redis from 'redis';

let redisHost = process?.env?.REDIS_HOST;
const environment = process?.env?.NODE_ENV;

export default redis.createClient({
  url: environment === 'PRODUCTION' ? redisHost : '127.0.0.1',
});
