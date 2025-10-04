/**
 * Performance Testing Script
 * Run this in the browser console to measure performance
 */

(function performanceTest() {
  console.log("🚀 Circuit Crafters - Performance Test Starting...\n");

  // 1. Check if Service Worker is active
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      console.log("✅ Service Worker Status:");
      if (registrations.length > 0) {
        console.log(`   Active: ${registrations[0].active ? "Yes" : "No"}`);
        console.log(`   Scope: ${registrations[0].scope}`);
      } else {
        console.log("   ⚠️ No service worker registered");
      }
    });
  }

  // 2. Measure Performance Metrics
  if (window.performance) {
    const perfData = window.performance.timing;
    const navigationStart = perfData.navigationStart;

    setTimeout(() => {
      console.log("\n📊 Performance Metrics:");

      // DNS Lookup
      const dnsTime = perfData.domainLookupEnd - perfData.domainLookupStart;
      console.log(`   DNS Lookup: ${dnsTime}ms`);

      // TCP Connection
      const tcpTime = perfData.connectEnd - perfData.connectStart;
      console.log(`   TCP Connection: ${tcpTime}ms`);

      // Time to First Byte (TTFB)
      const ttfb = perfData.responseStart - perfData.requestStart;
      console.log(`   TTFB: ${ttfb}ms`);

      // DOM Loading
      const domLoad = perfData.domContentLoadedEventEnd - navigationStart;
      console.log(`   DOM Content Loaded: ${domLoad}ms`);

      // Page Load Complete
      const pageLoad = perfData.loadEventEnd - navigationStart;
      console.log(`   Page Load Complete: ${pageLoad}ms`);

      // Resource Loading
      if (window.performance.getEntriesByType) {
        const resources = window.performance.getEntriesByType("resource");
        console.log(`\n📦 Resources Loaded: ${resources.length}`);

        const totalSize = resources.reduce((acc, resource) => {
          return acc + (resource.transferSize || 0);
        }, 0);
        console.log(
          `   Total Transfer Size: ${(totalSize / 1024).toFixed(2)} KB`
        );

        // Group by type
        const byType = resources.reduce((acc, resource) => {
          const name = resource.name.split(".").pop().split("?")[0];
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});
        console.log("   Resources by type:", byType);
      }
    }, 2000);
  }

  // 3. Check Cache API
  if ("caches" in window) {
    caches.keys().then((cacheNames) => {
      console.log("\n💾 Cache Status:");
      console.log(`   Active Caches: ${cacheNames.length}`);
      cacheNames.forEach((cacheName) => {
        console.log(`   - ${cacheName}`);
        caches.open(cacheName).then((cache) => {
          cache.keys().then((keys) => {
            console.log(`     Cached items: ${keys.length}`);
          });
        });
      });
    });
  }

  // 4. Memory Usage (if available)
  if (performance.memory) {
    console.log("\n🧠 Memory Usage:");
    console.log(
      `   Used: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`
    );
    console.log(
      `   Total: ${(performance.memory.totalJSHeapSize / 1048576).toFixed(
        2
      )} MB`
    );
    console.log(
      `   Limit: ${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(
        2
      )} MB`
    );
  }

  // 5. Connection Information
  if (navigator.connection) {
    console.log("\n📡 Network Information:");
    console.log(`   Type: ${navigator.connection.effectiveType || "Unknown"}`);
    console.log(`   Downlink: ${navigator.connection.downlink || "N/A"} Mbps`);
    console.log(`   RTT: ${navigator.connection.rtt || "N/A"} ms`);
    console.log(
      `   Save Data: ${navigator.connection.saveData ? "Yes" : "No"}`
    );
  }

  // 6. Check for Web Vitals
  if ("PerformanceObserver" in window) {
    console.log("\n⚡ Web Vitals:");

    // LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`   LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      console.log("   LCP: Not available");
    }

    // FID
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`   FID: ${entry.processingStart - entry.startTime}ms`);
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      console.log("   FID: Waiting for user input");
    }

    // CLS
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log(`   CLS: ${clsValue.toFixed(4)}`);
          }
        });
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      console.log("   CLS: Not available");
    }
  }

  // 7. Bundle Analysis
  setTimeout(() => {
    console.log("\n📦 Bundle Analysis:");
    const scripts = document.querySelectorAll("script[src]");
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    console.log(`   JavaScript files: ${scripts.length}`);
    console.log(`   CSS files: ${styles.length}`);

    console.log("\n✅ Performance Test Complete!");
    console.log("Run this script again after navigating to see improvements.");
  }, 3000);
})();
