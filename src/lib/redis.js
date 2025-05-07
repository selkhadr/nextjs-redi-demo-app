import Redis from 'ioredis';

// Initialize Redis client
let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  // Default to localhost in development
  redis = new Redis();
}

// Helper function to get data from Redis cache or fetch from API
export async function fetchFromCache(key, fetchFunction, ttl = 3600) {
  try {
    // Try to get data from cache
    const cachedData = await redis.get(key);
    
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      return JSON.parse(cachedData);
    }
    
    console.log(`Cache miss for key: ${key}, fetching from API...`);
    // If not in cache, fetch data
    const data = await fetchFunction();
    
    // Save to cache with TTL (in seconds)
    await redis.setex(key, ttl, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error('Error fetching data from cache:', error);
    // If Redis fails, fall back to direct API call
    return fetchFunction();
  }
}

export default redis;