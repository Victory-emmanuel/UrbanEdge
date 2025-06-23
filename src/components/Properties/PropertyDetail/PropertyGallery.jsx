import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const PropertyGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Provide fallback images if none are provided or if images array is empty
  const safeImages = images && images.length > 0 ? images : [
    {
      url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Property placeholder image"
    }
  ];

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? safeImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === safeImages.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative h-[300px] md:h-[500px] overflow-hidden rounded-lg">
        <img
          src={safeImages[currentIndex]?.url || safeImages[0].url}
          alt={safeImages[currentIndex]?.alt || "Property image"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
          }}
        />

        {/* Navigation Arrows - Only show if more than one image */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-brown-dark/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-brown-dark transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-6 w-6 text-brown-dark dark:text-beige-light" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-brown-dark/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-brown-dark transition-colors"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-6 w-6 text-brown-dark dark:text-beige-light" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-brown-dark/80 px-3 py-1 rounded-full text-sm text-brown-dark dark:text-beige-light">
          {currentIndex + 1} / {safeImages.length}
        </div>
      </div>

      {/* Thumbnails - Only show if more than one image */}
      {safeImages.length > 1 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          {safeImages.map((image, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
              index === currentIndex
                ? "ring-2 ring-taupe"
                : "opacity-70 hover:opacity-100"
            }`}
            aria-label={`View image ${index + 1}`}
            aria-current={index === currentIndex}
          >
            <img
              src={image?.url || safeImages[0].url}
              alt={image?.alt || "Property thumbnail"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
              }}
            />
          </button>
        ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
