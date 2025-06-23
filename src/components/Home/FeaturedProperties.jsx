import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import SectionHeading from "../UI/SectionHeading";
import PropertyCard from "../UI/PropertyCard";
import { propertyService } from "../../lib/propertyService";
import {
  getRotationProperties,
  getTimeUntilNextRotation,
  logRotationInfo,
  ROTATION_INTERVAL_MS
} from "../../utils/propertyRotationUtils";

/**
 * Featured Properties Component with Dynamic Randomization
 *
 * This component displays 4 randomly selected properties that rotate automatically.
 *
 * 🔄 ROTATION CONFIGURATION:
 * - Current interval: 1 minute (for testing/demonstration)
 * - To change to production interval (1 week), update ROTATION_INTERVAL_MS in:
 *   src/utils/propertyRotationUtils.js
 *
 * Features:
 * - Fetches all available properties from database
 * - Randomly selects 4 properties for display
 * - Automatic rotation based on configurable interval
 * - Consistent selection during each rotation period
 * - Visual indicators and console logging for testing
 * - Proper error handling and loading states
 */
const FeaturedProperties = () => {
  // State management
  const [allProperties, setAllProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rotationTimer, setRotationTimer] = useState(null);

  // Scroll functionality
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Initialize component and set up rotation
  useEffect(() => {
    fetchAllProperties();

    // Cleanup timer on unmount
    return () => {
      if (rotationTimer) {
        clearTimeout(rotationTimer);
      }
    };
  }, []);

  // Set up rotation timer when properties are loaded
  useEffect(() => {
    if (allProperties.length > 0) {
      selectFeaturedProperties();
      setupRotationTimer();
    }
  }, [allProperties]);

  /**
   * Fetch all properties from the database
   */
  const fetchAllProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch a larger set of properties to choose from
      const { data, error } = await propertyService.getProperties({
        limit: 50, // Get up to 50 properties to choose from
        offset: 0,
        sortBy: 'newest'
      });

      if (error) {
        throw new Error(error.message || 'Failed to fetch properties');
      }

      setAllProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties for featured section:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Select 4 random properties for the current rotation period
   */
  const selectFeaturedProperties = () => {
    if (allProperties.length === 0) return;

    const selected = getRotationProperties(allProperties, 4, ROTATION_INTERVAL_MS);
    setFeaturedProperties(selected);

    // Log rotation info for testing/debugging
    if (process.env.NODE_ENV === 'development') {
      logRotationInfo(selected, ROTATION_INTERVAL_MS);
    }
  };

  /**
   * Set up automatic rotation timer
   */
  const setupRotationTimer = () => {
    // Clear existing timer
    if (rotationTimer) {
      clearTimeout(rotationTimer);
    }

    // Calculate time until next rotation
    const timeUntilNext = getTimeUntilNextRotation(ROTATION_INTERVAL_MS);

    // Set timer for next rotation
    const timer = setTimeout(() => {
      selectFeaturedProperties();
      setupRotationTimer(); // Set up next rotation
    }, timeUntilNext);

    setRotationTimer(timer);

    // Log timer info for testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏰ Next featured properties rotation in ${Math.round(timeUntilNext / 1000)} seconds`);
    }
  };

  /**
   * Check if the scroll container can scroll left or right
   */
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10,
      );
    }
  };

  /**
   * Scroll the container left or right
   * @param {string} direction - 'left' or 'right'
   */
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      // Check scrollability after animation
      setTimeout(checkScrollability, 400);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-beige-light dark:bg-brown">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Featured Properties"
            subtitle="Explore our handpicked selection of premium properties that represent the finest in luxury living and investment opportunities."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-beige-medium dark:bg-brown animate-pulse rounded-lg h-96"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-beige-light dark:bg-brown">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Featured Properties"
            subtitle="Explore our handpicked selection of premium properties that represent the finest in luxury living and investment opportunities."
            centered
          />

          <div className="text-center py-12">
            <p className="text-brown dark:text-beige-medium mb-4">
              Unable to load featured properties at this time.
            </p>
            <button
              onClick={fetchAllProperties}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No properties state
  if (featuredProperties.length === 0) {
    return (
      <section className="py-16 bg-beige-light dark:bg-brown">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Featured Properties"
            subtitle="Explore our handpicked selection of premium properties that represent the finest in luxury living and investment opportunities."
            centered
          />

          <div className="text-center py-12">
            <p className="text-brown dark:text-beige-medium">
              No properties available for featuring at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-beige-light dark:bg-brown">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Featured Properties"
          subtitle="Explore our handpicked selection of premium properties that represent the finest in luxury living and investment opportunities."
          centered
        />

        {/* Rotation Indicator (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-center mb-4">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              🔄 Auto-rotating every {ROTATION_INTERVAL_MS / 1000}s (Dev Mode)
            </span>
          </div>
        )}

        <div className="relative">
          {/* Scroll Controls */}
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full bg-white dark:bg-brown-dark shadow-md ${
                canScrollLeft
                  ? "hover:bg-beige-medium dark:hover:bg-brown text-brown-dark dark:text-beige-light"
                  : "opacity-50 cursor-not-allowed text-brown/50 dark:text-beige-light/50"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full bg-white dark:bg-brown-dark shadow-md ${
                canScrollRight
                  ? "hover:bg-beige-medium dark:hover:bg-brown text-brown-dark dark:text-beige-light"
                  : "opacity-50 cursor-not-allowed text-brown/50 dark:text-beige-light/50"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 -mx-2 xs:-mx-4 px-2 xs:px-4 scrollbar-hide"
            onScroll={checkScrollability}
          >
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="min-w-[260px] xs:min-w-[300px] sm:min-w-[350px] md:min-w-[400px] flex-shrink-0 px-2 xs:px-4"
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <a href="/properties" className="btn-outline">
            View All Properties
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
