const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const CONCURRENT_REQUESTS = 10;
const TOTAL_REQUESTS = 100;

class PerformanceTester {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const start = Date.now();
    try {
      const response = await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        data,
        timeout: 10000,
      });
      const duration = Date.now() - start;
      return { success: true, status: response.status, duration };
    } catch (error) {
      const duration = Date.now() - start;
      return {
        success: false,
        status: error.response?.status || 'timeout',
        duration,
        error: error.message,
      };
    }
  }

  async testEndpoint(endpoint, method = 'GET', data = null) {
    console.log(`\n🧪 Testing ${method} ${endpoint}...`);

    const promises = [];
    for (let i = 0; i < TOTAL_REQUESTS; i++) {
      promises.push(this.makeRequest(endpoint, method, data));
    }

    const results = await Promise.all(promises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (successful.length > 0) {
      const durations = successful.map(r => r.duration);
      const avgDuration =
        durations.reduce((a, b) => a + b, 0) / durations.length;
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);

      // Calculate percentiles
      const sortedDurations = durations.sort((a, b) => a - b);
      const p95Index = Math.floor(sortedDurations.length * 0.95);
      const p99Index = Math.floor(sortedDurations.length * 0.99);

      console.log(`✅ Success: ${successful.length}/${TOTAL_REQUESTS}`);
      console.log(`📊 Duration Stats:`);
      console.log(`   Average: ${avgDuration.toFixed(2)}ms`);
      console.log(`   Min: ${minDuration}ms`);
      console.log(`   Max: ${maxDuration}ms`);
      console.log(`   P95: ${sortedDurations[p95Index]}ms`);
      console.log(`   P99: ${sortedDurations[p99Index]}ms`);
    }

    if (failed.length > 0) {
      console.log(`❌ Failed: ${failed.length}/${TOTAL_REQUESTS}`);
      const errorCounts = {};
      failed.forEach(r => {
        errorCounts[r.status] = (errorCounts[r.status] || 0) + 1;
      });
      console.log(`   Errors:`, errorCounts);
    }

    return { successful, failed };
  }

  async runTests() {
    console.log('🚀 Starting Performance Tests...');
    console.log(
      `📈 Testing with ${CONCURRENT_REQUESTS} concurrent requests, ${TOTAL_REQUESTS} total per endpoint`
    );

    const tests = [
      { endpoint: '/products', method: 'GET' },
      { endpoint: '/products?page=1&limit=10', method: 'GET' },
      { endpoint: '/categories', method: 'GET' },
      { endpoint: '/products/search?q=organic', method: 'GET' },
    ];

    for (const test of tests) {
      await this.testEndpoint(test.endpoint, test.method, test.data);
    }

    const totalTime = Date.now() - this.startTime;
    console.log(`\n🎯 All tests completed in ${totalTime}ms`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runTests().catch(console.error);
}

module.exports = PerformanceTester;
