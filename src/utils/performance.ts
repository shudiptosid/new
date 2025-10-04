/**
 * Performance Utilities
 * Helper functions for optimizing runtime performance
 */

/**
 * Debounce function to limit function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function to limit execution rate
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Request Idle Callback polyfill
 */
export const requestIdleCallback =
  (typeof window !== "undefined" && window.requestIdleCallback) ||
  function (cb: IdleRequestCallback) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1);
  };

/**
 * Cancel Idle Callback polyfill
 */
export const cancelIdleCallback =
  (typeof window !== "undefined" && window.cancelIdleCallback) ||
  function (id: number) {
    clearTimeout(id);
  };

/**
 * Measure component render time
 */
export const measureRenderTime = (componentName: string) => {
  if (typeof window === "undefined" || !window.performance) return;

  const startMark = `${componentName}-start`;
  const endMark = `${componentName}-end`;
  const measureName = `${componentName}-render`;

  return {
    start: () => performance.mark(startMark),
    end: () => {
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
      const measure = performance.getEntriesByName(measureName)[0];
      console.log(
        `${componentName} render time:`,
        measure.duration.toFixed(2),
        "ms"
      );
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);
    },
  };
};

/**
 * Detect if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get connection quality
 */
export const getConnectionQuality = (): "fast" | "slow" | "offline" => {
  if (typeof navigator === "undefined" || !("connection" in navigator)) {
    return "fast";
  }

  const connection = (navigator as any).connection;

  if (!navigator.onLine) return "offline";

  if (connection?.effectiveType === "4g") return "fast";
  if (connection?.effectiveType === "3g") return "slow";
  if (connection?.saveData) return "slow";

  return "fast";
};
