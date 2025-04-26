import { useState } from "react";
import { MapPinIcon, XMarkIcon } from "@heroicons/react/24/solid";

const PropertyMap = ({ properties, onPropertySelect }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(true);

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  const handleClosePreview = () => {
    setSelectedProperty(null);
  };

  const toggleMap = () => {
    setIsMapVisible(!isMapVisible);
  };

  return (
    <div className="relative h-full">
      {/* Map Toggle Button (Mobile) */}
      <div className="md:hidden absolute top-4 right-4 z-10">
        <button
          onClick={toggleMap}
          className="bg-white dark:bg-brown-dark p-2 rounded-full shadow-md"
          aria-label={isMapVisible ? "Hide map" : "Show map"}
        >
          {isMapVisible ? (
            <XMarkIcon className="h-5 w-5 text-brown-dark dark:text-beige-light" />
          ) : (
            <MapPinIcon className="h-5 w-5 text-brown-dark dark:text-beige-light" />
          )}
        </button>
      </div>

      {/* Map Container */}
      <div
        className={`h-full w-full bg-beige-medium dark:bg-brown rounded-lg overflow-hidden ${
          isMapVisible ? "block" : "hidden md:block"
        }`}
      >
        {/* This would be replaced with an actual map component like Google Maps or Mapbox */}
        <div className="h-full w-full flex items-center justify-center bg-beige-light dark:bg-brown p-4 relative">
          <div className="text-center">
            <p className="text-brown-dark dark:text-beige-light mb-2">
              Map Component Placeholder
            </p>
            <p className="text-sm text-brown dark:text-beige-medium">
              In a real implementation, this would be replaced with a Google Maps or Mapbox component
            </p>
          </div>

          {/* Property Markers (Simplified for Placeholder) */}
          <div className="absolute inset-0">
            {properties.map((property) => (
              <button
                key={property.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 80 + 10}%`,
                }}
                onClick={() => handleMarkerClick(property)}
                aria-label={`View ${property.title}`}
              >
                <MapPinIcon
                  className={`h-8 w-8 ${
                    selectedProperty?.id === property.id
                      ? "text-taupe"
                      : "text-brown-dark dark:text-beige-light"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Property Preview */}
          {selectedProperty && (
            <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-brown-dark rounded-lg shadow-lg p-4 max-w-md mx-auto">
              <button
                onClick={handleClosePreview}
                className="absolute top-2 right-2 text-brown-dark dark:text-beige-light"
                aria-label="Close preview"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              <div className="flex">
                <img
                  src={selectedProperty.imageUrl}
                  alt={selectedProperty.title}
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className="font-heading font-bold text-brown-dark dark:text-beige-light">
                    {selectedProperty.title}
                  </h3>
                  <p className="text-sm text-brown dark:text-beige-medium mb-1">
                    {selectedProperty.location}
                  </p>
                  <p className="font-bold text-taupe">
                    ${selectedProperty.price.toLocaleString()}
                  </p>
                  <a
                    href={`/properties/${selectedProperty.id}`}
                    className="text-sm text-taupe hover:underline mt-1 inline-block"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
