import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    service: "Buying",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    quote:
      "The buying process was seamless with UrbanEdge. Our agent took the time to understand exactly what we were looking for and found us the perfect home within our budget. Their negotiation skills saved us thousands!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    service: "Investment Advisory",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    quote:
      "UrbanEdge's investment advisory team helped me build a real estate portfolio that has consistently outperformed the market. Their market analysis and property recommendations have been spot on.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    service: "Selling",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
    quote:
      "I was amazed at how quickly UrbanEdge sold my property and for above asking price! Their marketing strategy and professional photography made my home stand out in a competitive market.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Thompson",
    service: "Property Management",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    quote:
      "Since switching to UrbanEdge for property management, my rental income has increased and tenant issues have decreased. Their team is responsive, professional, and truly cares about maximizing my investment.",
    rating: 4,
  },
  {
    id: 5,
    name: "Jennifer Lee",
    service: "Development Services",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80",
    quote:
      "UrbanEdge guided our development project from concept to completion with exceptional expertise. Their knowledge of zoning regulations and relationships with local officials were invaluable in navigating the approval process.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // Determine how many testimonials to show based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = testimonials.length - visibleCount;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
  };

  return (
    <section className="py-16 bg-beige-light dark:bg-brown">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Client Success Stories
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            Hear from clients who have experienced the UrbanEdge difference
            across our range of services.
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full bg-white dark:bg-brown-dark shadow-md ${
                currentIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-beige-medium dark:hover:bg-brown"
              }`}
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="h-6 w-6 text-brown-dark dark:text-beige-light" />
            </button>
          </div>

          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`p-2 rounded-full bg-white dark:bg-brown-dark shadow-md ${
                currentIndex >= maxIndex
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-beige-medium dark:hover:bg-brown"
              }`}
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="h-6 w-6 text-brown-dark dark:text-beige-light" />
            </button>
          </div>

          {/* Testimonials Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-4"
                >
                  <div className="bg-white dark:bg-brown-dark rounded-lg shadow-md p-6 h-full flex flex-col">
                    {/* Service Tag */}
                    <div className="mb-4">
                      <span className="inline-block bg-taupe/20 text-taupe px-3 py-1 rounded-full text-sm font-medium">
                        {testimonial.service}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? "text-taupe"
                              : "text-beige-medium dark:text-brown"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="mb-6 flex-grow">
                      <p className="italic text-brown dark:text-beige-medium">
                        "{testimonial.quote}"
                      </p>
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />

                      <p className="font-medium text-brown-dark dark:text-beige-light">
                        {testimonial.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center mt-8 md:hidden">
            {Array.from({ length: testimonials.length - visibleCount + 1 }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 mx-1 rounded-full ${
                    currentIndex === index
                      ? "bg-taupe"
                      : "bg-beige-medium dark:bg-brown"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
