/**
 * usePerformanceMonitor Hook
 * Monitor and report web vitals and performance metrics
 */

import { useEffect } from "react";

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

export const usePerformanceMonitor = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const reportMetric = (metric: PerformanceMetrics) => {
      // Send to analytics in production
      if (import.meta.env.PROD) {
        console.log("Performance Metric:", metric);
      }
    };

    // Observe Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          reportMetric({ lcp: lastEntry.renderTime || lastEntry.loadTime });
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

        // Observe First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            reportMetric({ fid: entry.processingStart - entry.startTime });
          });
        });
        fidObserver.observe({ entryTypes: ["first-input"] });

        // Observe Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              reportMetric({ cls: clsValue });
            }
          });
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (error) {
        console.error("Performance Observer error:", error);
      }
    }

    // Report navigation timing metrics
    if (window.performance && window.performance.timing) {
      window.addEventListener("load", () => {
        setTimeout(() => {
          const timing = window.performance.timing;
          const ttfb = timing.responseStart - timing.requestStart;
          const fcp = timing.domContentLoadedEventEnd - timing.navigationStart;

          reportMetric({ ttfb, fcp });
        }, 0);
      });
    }
  }, [enabled]);
};

export default usePerformanceMonitor;
