// LCP (Largest Contentful Paint) Testing Utilities
// Use this to test and monitor LCP performance improvements

export class LCPTester {
  constructor() {
    this.lcpValue = null;
    this.observer = null;
    this.measurements = [];
  }

  // Start measuring LCP
  startMeasurement() {
    if (!("PerformanceObserver" in window)) {
      console.warn("PerformanceObserver is not supported");
      return;
    }

    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        if (lastEntry) {
          this.lcpValue = lastEntry.startTime;
          this.measurements.push({
            timestamp: Date.now(),
            lcp: lastEntry.startTime,
            element: lastEntry.element,
            url: lastEntry.url,
          });

          console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
          console.log("LCP Element:", lastEntry.element);

          // Log performance rating
          this.logPerformanceRating(lastEntry.startTime);
        }
      });

      this.observer.observe({
        type: "largest-contentful-paint",
        buffered: true,
      });
    } catch (error) {
      console.error("Error setting up LCP observer:", error);
    }
  }

  // Stop measuring and return results
  stopMeasurement() {
    if (this.observer) {
      this.observer.disconnect();
    }

    return {
      finalLCP: this.lcpValue,
      allMeasurements: this.measurements,
      summary: this.getSummary(),
    };
  }

  // Get performance rating based on LCP value
  logPerformanceRating(lcp) {
    let rating = "";
    let color = "";

    if (lcp <= 2500) {
      rating = "GOOD";
      color = "color: green; font-weight: bold;";
    } else if (lcp <= 4000) {
      rating = "NEEDS IMPROVEMENT";
      color = "color: orange; font-weight: bold;";
    } else {
      rating = "POOR";
      color = "color: red; font-weight: bold;";
    }

    console.log(`%cLCP Rating: ${rating} (${lcp.toFixed(2)}ms)`, color);
  }

  // Get measurement summary
  getSummary() {
    if (this.measurements.length === 0) {
      return { message: "No measurements taken" };
    }

    const lcpValues = this.measurements.map((m) => m.lcp);
    const avgLCP = lcpValues.reduce((a, b) => a + b, 0) / lcpValues.length;
    const minLCP = Math.min(...lcpValues);
    const maxLCP = Math.max(...lcpValues);

    return {
      count: this.measurements.length,
      final: this.lcpValue,
      average: avgLCP,
      minimum: minLCP,
      maximum: maxLCP,
      improvement: this.calculateImprovement(),
    };
  }

  // Calculate improvement percentage (compared to baseline)
  calculateImprovement(baseline = 4000) {
    if (!this.lcpValue) return null;

    const improvement = ((baseline - this.lcpValue) / baseline) * 100;
    return {
      baseline,
      current: this.lcpValue,
      improvementPercent: improvement.toFixed(2),
      isImproved: improvement > 0,
    };
  }

  // Test hero image loading specifically
  testHeroImageLoading() {
    console.log("Testing hero image loading...");

    const heroImg = document.querySelector('section img[alt*="Luxury home"]');

    if (!heroImg) {
      console.warn("Hero image not found");
      return;
    }

    const startTime = performance.now();

    if (heroImg.complete) {
      const loadTime = performance.now() - startTime;
      console.log(`Hero image already loaded: ${loadTime.toFixed(2)}ms`);
    } else {
      heroImg.addEventListener("load", () => {
        const loadTime = performance.now() - startTime;
        console.log(`Hero image loaded: ${loadTime.toFixed(2)}ms`);
      });

      heroImg.addEventListener("error", () => {
        console.error("Hero image failed to load");
      });
    }

    // Check image attributes
    console.log("Hero image attributes:", {
      src: heroImg.src,
      width: heroImg.width,
      height: heroImg.height,
      sizes: heroImg.sizes,
      fetchPriority: heroImg.fetchPriority,
      loading: heroImg.loading,
      decoding: heroImg.decoding,
    });
  }

  // Check if preload hints are working
  checkPreloadHints() {
    console.log("Checking preload hints...");

    const preloadLinks = document.querySelectorAll(
      'link[rel="preload"][as="image"]'
    );

    if (preloadLinks.length === 0) {
      console.warn("No image preload hints found");
      return;
    }

    preloadLinks.forEach((link, index) => {
      console.log(`Preload ${index + 1}:`, {
        href: link.href,
        type: link.type,
        media: link.media,
        fetchpriority: link.getAttribute("fetchpriority"),
      });
    });
  }

  // Complete LCP analysis
  runCompleteAnalysis() {
    console.log("🚀 Starting Complete LCP Analysis...");

    // Start LCP measurement
    this.startMeasurement();

    // Check preload hints
    this.checkPreloadHints();

    // Test hero image
    this.testHeroImageLoading();

    // Set up completion handler
    setTimeout(() => {
      const results = this.stopMeasurement();
      console.log("📊 LCP Analysis Complete:", results);

      // Check if target is met
      if (results.finalLCP && results.finalLCP <= 2500) {
        console.log("🎉 LCP target achieved! (≤ 2.5s)");
      } else if (results.finalLCP) {
        console.log(
          "⚠️ LCP target not met. Current:",
          results.finalLCP.toFixed(2) + "ms"
        );
      }
    }, 5000);
  }
}

// Helper function to run quick LCP test
export const quickLCPTest = () => {
  const tester = new LCPTester();
  tester.runCompleteAnalysis();
  return tester;
};

// Helper function to check current LCP
export const getCurrentLCP = () => {
  return new Promise((resolve) => {
    if (!("PerformanceObserver" in window)) {
      resolve({ error: "PerformanceObserver not supported" });
      return;
    }

    let lcpValue = null;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        lcpValue = lastEntry.startTime;
      }
    });

    observer.observe({ type: "largest-contentful-paint", buffered: true });

    setTimeout(() => {
      observer.disconnect();
      resolve({ lcp: lcpValue });
    }, 3000);
  });
};

// Console commands for easy testing
console.log(`
🔧 LCP Testing Commands Available:
- quickLCPTest() - Run complete analysis
- getCurrentLCP() - Get current LCP value
- new LCPTester() - Create custom tester

Usage example:
quickLCPTest();
`);
