// Bundle Performance Monitoring Utility
// Tracks main-thread work, bundle size, and loading performance

class BundlePerformanceMonitor {
  constructor() {
    this.metrics = {
      bundleSize: null,
      mainThreadWork: null,
      fcp: null,
      tbt: null,
      loadingTimes: {},
      chunkLoading: [],
      jsHeapSize: null,
      networkTransfers: [],
    };

    this.observers = [];
    this.startTime = performance.now();
    this.isMonitoring = false;
  }

  // Start comprehensive performance monitoring
  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log("🚀 Bundle Performance Monitoring Started");

    this.measureInitialMetrics();
    this.setupPerformanceObservers();
    this.monitorChunkLoading();
    this.trackMemoryUsage();
    this.measureNetworkTransfers();

    // Report metrics after page load
    if (document.readyState === "complete") {
      setTimeout(() => this.generateReport(), 1000);
    } else {
      window.addEventListener("load", () => {
        setTimeout(() => this.generateReport(), 1000);
      });
    }
  }

  // Measure initial bundle and loading metrics
  measureInitialMetrics() {
    // Get navigation timing
    const navigation = performance.getEntriesByType("navigation")[0];
    if (navigation) {
      this.metrics.loadingTimes = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        domProcessing: navigation.domComplete - navigation.domLoading,
        totalLoad: navigation.loadEventEnd - navigation.navigationStart,
      };
    }

    // Measure JS heap size
    if (performance.memory) {
      this.metrics.jsHeapSize = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      };
    }
  }

  // Setup Performance Observers for Core Web Vitals
  setupPerformanceObservers() {
    // First Contentful Paint (FCP)
    this.observeMetric("first-contentful-paint", (entries) => {
      const fcp = entries[entries.length - 1];
      this.metrics.fcp = fcp.startTime;
    });

    // Largest Contentful Paint (LCP) - for reference
    this.observeMetric("largest-contentful-paint", (entries) => {
      const lcp = entries[entries.length - 1];
      this.metrics.lcp = lcp.startTime;
    });

    // Long Tasks (for TBT calculation)
    this.observeMetric("longtask", (entries) => {
      entries.forEach((task) => {
        const blockingTime = Math.max(0, task.duration - 50);
        if (!this.metrics.tbt) this.metrics.tbt = 0;
        this.metrics.tbt += blockingTime;
      });
    });

    // Measure script loading performance
    this.observeMetric("resource", (entries) => {
      entries.forEach((resource) => {
        if (
          resource.initiatorType === "script" ||
          resource.name.endsWith(".js")
        ) {
          this.trackJSResource(resource);
        }
      });
    });
  }

  // Observe specific performance metrics
  observeMetric(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Performance observer for ${type} not supported:`, error);
    }
  }

  // Track JavaScript resource loading
  trackJSResource(resource) {
    const jsResource = {
      name: resource.name,
      size: resource.transferSize,
      compressed: resource.encodedBodySize,
      uncompressed: resource.decodedBodySize,
      loadTime: resource.responseEnd - resource.startTime,
      cacheHit: resource.transferSize === 0,
      type: this.categorizeJSResource(resource.name),
    };

    this.metrics.networkTransfers.push(jsResource);
  }

  // Categorize JS resources
  categorizeJSResource(resourceName) {
    if (resourceName.includes("vendor")) return "vendor";
    if (resourceName.includes("chunk")) return "chunk";
    if (resourceName.includes("index")) return "main";
    if (resourceName.includes("runtime")) return "runtime";
    return "other";
  }

  // Monitor dynamic chunk loading
  monitorChunkLoading() {
    // Intercept dynamic imports
    const originalImport = window.__import || window.import;
    if (originalImport) {
      window.__import = async (specifier) => {
        const startTime = performance.now();
        try {
          const result = await originalImport(specifier);
          const loadTime = performance.now() - startTime;

          this.metrics.chunkLoading.push({
            specifier,
            loadTime,
            success: true,
            timestamp: Date.now(),
          });

          return result;
        } catch (error) {
          this.metrics.chunkLoading.push({
            specifier,
            loadTime: performance.now() - startTime,
            success: false,
            error: error.message,
            timestamp: Date.now(),
          });
          throw error;
        }
      };
    }
  }

  // Track memory usage over time
  trackMemoryUsage() {
    if (!performance.memory) return;

    const trackMemory = () => {
      const memoryInfo = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        timestamp: Date.now(),
      };

      if (!this.metrics.memorySnapshots) {
        this.metrics.memorySnapshots = [];
      }

      this.metrics.memorySnapshots.push(memoryInfo);

      // Continue tracking for 30 seconds
      if (performance.now() - this.startTime < 30000) {
        setTimeout(trackMemory, 2000);
      }
    };

    trackMemory();
  }

  // Measure network transfer efficiency
  measureNetworkTransfers() {
    const resources = performance.getEntriesByType("resource");
    const jsResources = resources.filter(
      (r) => r.initiatorType === "script" || r.name.endsWith(".js")
    );

    this.metrics.bundleSize = {
      total: jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      uncompressed: jsResources.reduce(
        (sum, r) => sum + (r.decodedBodySize || 0),
        0
      ),
      compression: this.calculateCompressionRatio(jsResources),
      chunkCount: jsResources.length,
    };
  }

  // Calculate compression ratio
  calculateCompressionRatio(resources) {
    const total = resources.reduce(
      (sum, r) => sum + (r.decodedBodySize || 0),
      0
    );
    const compressed = resources.reduce(
      (sum, r) => sum + (r.transferSize || 0),
      0
    );

    return total > 0 ? (((total - compressed) / total) * 100).toFixed(1) : 0;
  }

  // Calculate main thread work time
  calculateMainThreadWork() {
    const longTasks = performance.getEntriesByType("longtask");
    return longTasks.reduce((total, task) => total + task.duration, 0);
  }

  // Generate comprehensive performance report
  generateReport() {
    this.metrics.mainThreadWork = this.calculateMainThreadWork();

    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      analysis: this.analyzePerformance(),
      recommendations: this.generateRecommendations(),
    };

    console.group("📊 Bundle Performance Report");
    this.logMetrics();
    this.logAnalysis(report.analysis);
    this.logRecommendations(report.recommendations);
    console.groupEnd();

    return report;
  }

  // Log performance metrics
  logMetrics() {
    const { bundleSize, mainThreadWork, fcp, tbt, loadingTimes } = this.metrics;

    console.log("🎯 Core Metrics:");
    if (bundleSize) {
      console.log(
        `📦 Bundle Size: ${(bundleSize.total / 1024).toFixed(1)}KB (${
          bundleSize.chunkCount
        } chunks)`
      );
      console.log(`🗜️ Compression: ${bundleSize.compression}%`);
    }

    if (mainThreadWork) {
      console.log(`⚡ Main Thread Work: ${mainThreadWork.toFixed(1)}ms`);
    }

    if (fcp) {
      console.log(`🎨 First Contentful Paint: ${fcp.toFixed(1)}ms`);
    }

    if (tbt) {
      console.log(`🚫 Total Blocking Time: ${tbt.toFixed(1)}ms`);
    }

    if (loadingTimes.totalLoad) {
      console.log(`📈 Total Load Time: ${loadingTimes.totalLoad.toFixed(1)}ms`);
    }
  }

  // Analyze performance and provide insights
  analyzePerformance() {
    const analysis = {
      bundleScore: "unknown",
      mainThreadScore: "unknown",
      fcpScore: "unknown",
      tbtScore: "unknown",
      overall: "unknown",
    };

    // Bundle size analysis
    if (this.metrics.bundleSize) {
      const sizeKB = this.metrics.bundleSize.total / 1024;
      if (sizeKB < 500) analysis.bundleScore = "good";
      else if (sizeKB < 1000) analysis.bundleScore = "fair";
      else analysis.bundleScore = "poor";
    }

    // Main thread work analysis
    if (this.metrics.mainThreadWork) {
      if (this.metrics.mainThreadWork < 3000) analysis.mainThreadScore = "good";
      else if (this.metrics.mainThreadWork < 6000)
        analysis.mainThreadScore = "fair";
      else analysis.mainThreadScore = "poor";
    }

    // FCP analysis
    if (this.metrics.fcp) {
      if (this.metrics.fcp < 1800) analysis.fcpScore = "good";
      else if (this.metrics.fcp < 3000) analysis.fcpScore = "fair";
      else analysis.fcpScore = "poor";
    }

    // TBT analysis
    if (this.metrics.tbt) {
      if (this.metrics.tbt < 200) analysis.tbtScore = "good";
      else if (this.metrics.tbt < 600) analysis.tbtScore = "fair";
      else analysis.tbtScore = "poor";
    }

    // Overall score
    const scores = Object.values(analysis).filter(
      (score) => score !== "unknown"
    );
    const goodCount = scores.filter((score) => score === "good").length;
    const fairCount = scores.filter((score) => score === "fair").length;

    if (
      goodCount > fairCount &&
      scores.filter((score) => score === "poor").length === 0
    ) {
      analysis.overall = "good";
    } else if (scores.filter((score) => score === "poor").length === 0) {
      analysis.overall = "fair";
    } else {
      analysis.overall = "poor";
    }

    return analysis;
  }

  // Log performance analysis
  logAnalysis(analysis) {
    console.log("🔍 Performance Analysis:");
    console.log(
      `Bundle Score: ${this.getScoreEmoji(analysis.bundleScore)} ${
        analysis.bundleScore
      }`
    );
    console.log(
      `Main Thread Score: ${this.getScoreEmoji(analysis.mainThreadScore)} ${
        analysis.mainThreadScore
      }`
    );
    console.log(
      `FCP Score: ${this.getScoreEmoji(analysis.fcpScore)} ${analysis.fcpScore}`
    );
    console.log(
      `TBT Score: ${this.getScoreEmoji(analysis.tbtScore)} ${analysis.tbtScore}`
    );
    console.log(
      `Overall: ${this.getScoreEmoji(analysis.overall)} ${analysis.overall}`
    );
  }

  // Generate optimization recommendations
  generateRecommendations() {
    const recommendations = [];

    if (this.metrics.bundleSize) {
      const sizeKB = this.metrics.bundleSize.total / 1024;
      if (sizeKB > 500) {
        recommendations.push(
          "Consider implementing more aggressive code splitting"
        );
      }
      if (this.metrics.bundleSize.compression < 70) {
        recommendations.push("Enable better compression (gzip/brotli)");
      }
    }

    if (this.metrics.mainThreadWork > 3000) {
      recommendations.push(
        "Reduce main thread work by moving heavy computations to Web Workers"
      );
    }

    if (this.metrics.tbt > 200) {
      recommendations.push("Break up long tasks to reduce Total Blocking Time");
    }

    if (this.metrics.chunkLoading.some((chunk) => chunk.loadTime > 1000)) {
      recommendations.push("Optimize dynamic import loading performance");
    }

    return recommendations;
  }

  // Log recommendations
  logRecommendations(recommendations) {
    if (recommendations.length > 0) {
      console.log("💡 Recommendations:");
      recommendations.forEach((rec) => console.log(`  • ${rec}`));
    } else {
      console.log("🎉 No major performance issues detected!");
    }
  }

  // Get emoji for score
  getScoreEmoji(score) {
    switch (score) {
      case "good":
        return "🟢";
      case "fair":
        return "🟡";
      case "poor":
        return "🔴";
      default:
        return "⚪";
    }
  }

  // Stop monitoring and cleanup
  stopMonitoring() {
    this.isMonitoring = false;
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  // Get current metrics
  getCurrentMetrics() {
    return { ...this.metrics };
  }
}

// Create global instance
const bundleMonitor = new BundlePerformanceMonitor();

// Auto-start monitoring in development
if (import.meta.env.DEV) {
  bundleMonitor.startMonitoring();
}

// Utility functions
export const startBundleMonitoring = () => bundleMonitor.startMonitoring();
export const stopBundleMonitoring = () => bundleMonitor.stopMonitoring();
export const getBundleReport = () => bundleMonitor.generateReport();
export const getCurrentBundleMetrics = () => bundleMonitor.getCurrentMetrics();

// Console commands
window.bundlePerf = {
  start: startBundleMonitoring,
  stop: stopBundleMonitoring,
  report: getBundleReport,
  metrics: getCurrentBundleMetrics,
};

console.log(`
🔧 Bundle Performance Commands:
- bundlePerf.start() - Start monitoring
- bundlePerf.report() - Generate report
- bundlePerf.metrics() - Get current metrics
- bundlePerf.stop() - Stop monitoring
`);

export default bundleMonitor;
