import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { propertyService } from '../../lib/propertyService';

/**
 * Map Search Box Component
 * Provides search functionality with autocomplete and map integration
 */
const MapSearchBox = ({
  onLocationSelect,
  onSearchResults,
  placeholder = "Search for a location...",
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 2) {
        searchLocations(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (searchQuery) => {
    setIsLoading(true);
    try {
      // Use Nominatim API for location suggestions
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedSuggestions = data.map((item) => ({
          id: item.place_id,
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          type: item.type,
          importance: item.importance
        }));
        
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectLocation(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectLocation = async (location) => {
    setQuery(location.display_name);
    setShowSuggestions(false);
    setSelectedIndex(-1);

    // Notify parent component about location selection
    if (onLocationSelect) {
      onLocationSelect({
        lat: location.lat,
        lng: location.lon,
        address: location.display_name,
        zoom: 13
      });
    }

    // Search for properties near this location
    if (onSearchResults) {
      try {
        setIsLoading(true);
        // Create a small bounding box around the selected location
        const radius = 0.01; // Approximately 1km
        const bounds = {
          north: location.lat + radius,
          south: location.lat - radius,
          east: location.lon + radius,
          west: location.lon - radius
        };

        const { data, error } = await propertyService.getPropertiesInBounds(bounds);
        if (!error && data) {
          onSearchResults(data, bounds);
        }
      } catch (error) {
        console.error('Error searching properties:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-brown dark:text-beige-medium" />
        </div>
        
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 dark:border-brown rounded-lg bg-white dark:bg-brown-dark text-brown-dark dark:text-beige-light placeholder-brown dark:placeholder-beige-medium focus:outline-none focus:ring-2 focus:ring-taupe focus:border-taupe"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon className="h-5 w-5 text-brown dark:text-beige-medium hover:text-brown-dark dark:hover:text-beige-light" />
          </button>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-taupe"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-brown-dark border border-gray-300 dark:border-brown rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => selectLocation(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-beige-light dark:hover:bg-brown transition-colors ${
                index === selectedIndex
                  ? 'bg-beige-light dark:bg-brown'
                  : ''
              }`}
            >
              <div className="text-sm text-brown-dark dark:text-beige-light">
                {suggestion.display_name}
              </div>
              <div className="text-xs text-brown dark:text-beige-medium mt-1">
                {suggestion.type} • {suggestion.lat.toFixed(4)}, {suggestion.lon.toFixed(4)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapSearchBox;
