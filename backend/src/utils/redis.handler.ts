import redis from 'redis';

export default redis.createClient({
  url: process?.env?.REDIS_HOST,
});
