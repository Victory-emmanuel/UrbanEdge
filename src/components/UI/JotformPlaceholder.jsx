import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

/**
 * JotForm Lazy Loading Placeholder Component
 *
 * This component implements optimized lazy loading for JotForm chatbot widget to prevent
 * main thread blocking during initial page load. Features:
 *
 * - Gesture-based loading (loads on user click interaction)
 * - Idle-time loading (loads during browser idle time as fallback)
 * - Lightweight initial render with attractive placeholder UI
 * - Error handling and retry functionality
 * - Performance monitoring integration
 *
 * Performance Benefits:
 * - Eliminates main thread blocking from heavy JotForm scripts
 * - Improves initial page load times and Core Web Vitals
 * - Loads only when user shows intent to interact or during idle time
 */
const JotformPlaceholder = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadTrigger, setLoadTrigger] = useState(null); // Track how loading was triggered

  /**
   * Load JotForm script dynamically
   */
  const loadJotformScript = useCallback(() => {
    // Prevent multiple loading attempts
    if (isLoaded || isLoading) return;

    // Check if script is already loaded
    const existingScript = document.querySelector(
      'script[src*="cdn.jotfor.ms/agent/embedjs"]'
    );

    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Performance monitoring: Track script loading start
    const loadStartTime = performance.now();

    const script = document.createElement("script");
    script.src =
      "https://cdn.jotfor.ms/agent/embedjs/01977ef6126a721ca60420e562e7a5468ca6/embed.js?skipWelcome=1&maximizable=1";
    script.async = true;

    script.onload = () => {
      const loadTime = performance.now() - loadStartTime;
      setIsLoaded(true);
      setIsLoading(false);

      console.log(
        `✅ JotForm script loaded successfully in ${loadTime.toFixed(
          2
        )}ms via ${loadTrigger}`
      );

      // Performance monitoring: Report successful lazy load
      if (typeof window.bundlePerformanceMonitor !== "undefined") {
        window.bundlePerformanceMonitor.trackThirdPartyScript({
          name: "JotForm",
          loadTime,
          trigger: loadTrigger,
          success: true,
        });
      }
    };

    script.onerror = () => {
      const loadTime = performance.now() - loadStartTime;
      setError("Failed to load chatbot. Please try again.");
      setIsLoading(false);

      console.error(
        `❌ Failed to load JotForm script after ${loadTime.toFixed(2)}ms`
      );

      // Performance monitoring: Report failed load
      if (typeof window.bundlePerformanceMonitor !== "undefined") {
        window.bundlePerformanceMonitor.trackThirdPartyScript({
          name: "JotForm",
          loadTime,
          trigger: loadTrigger,
          success: false,
          error: "Script load failed",
        });
      }
    };

    document.head.appendChild(script);
  }, [isLoaded, isLoading, loadTrigger]);

  /**
   * Handle gesture-based loading (user click)
   */
  const handleUserInteraction = () => {
    setLoadTrigger("user-gesture");
    loadJotformScript();
  };

  /**
   * Handle retry on error
   */
  const handleRetry = () => {
    setError(null);
    setLoadTrigger("retry");
    loadJotformScript();
  };

  /**
   * Set up idle-time loading as fallback
   */
  useEffect(() => {
    // Only set up idle loading if user hasn't interacted yet
    if (isLoaded || isLoading) return;

    const idleLoadDelay = 3000; // 3 seconds delay for idle loading

    const idleLoad = () => {
      setLoadTrigger("idle-time");
      loadJotformScript();
    };

    let timeoutId;

    // Use requestIdleCallback if available (modern browsers)
    if ("requestIdleCallback" in window) {
      const idleCallbackId = requestIdleCallback(
        () => {
          timeoutId = setTimeout(idleLoad, idleLoadDelay);
        },
        { timeout: 5000 } // Fallback timeout of 5 seconds
      );

      return () => {
        cancelIdleCallback(idleCallbackId);
        if (timeoutId) clearTimeout(timeoutId);
      };
    } else {
      // Fallback for browsers without requestIdleCallback
      timeoutId = setTimeout(idleLoad, idleLoadDelay);

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [loadJotformScript, isLoaded, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Remove script if component unmounts before it's fully loaded
      if (!isLoaded) {
        const scriptToRemove = document.querySelector(
          'script[src*="cdn.jotfor.ms/agent/embedjs"]'
        );
        if (scriptToRemove) {
          document.head.removeChild(scriptToRemove);
        }
      }
    };
  }, [isLoaded]);

  // Show error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-sm shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium underline"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-white dark:bg-brown-dark border border-taupe/20 dark:border-brown-light/20 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-taupe"></div>
            <span className="text-sm text-brown-dark dark:text-beige-light">
              Loading chat assistant...
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show interactive placeholder if not loaded yet
  if (!isLoaded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={handleUserInteraction}
          className="bg-taupe hover:bg-taupe-dark text-white rounded-full p-4 shadow-lg transition-all duration-200 flex items-center space-x-2 group"
          aria-label="Open chat assistant"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
          <span className="hidden group-hover:block text-sm font-medium pr-2">
            Chat with us
          </span>
        </button>
      </motion.div>
    );
  }

  // Once loaded, the JotForm script handles its own rendering
  return null;
};

export default JotformPlaceholder;
