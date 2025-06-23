import { useState, useEffect } from "react";
import { MapPinIcon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import InteractiveMap from "../Map/InteractiveMap";
import MapControls, { CompactMapControls, MapLegend } from "../Map/MapControls";
import MapSearchBox from "../Map/MapSearchBox";

const PropertyMap = ({
  properties,
  onPropertySelect,
  onMapBoundsChange,
  selectedPropertyId,
  onViewChange,
  showControls = true,
  showLegend = true,
  showSearch = false
}) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [showSearchInArea, setShowSearchInArea] = useState(false);
  const [currentBounds, setCurrentBounds] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePropertySelect = (property) => {
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

  const handleSearchInArea = () => {
    if (onMapBoundsChange && currentBounds) {
      setShowSearchInArea(true);
      onMapBoundsChange(currentBounds);
    }
  };

  const handleBoundsChange = (bounds) => {
    setCurrentBounds(bounds);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // In a real implementation, you might use the Fullscreen API
  };

  const handleLocationSelect = (location) => {
    // Handle location selection from search
    console.log('Location selected:', location);
  };

  // Handle selectedPropertyId from URL
  useEffect(() => {
    if (selectedPropertyId && properties.length > 0) {
      const property = properties.find(p => p.id === selectedPropertyId);
      if (property) {
        setSelectedProperty(property);
      }
    }
  }, [selectedPropertyId, properties]);

  return (
    <div className="relative h-full">
      {/* Search Box (if enabled) */}
      {showSearch && (
        <div className="absolute top-4 left-4 z-20 w-80 max-w-[calc(100%-2rem)]">
          <MapSearchBox
            onLocationSelect={handleLocationSelect}
            placeholder="Search for properties..."
          />
        </div>
      )}

      {/* Map Controls */}
      {showControls && (
        <div className="hidden md:block">
          <MapControls
            onSearchInArea={handleSearchInArea}
            onToggleFullscreen={handleToggleFullscreen}
            onToggleView={onViewChange}
            currentView="map"
            isFullscreen={isFullscreen}
            showSearchInArea={currentBounds !== null}
            propertyCount={properties.length}
          />
        </div>
      )}

      {/* Compact Controls for Mobile */}
      <div className="md:hidden absolute top-4 right-4 z-10">
        <CompactMapControls
          onToggleView={onViewChange}
          currentView="map"
          propertyCount={properties.length}
        />
      </div>

      {/* Map Container */}
      <div
        className={`h-full w-full ${
          isMapVisible ? "block" : "hidden md:block"
        }`}
      >
        <InteractiveMap
          properties={properties}
          selectedProperty={selectedProperty}
          onPropertySelect={handlePropertySelect}
          onBoundsChange={handleBoundsChange}
          height="100%"
          enableClustering={true}
        />

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

      {/* Map Legend */}
      {showLegend && !isFullscreen && (
        <MapLegend className="hidden md:block" />
      )}
    </div>
  );
};

export default PropertyMap;
