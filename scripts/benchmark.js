// scripts/benchmark.js
// A simple script to benchmark the API with and without Redis caching

const fetch = require('node-fetch');
const Redis = require('ioredis');

// Initialize Redis client for cleanup
const redis = new Redis();

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const ITERATIONS = 10;
const ENDPOINTS = [
  '/posts',
  '/posts/1',
  '/posts/2',
  '/posts/3',
];

async function clearCache() {
  console.log('Clearing Redis cache...');
  await redis.flushall();
  console.log('Cache cleared.');
}

async function measureResponse(url, iteration, withCache) {
  const start = process.hrtime();
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    await response.json(); // Make sure to consume the response
    
    const end = process.hrtime(start);
    const timeInMs = (end[0] * 1000 + end[1] / 1000000).toFixed(2);
    
    console.log(`[${withCache ? 'Cached' : 'Uncached'}] Iteration ${iteration + 1}: ${url} - ${timeInMs}ms`);
    return parseFloat(timeInMs);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function runBenchmark() {
  const results = {
    uncached: {},
    cached: {}
  };
  
  // First run - without cache
  console.log('\n--- RUNNING UNCACHED TESTS ---\n');
  await clearCache();
  
  for (const endpoint of ENDPOINTS) {
    const url = `${API_BASE_URL}${endpoint}`;
    results.uncached[endpoint] = [];
    
    for (let i = 0; i < ITERATIONS; i++) {
      const time = await measureResponse(url, i, false);
      if (time) results.uncached[endpoint].push(time);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Second run - with cache
  console.log('\n--- RUNNING CACHED TESTS ---\n');
  // First request will populate the cache
  for (const endpoint of ENDPOINTS) {
    const url = `${API_BASE_URL}${endpoint}`;
    await fetch(url); // Warm up the cache
  }
  
  // Then measure with cache
  for (const endpoint of ENDPOINTS) {
    const url = `${API_BASE_URL}${endpoint}`;
    results.cached[endpoint] = [];
    
    for (let i = 0; i < ITERATIONS; i++) {
      const time = await measureResponse(url, i, true);
      if (time) results.cached[endpoint].push(time);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Print summary
  console.log('\n--- BENCHMARK RESULTS ---\n');
  for (const endpoint of ENDPOINTS) {
    const uncachedAvg = results.uncached[endpoint].reduce((sum, time) => sum + time, 0) / results.uncached[endpoint].length;
    const cachedAvg = results.cached[endpoint].reduce((sum, time) => sum + time, 0) / results.cached[endpoint].length;
    const improvement = ((uncachedAvg - cachedAvg) / uncachedAvg * 100).toFixed(2);
    
    console.log(`Endpoint: ${endpoint}`);
    console.log(`  Average Uncached: ${uncachedAvg.toFixed(2)}ms`);
    console.log(`  Average Cached: ${cachedAvg.toFixed(2)}ms`);
    console.log(`  Improvement: ${improvement}%`);
    console.log();
  }
  
  // Close Redis connection
  redis.disconnect();
}

// Run the benchmark
runBenchmark().catch(console.error);

