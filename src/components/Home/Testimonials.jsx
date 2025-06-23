import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import SectionHeading from "../UI/SectionHeading";
import TestimonialCard from "../UI/TestimonialCard";

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Home Buyer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    quote:
      "UrbanEdge made finding our dream home an absolute pleasure. Our agent was knowledgeable, responsive, and truly understood what we were looking for. We couldn't be happier with our new home!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Property Investor",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    quote:
      "As an investor, I appreciate UrbanEdge's market insights and attention to detail. They've helped me acquire multiple high-performing properties and their property management services are exceptional.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "First-time Seller",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
    quote:
      "Selling our first home was daunting, but UrbanEdge guided us through every step. Their marketing strategy attracted multiple offers, and we sold above asking price in just two weeks!",
    rating: 5,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Luxury Home Buyer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    quote:
      "The level of service and attention to detail at UrbanEdge is unmatched. They found us a stunning property that wasn't even on the market yet and negotiated a deal that exceeded our expectations.",
    rating: 4,
  },
  {
    id: 5,
    name: "Jennifer Lee",
    role: "Commercial Client",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80",
    quote:
      "UrbanEdge's commercial team helped us find the perfect location for our expanding business. Their knowledge of zoning regulations and future development plans in the area was invaluable.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const containerRef = useRef(null);

  // Determine how many testimonials to show based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 400) {
        setVisibleCount(1);
      } else if (window.innerWidth < 640) {
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
    <section className="py-16 bg-white dark:bg-brown-dark">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Don't just take our word for it. Hear from clients who found their perfect property with UrbanEdge."
          centered
        />

        <div className="relative mt-12">
          {/* Navigation Buttons */}
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full bg-beige-light dark:bg-brown shadow-md ${
                currentIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-beige-medium dark:hover:bg-brown-dark"
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
              className={`p-2 rounded-full bg-beige-light dark:bg-brown shadow-md ${
                currentIndex >= maxIndex
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-beige-medium dark:hover:bg-brown-dark"
              }`}
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="h-6 w-6 text-brown-dark dark:text-beige-light" />
            </button>
          </div>

          {/* Testimonials Container */}
          <div ref={containerRef} className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-2 xs:p-3 sm:p-4"
                >
                  <TestimonialCard testimonial={testimonial} />
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

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="/testimonials" className="btn-outline">
            Read More Success Stories
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
