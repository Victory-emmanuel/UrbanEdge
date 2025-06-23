import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import PropertyCard from "../../UI/PropertyCard";

const SimilarProperties = ({ properties }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="py-12">
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-brown-dark dark:text-beige-light mb-6">
        Similar Properties
      </h2>

      <div className="relative">
        {/* Scroll Controls */}
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-white dark:bg-brown-dark shadow-md hover:bg-beige-medium dark:hover:bg-brown text-brown-dark dark:text-beige-light"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-white dark:bg-brown-dark shadow-md hover:bg-beige-medium dark:hover:bg-brown text-brown-dark dark:text-beige-light"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide"
        >
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[300px] sm:min-w-[350px] md:min-w-[400px] flex-shrink-0 px-4"
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarProperties;
