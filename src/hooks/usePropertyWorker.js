// Custom hook for using the Property Web Worker
// Offloads heavy property filtering, searching, and sorting to a background thread

import { useEffect, useRef, useCallback, useState } from 'react';

export const usePropertyWorker = () => {
  const workerRef = useRef(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const callbacksRef = useRef(new Map());

  // Initialize worker
  useEffect(() => {
    try {
      // Create worker with module support
      workerRef.current = new Worker(
        new URL('../utils/propertyWorker.js', import.meta.url),
        { type: 'module' }
      );

      // Handle worker messages
      workerRef.current.onmessage = (e) => {
        const { type, data, error } = e.data;
        setIsProcessing(false);

        // Get the callback for this operation
        const callback = callbacksRef.current.get(type);
        if (callback) {
          if (error) {
            callback(null, error);
          } else {
            callback(data, null);
          }
          callbacksRef.current.delete(type);
        }
      };

      // Handle worker errors
      workerRef.current.onerror = (error) => {
        console.error('Property Worker Error:', error);
        setIsProcessing(false);
        setIsWorkerReady(false);
      };

      setIsWorkerReady(true);
    } catch (error) {
      console.warn('Web Workers not supported, falling back to main thread');
      setIsWorkerReady(false);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Send message to worker
  const sendToWorker = useCallback((type, data, callback) => {
    if (!isWorkerReady || !workerRef.current) {
      // Fallback to main thread processing
      handleMainThreadFallback(type, data, callback);
      return;
    }

    setIsProcessing(true);
    callbacksRef.current.set(type, callback);
    workerRef.current.postMessage({ type, data });
  }, [isWorkerReady]);

  // Filter properties
  const filterProperties = useCallback((properties, filters, callback) => {
    sendToWorker('FILTER_PROPERTIES', { properties, filters }, (data, error) => {
      if (error) {
        console.error('Filter error:', error);
        callback(properties, error); // Return original data on error
      } else {
        callback(data.filteredProperties, null, data);
      }
    });
  }, [sendToWorker]);

  // Search properties
  const searchProperties = useCallback((properties, query, options = {}, callback) => {
    sendToWorker('SEARCH_PROPERTIES', { properties, query, ...options }, (data, error) => {
      if (error) {
        console.error('Search error:', error);
        callback(properties, error);
      } else {
        callback(data.searchResults, null, data);
      }
    });
  }, [sendToWorker]);

  // Sort properties
  const sortProperties = useCallback((properties, sortBy, sortOrder, callback) => {
    sendToWorker('SORT_PROPERTIES', { properties, sortBy, sortOrder }, (data, error) => {
      if (error) {
        console.error('Sort error:', error);
        callback(properties, error);
      } else {
        callback(data.sortedProperties, null, data);
      }
    });
  }, [sendToWorker]);

  // Calculate statistics
  const calculateStats = useCallback((properties, callback) => {
    sendToWorker('CALCULATE_STATS', { properties }, (data, error) => {
      if (error) {
        console.error('Stats calculation error:', error);
        callback(null, error);
      } else {
        callback(data, null);
      }
    });
  }, [sendToWorker]);

  return {
    isWorkerReady,
    isProcessing,
    filterProperties,
    searchProperties,
    sortProperties,
    calculateStats,
  };
};

// Fallback processing for when Web Workers are not available
function handleMainThreadFallback(type, data, callback) {
  // Import the heavy processing functions and run them on main thread
  setTimeout(() => {
    try {
      switch (type) {
        case 'FILTER_PROPERTIES':
          const filtered = mainThreadFilter(data.properties, data.filters);
          callback({ filteredProperties: filtered, count: filtered.length }, null);
          break;
        case 'SEARCH_PROPERTIES':
          const searched = mainThreadSearch(data.properties, data.query);
          callback({ searchResults: searched }, null);
          break;
        case 'SORT_PROPERTIES':
          const sorted = mainThreadSort(data.properties, data.sortBy, data.sortOrder);
          callback({ sortedProperties: sorted }, null);
          break;
        default:
          callback(null, 'Unsupported operation');
      }
    } catch (error) {
      callback(null, error.message);
    }
  }, 0);
}

// Simplified main thread implementations
function mainThreadFilter(properties, filters) {
  return properties.filter(property => {
    if (filters.priceRange) {
      const price = parseFloat(property.price) || 0;
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }
    }
    if (filters.propertyType && filters.propertyType !== 'all') {
      if (property.property_type !== filters.propertyType) {
        return false;
      }
    }
    return true;
  });
}

function mainThreadSearch(properties, query) {
  if (!query) return properties;
  
  const searchTerm = query.toLowerCase();
  return properties.filter(property => {
    const searchText = [
      property.title,
      property.description,
      property.address
    ].join(' ').toLowerCase();
    return searchText.includes(searchTerm);
  });
}

function mainThreadSort(properties, sortBy, sortOrder) {
  return [...properties].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'price':
        valueA = parseFloat(a.price) || 0;
        valueB = parseFloat(b.price) || 0;
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
  });
}

export default usePropertyWorker;", "original_text": ""}]