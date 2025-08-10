const logger = require('./logger');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      responseTimes: [],
      memoryUsage: [],
      activeConnections: 0,
      totalRequests: 0,
      errors: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
    
    this.startTime = Date.now();
    this.maxMetrics = 1000; // Keep last 1000 metrics
  }

  // Track response time
  trackResponseTime(method, url, statusCode, duration) {
    const metric = {
      timestamp: Date.now(),
      method,
      url,
      statusCode,
      duration,
      memoryUsage: process.memoryUsage()
    };

    this.metrics.responseTimes.push(metric);
    this.metrics.totalRequests++;

    // Keep only recent metrics
    if (this.metrics.responseTimes.length > this.maxMetrics) {
      this.metrics.responseTimes.shift();
    }

    // Log slow responses
    if (duration > 1000) {
      logger.warn(`Slow response detected: ${method} ${url} - ${duration}ms`);
    }

    // Log errors
    if (statusCode >= 400) {
      this.metrics.errors++;
    }
  }

  // Track cache performance
  trackCacheHit() {
    this.metrics.cacheHits++;
  }

  trackCacheMiss() {
    this.metrics.cacheMisses++;
  }

  // Get performance statistics
  getStats() {
    const responseTimes = this.metrics.responseTimes;
    const uptime = Date.now() - this.startTime;

    if (responseTimes.length === 0) {
      return {
        uptime,
        totalRequests: this.metrics.totalRequests,
        errors: this.metrics.errors,
        cacheHitRate: 0,
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0
      };
    }

    const durations = responseTimes.map(m => m.duration).sort((a, b) => a - b);
    const avgResponseTime = durations.reduce((a, b) => a + b, 0) / durations.length;
    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);

    const cacheHitRate = this.metrics.cacheHits + this.metrics.cacheMisses > 0 
      ? (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100).toFixed(2)
      : 0;

    return {
      uptime: Math.floor(uptime / 1000), // in seconds
      totalRequests: this.metrics.totalRequests,
      errors: this.metrics.errors,
      errorRate: ((this.metrics.errors / this.metrics.totalRequests) * 100).toFixed(2) + '%',
      cacheHitRate: cacheHitRate + '%',
      averageResponseTime: Math.round(avgResponseTime) + 'ms',
      p95ResponseTime: durations[p95Index] + 'ms',
      p99ResponseTime: durations[p99Index] + 'ms',
      requestsPerSecond: (this.metrics.totalRequests / (uptime / 1000)).toFixed(2),
      memoryUsage: process.memoryUsage()
    };
  }

  // Reset metrics
  reset() {
    this.metrics = {
      responseTimes: [],
      memoryUsage: [],
      activeConnections: 0,
      totalRequests: 0,
      errors: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
    this.startTime = Date.now();
    logger.info('Performance metrics reset');
  }

  // Log performance summary
  logSummary() {
    const stats = this.getStats();
    logger.info('Performance Summary:', stats);
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Middleware to track response times
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    performanceMonitor.trackResponseTime(
      req.method, 
      req.url, 
      res.statusCode, 
      duration
    );
  });
  
  next();
};

module.exports = {
  performanceMonitor,
  performanceMiddleware
};
