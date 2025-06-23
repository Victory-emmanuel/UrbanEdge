import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  ArrowsPointingOutIcon,
  MapPinIcon,
  FunnelIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';

/**
 * Map Controls Component
 * Provides additional controls for the interactive map
 */
const MapControls = ({
  onSearchInArea,
  onToggleFullscreen,
  onToggleView,
  onShowFilters,
  currentView = 'map',
  isFullscreen = false,
  showSearchInArea = false,
  propertyCount = 0,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchInArea = () => {
    if (onSearchInArea) {
      onSearchInArea();
    }
  };

  const handleToggleFullscreen = () => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    }
  };

  const handleToggleView = () => {
    if (onToggleView) {
      onToggleView(currentView === 'map' ? 'grid' : 'map');
    }
  };

  const handleShowFilters = () => {
    if (onShowFilters) {
      onShowFilters();
    }
  };

  return (
    <div className={`absolute top-4 right-4 z-10 ${className}`}>
      <div className="bg-white dark:bg-brown-dark rounded-lg shadow-lg border border-gray-200 dark:border-brown">
        {/* Main Controls */}
        <div className="flex flex-col">
          {/* Property Count */}
          <div className="px-3 py-2 border-b border-gray-200 dark:border-brown">
            <span className="text-sm font-medium text-brown-dark dark:text-beige-light">
              {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="p-2 space-y-1">
            {/* Search in Area */}
            {showSearchInArea && (
              <button
                onClick={handleSearchInArea}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brown-dark dark:text-beige-light hover:bg-beige-light dark:hover:bg-brown rounded-md transition-colors"
                title="Search properties in current map area"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                Search this area
              </button>
            )}

            {/* Toggle View */}
            <button
              onClick={handleToggleView}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brown-dark dark:text-beige-light hover:bg-beige-light dark:hover:bg-brown rounded-md transition-colors"
              title={`Switch to ${currentView === 'map' ? 'grid' : 'map'} view`}
            >
              {currentView === 'map' ? (
                <>
                  <ViewColumnsIcon className="h-4 w-4" />
                  Grid view
                </>
              ) : (
                <>
                  <MapPinIcon className="h-4 w-4" />
                  Map view
                </>
              )}
            </button>

            {/* Filters */}
            <button
              onClick={handleShowFilters}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brown-dark dark:text-beige-light hover:bg-beige-light dark:hover:bg-brown rounded-md transition-colors"
              title="Show filters"
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brown-dark dark:text-beige-light hover:bg-beige-light dark:hover:bg-brown rounded-md transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <ArrowsPointingOutIcon className="h-4 w-4" />
              {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Compact Map Controls for mobile/small screens
 */
export const CompactMapControls = ({
  onToggleView,
  currentView = 'map',
  propertyCount = 0,
  className = ''
}) => {
  return (
    <div className={`absolute top-4 right-4 z-10 ${className}`}>
      <div className="flex items-center gap-2">
        {/* Property Count Badge */}
        <div className="bg-white dark:bg-brown-dark px-3 py-1 rounded-full shadow-md border border-gray-200 dark:border-brown">
          <span className="text-xs font-medium text-brown-dark dark:text-beige-light">
            {propertyCount}
          </span>
        </div>

        {/* View Toggle */}
        <button
          onClick={() => onToggleView && onToggleView(currentView === 'map' ? 'grid' : 'map')}
          className="bg-white dark:bg-brown-dark p-2 rounded-full shadow-md border border-gray-200 dark:border-brown hover:bg-beige-light dark:hover:bg-brown transition-colors"
          title={`Switch to ${currentView === 'map' ? 'grid' : 'map'} view`}
        >
          {currentView === 'map' ? (
            <ViewColumnsIcon className="h-5 w-5 text-brown-dark dark:text-beige-light" />
          ) : (
            <MapPinIcon className="h-5 w-5 text-brown-dark dark:text-beige-light" />
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * Map Legend Component
 */
export const MapLegend = ({ className = '' }) => {
  return (
    <div className={`absolute bottom-4 left-4 z-10 ${className}`}>
      <div className="bg-white dark:bg-brown-dark rounded-lg shadow-lg border border-gray-200 dark:border-brown p-3">
        <h4 className="text-sm font-semibold text-brown-dark dark:text-beige-light mb-2">
          Map Legend
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-brown-dark dark:bg-beige-light rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-xs text-brown dark:text-beige-medium">Available Property</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-taupe rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-xs text-brown dark:text-beige-medium">Selected Property</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brown-dark dark:bg-beige-light rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <span className="text-xs text-white dark:text-brown-dark font-bold">5</span>
            </div>
            <span className="text-xs text-brown dark:text-beige-medium">Property Cluster</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapControls;
