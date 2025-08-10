const cache = require('memory-cache');

// Enhanced cache middleware with better performance
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create a more specific cache key including query parameters
    const cacheKey = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
      // Set cache headers for better debugging
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Key', cacheKey);
      res.setHeader('X-Cache-TTL', duration);
      
      // Increment cache hits
      if (!cache.stats) cache.stats = { hits: 0, misses: 0 };
      cache.stats.hits++;
      
      return res.send(cachedResponse);
    }

    // Override res.send to cache the response
    const originalSend = res.send;
    res.send = function(body) {
      if (res.statusCode === 200 && body) {
        // Only cache successful responses with content
        cache.put(cacheKey, body, duration * 1000);
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('X-Cache-Key', cacheKey);
        res.setHeader('X-Cache-TTL', duration);
        
        // Increment cache misses
        if (!cache.stats) cache.stats = { hits: 0, misses: 0 };
        cache.stats.misses++;
      }
      originalSend.call(this, body);
    };

    next();
  };
};

// Clear cache for specific routes with pattern matching
const clearCache = (pattern) => {
  const keys = cache.keys();
  let clearedCount = 0;
  
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.del(key);
      clearedCount++;
    }
  });
  
  return { clearedCount, totalKeys: keys.length };
};

// Clear all cache
const clearAllCache = () => {
  const keyCount = cache.size();
  cache.clear();
  return { clearedCount: keyCount };
};

// Get enhanced cache statistics
const getCacheStats = () => {
  const keys = cache.keys();
  const stats = cache.stats || { hits: 0, misses: 0 };
  
  return {
    size: cache.size(),
    keyCount: keys.length,
    hits: stats.hits,
    misses: stats.misses,
    hitRate: stats.hits + stats.misses > 0 ? (stats.hits / (stats.hits + stats.misses) * 100).toFixed(2) + '%' : '0%',
    memoryUsage: process.memoryUsage(),
    keys: keys.slice(0, 10) // Show first 10 keys for debugging
  };
};

// Cache warming function for frequently accessed data
const warmCache = async (key, data, duration = 300) => {
  cache.put(key, data, duration * 1000);
  return { key, duration, warmed: true };
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearAllCache,
  getCacheStats,
  warmCache,
}; 