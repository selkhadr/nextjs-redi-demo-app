import Redis from 'ioredis';

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  redis = new Redis();
}

export async function fetchFromCache(key, fetchFunction, ttl = 3600) {
  try {
    const cachedData = await redis.get(key);
    
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      return JSON.parse(cachedData);
    }
    
    console.log(`Cache miss for key: ${key}, fetching from API...`);
    const data = await fetchFunction();
    
    await redis.setex(key, ttl, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error('Error fetching data from cache:', error);
    return fetchFunction();
  }
}

export default redis;

