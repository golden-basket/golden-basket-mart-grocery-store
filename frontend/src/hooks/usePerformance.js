import { useEffect, useCallback, useState } from 'react';

export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    fcp: null, // First Contentful Paint
    lcp: null, // Largest Contentful Paint
    fid: null, // First Input Delay
    cls: null, // Cumulative Layout Shift
    ttfb: null, // Time to First Byte
    fmp: null, // First Meaningful Paint
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connection, setConnection] = useState(null);

  // Get network information
  useEffect(() => {
    if ('connection' in navigator) {
      setConnection(navigator.connection);

      const updateConnection = () => {
        setConnection(navigator.connection);
      };

      navigator.connection.addEventListener('change', updateConnection);
      return () =>
        navigator.connection.removeEventListener('change', updateConnection);
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Measure First Contentful Paint
  const measureFCP = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const fcp = entries.find(
          entry => entry.name === 'first-contentful-paint'
        );
        if (fcp) {
          setMetrics(prev => ({ ...prev, fcp: fcp.startTime }));
          observer.disconnect();
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    }
  }, []);

  // Measure Largest Contentful Paint
  const measureLCP = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        if (lcp) {
          setMetrics(prev => ({ ...prev, lcp: lcp.startTime }));
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }, []);

  // Measure First Input Delay
  const measureFID = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            setMetrics(prev => ({ ...prev, fid }));
          }
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    }
  }, []);

  // Measure Cumulative Layout Shift
  const measureCLS = useCallback(() => {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      let clsEntries = [];

      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        }

        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }, []);

  // Measure Time to First Byte
  const measureTTFB = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            const ttfb = entry.responseStart - entry.requestStart;
            setMetrics(prev => ({ ...prev, ttfb }));
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
    }
  }, []);

  // Measure First Meaningful Paint
  const measureFMP = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-meaningful-paint') {
            setMetrics(prev => ({ ...prev, fmp: entry.startTime }));
          }
        });
      });

      observer.observe({ entryTypes: ['paint'] });
    }
  }, []);

  // Get performance score based on metrics
  const getPerformanceScore = useCallback(() => {
    let score = 100;

    // FCP scoring (0-2.5s = good, 2.5-4s = needs improvement, >4s = poor)
    if (metrics.fcp) {
      if (metrics.fcp > 4000) score -= 30;
      else if (metrics.fcp > 2500) score -= 15;
    }

    // LCP scoring (0-2.5s = good, 2.5-4s = needs improvement, >4s = poor)
    if (metrics.lcp) {
      if (metrics.lcp > 4000) score -= 25;
      else if (metrics.lcp > 2500) score -= 10;
    }

    // FID scoring (0-100ms = good, 100-300ms = needs improvement, >300ms = poor)
    if (metrics.fid) {
      if (metrics.fid > 300) score -= 20;
      else if (metrics.fid > 100) score -= 10;
    }

    // CLS scoring (0-0.1 = good, 0.1-0.25 = needs improvement, >0.25 = poor)
    if (metrics.cls) {
      if (metrics.cls > 0.25) score -= 25;
      else if (metrics.cls > 0.1) score -= 10;
    }

    return Math.max(0, score);
  }, [metrics]);

  // Get performance grade
  const getPerformanceGrade = useCallback(() => {
    const score = getPerformanceScore();
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }, [getPerformanceScore]);

  // Get network quality
  const getNetworkQuality = useCallback(() => {
    if (!connection) return 'unknown';

    if (connection.effectiveType === '4g') return 'excellent';
    if (connection.effectiveType === '3g') return 'good';
    if (connection.effectiveType === '2g') return 'poor';
    if (connection.effectiveType === 'slow-2g') return 'very-poor';

    return 'unknown';
  }, [connection]);

  // Start performance monitoring
  useEffect(() => {
    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();
    measureTTFB();
    measureFMP();
  }, [measureFCP, measureLCP, measureFID, measureCLS, measureTTFB, measureFMP]);

  // Log performance metrics
  const logPerformanceMetrics = useCallback(() => {
    const score = getPerformanceScore();
    const grade = getPerformanceGrade();
    const networkQuality = getNetworkQuality();

    return { score, grade, networkQuality, metrics };
  }, [
    metrics,
    getPerformanceScore,
    getPerformanceGrade,
    getNetworkQuality,
    isOnline,
  ]);

  // Send performance data to analytics
  const sendPerformanceData = useCallback(
    async (endpoint = '/api/performance') => {
      try {
        const performanceData = logPerformanceMetrics();

        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...performanceData,
          }),
        });
      } catch (error) {
        console.error('Failed to send performance data:', error);
      }
    },
    [logPerformanceMetrics]
  );

  // Monitor long tasks
  const monitorLongTasks = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.duration > 50) {
            // Tasks longer than 50ms
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
            });
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
    }
  }, []);

  // Start long task monitoring
  useEffect(() => {
    monitorLongTasks();
  }, [monitorLongTasks]);

  return {
    metrics,
    isOnline,
    connection,
    performanceScore: getPerformanceScore(),
    performanceGrade: getPerformanceGrade(),
    networkQuality: getNetworkQuality(),
    logPerformanceMetrics,
    sendPerformanceData,
  };
};

export default usePerformance;
