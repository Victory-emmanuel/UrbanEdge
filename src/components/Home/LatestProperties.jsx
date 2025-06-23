import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import SectionHeading from "../UI/SectionHeading";
import PropertyCard from "../UI/PropertyCard";
import { propertyService } from "../../lib/propertyService";

/**
 * Latest Properties Component
 * 
 * Displays the 4 most recently added properties on the homepage.
 * Uses the same design and layout as the Featured Properties section.
 * Properties are ordered by creation date (newest first).
 */
const LatestProperties = () => {
  const [latestProperties, setLatestProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch latest properties on component mount
  useEffect(() => {
    fetchLatestProperties();
  }, []);

  /**
   * Fetch the latest 4 properties from the database
   */
  const fetchLatestProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch properties sorted by newest first, limit to 4
      const { data, error } = await propertyService.getProperties({
        sortBy: 'newest',
        limit: 4,
        offset: 0
      });

      if (error) {
        throw new Error(error.message || 'Failed to fetch latest properties');
      }

      setLatestProperties(data || []);
    } catch (err) {
      console.error('Error fetching latest properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
      <section className="py-16 bg-white dark:bg-brown-dark">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Latest Properties"
            subtitle="Discover our newest property listings, fresh on the market and ready for your consideration."
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
      <section className="py-16 bg-white dark:bg-brown-dark">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Latest Properties"
            subtitle="Discover our newest property listings, fresh on the market and ready for your consideration."
            centered
          />
          
          <div className="text-center py-12">
            <p className="text-brown dark:text-beige-medium mb-4">
              Unable to load latest properties at this time.
            </p>
            <button
              onClick={fetchLatestProperties}
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
  if (latestProperties.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-brown-dark">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Latest Properties"
            subtitle="Discover our newest property listings, fresh on the market and ready for your consideration."
            centered
          />
          
          <div className="text-center py-12">
            <p className="text-brown dark:text-beige-medium">
              No properties available at this time. Check back soon for new listings!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-brown-dark">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Latest Properties"
          subtitle="Discover our newest property listings, fresh on the market and ready for your consideration."
          centered
        />

        {/* Desktop Grid Layout (4 columns on large screens) */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {latestProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        {/* Mobile/Tablet Scrollable Layout */}
        <div className="lg:hidden relative">
          {/* Navigation Arrows */}
          {latestProperties.length > 1 && (
            <>
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-brown-dark shadow-lg flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? "text-brown-dark dark:text-beige-light hover:bg-beige-light dark:hover:bg-brown"
                    : "text-beige-medium dark:text-brown opacity-50 cursor-not-allowed"
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-brown-dark shadow-lg flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? "text-brown-dark dark:text-beige-light hover:bg-beige-light dark:hover:bg-brown"
                    : "text-beige-medium dark:text-brown opacity-50 cursor-not-allowed"
                }`}
                aria-label="Scroll right"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 -mx-2 xs:-mx-4 px-2 xs:px-4 scrollbar-hide"
            onScroll={checkScrollability}
          >
            {latestProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[260px] xs:min-w-[300px] sm:min-w-[350px] md:min-w-[400px] flex-shrink-0 px-2 xs:px-4"
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <a href="/properties?sortBy=newest" className="btn-outline">
            View All Latest Properties
          </a>
        </div>
      </div>
    </section>
  );
};

export default LatestProperties;
