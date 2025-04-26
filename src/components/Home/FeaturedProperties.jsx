import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import SectionHeading from "../UI/SectionHeading";
import PropertyCard from "../UI/PropertyCard";

// Sample data - in a real app, this would come from an API
const featuredProperties = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    location: "Beverly Hills, CA",
    price: 4500000,
    bedrooms: 5,
    bathrooms: 4.5,
    sqft: 4200,
    type: "Villa",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    isFavorite: false,
  },
  {
    id: 2,
    title: "Downtown Penthouse",
    location: "Manhattan, NY",
    price: 3200000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2800,
    type: "Penthouse",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    isFavorite: true,
  },
  {
    id: 3,
    title: "Seaside Retreat",
    location: "Malibu, CA",
    price: 5800000,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3600,
    type: "House",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    isFavorite: false,
  },
  {
    id: 4,
    title: "Urban Loft",
    location: "Chicago, IL",
    price: 1200000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1800,
    type: "Loft",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    isFavorite: false,
  },
];

const FeaturedProperties = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

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

  return (
    <section className="py-16 bg-beige-light dark:bg-brown">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Featured Properties"
          subtitle="Explore our handpicked selection of premium properties that represent the finest in luxury living and investment opportunities."
          centered
        />

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
          <a
            href="/properties"
            className="btn-outline"
          >
            View All Properties
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
