const cache = require('memory-cache');

// Cache middleware for GET requests
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedBody = cache.get(key);

    if (cachedBody) {
      res.setHeader('X-Cache', 'HIT');
      return res.send(cachedBody);
    }

    // Override res.send to cache the response
    const originalSend = res.send;
    res.send = function(body) {
      if (res.statusCode === 200) {
        cache.put(key, body, duration * 1000);
        res.setHeader('X-Cache', 'MISS');
      }
      originalSend.call(this, body);
    };

    next();
  };
};

// Clear cache for specific routes
const clearCache = (pattern) => {
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.del(key);
    }
  });
};

// Clear all cache
const clearAllCache = () => {
  cache.clear();
};

// Get cache statistics
const getCacheStats = () => {
  return {
    size: cache.size(),
    keys: cache.keys(),
    hits: cache.hits,
    misses: cache.misses
  };
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearAllCache,
  getCacheStats,
}; 