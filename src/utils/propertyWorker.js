// Property Search and Filtering Web Worker
// Handles heavy computations like filtering, sorting, and searching properties

self.onmessage = function(e) {
  const { type, data } = e.data;

  switch (type) {
    case 'FILTER_PROPERTIES':
      handlePropertyFilter(data);
      break;
    case 'SEARCH_PROPERTIES':
      handlePropertySearch(data);
      break;
    case 'SORT_PROPERTIES':
      handlePropertySort(data);
      break;
    case 'CALCULATE_STATS':
      handleStatsCalculation(data);
      break;
    default:
      self.postMessage({ error: `Unknown operation type: ${type}` });
  }
};

// Filter properties based on criteria
function handlePropertyFilter({ properties, filters }) {
  try {
    const filtered = properties.filter(property => {
      // Price range filter
      if (filters.priceRange) {
        const price = parseFloat(property.price) || 0;
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }

      // Property type filter
      if (filters.propertyType && filters.propertyType !== 'all') {
        if (property.property_type !== filters.propertyType) {
          return false;
        }
      }

      // Sale type filter (For Sale/For Rent)
      if (filters.saleType && filters.saleType !== 'all') {
        if (property.sale_type !== filters.saleType) {
          return false;
        }
      }

      // Bedrooms filter
      if (filters.bedrooms && filters.bedrooms !== 'any') {
        const beds = parseInt(property.bedrooms) || 0;
        const targetBeds = parseInt(filters.bedrooms);
        if (targetBeds === 5 && beds < 5) return false; // 5+ bedrooms
        if (targetBeds < 5 && beds !== targetBeds) return false;
      }

      // Bathrooms filter
      if (filters.bathrooms && filters.bathrooms !== 'any') {
        const baths = parseFloat(property.bathrooms) || 0;
        const targetBaths = parseFloat(filters.bathrooms);
        if (targetBaths === 3 && baths < 3) return false; // 3+ bathrooms
        if (targetBaths < 3 && baths < targetBaths) return false;
      }

      // Square footage filter
      if (filters.sqftRange) {
        const sqft = parseInt(property.sqft || property.square_feet) || 0;
        if (sqft < filters.sqftRange.min || sqft > filters.sqftRange.max) {
          return false;
        }
      }

      // Location filter
      if (filters.location && filters.location.trim()) {
        const location = (
          (property.address || '') + ' ' + 
          (property.city || '') + ' ' + 
          (property.neighborhood || '')
        ).toLowerCase();
        if (!location.includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      return true;
    });

    self.postMessage({
      type: 'FILTER_COMPLETE',
      data: {
        filteredProperties: filtered,
        count: filtered.length,
        totalCount: properties.length
      }
    });
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      error: `Filter error: ${error.message}` 
    });
  }
}

// Search properties based on query
function handlePropertySearch({ properties, query, fuzzySearch = true }) {
  try {
    if (!query || query.trim() === '') {
      self.postMessage({
        type: 'SEARCH_COMPLETE',
        data: { searchResults: properties, query }
      });
      return;
    }

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const searchResults = properties.map(property => {
      const searchableText = [
        property.title,
        property.description,
        property.address,
        property.city,
        property.neighborhood,
        property.property_type,
        property.sale_type,
        ...(property.features || [])
      ].join(' ').toLowerCase();

      let score = 0;
      let matchedTerms = 0;

      searchTerms.forEach(term => {
        if (searchableText.includes(term)) {
          matchedTerms++;
          // Boost score for exact matches in title
          if (property.title && property.title.toLowerCase().includes(term)) {
            score += 10;
          }
          // Boost score for matches in address/location
          if (property.address && property.address.toLowerCase().includes(term)) {
            score += 5;
          }
          // Base score for any match
          score += 1;

          // Fuzzy matching bonus
          if (fuzzySearch) {
            const fuzzyMatches = findFuzzyMatches(term, searchableText);
            score += fuzzyMatches * 0.5;
          }
        }
      });

      // Require at least half of search terms to match
      const matchRatio = matchedTerms / searchTerms.length;
      if (matchRatio < 0.5) {
        score = 0;
      }

      return { ...property, searchScore: score };
    })
    .filter(property => property.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);

    self.postMessage({
      type: 'SEARCH_COMPLETE',
      data: { searchResults, query, resultCount: searchResults.length }
    });
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      error: `Search error: ${error.message}` 
    });
  }
}

// Sort properties
function handlePropertySort({ properties, sortBy, sortOrder = 'asc' }) {
  try {
    const sorted = [...properties].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'price':
          valueA = parseFloat(a.price) || 0;
          valueB = parseFloat(b.price) || 0;
          break;
        case 'date':
          valueA = new Date(a.created_at || a.date_added || 0);
          valueB = new Date(b.created_at || b.date_added || 0);
          break;
        case 'sqft':
          valueA = parseInt(a.sqft || a.square_feet) || 0;
          valueB = parseInt(b.sqft || b.square_feet) || 0;
          break;
        case 'bedrooms':
          valueA = parseInt(a.bedrooms) || 0;
          valueB = parseInt(b.bedrooms) || 0;
          break;
        case 'title':
          valueA = (a.title || '').toLowerCase();
          valueB = (b.title || '').toLowerCase();
          return sortOrder === 'asc' ? 
            valueA.localeCompare(valueB) : 
            valueB.localeCompare(valueA);
        default:
          return 0;
      }

      if (sortOrder === 'desc') {
        return valueB - valueA;
      }
      return valueA - valueB;
    });

    self.postMessage({
      type: 'SORT_COMPLETE',
      data: { sortedProperties: sorted, sortBy, sortOrder }
    });
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      error: `Sort error: ${error.message}` 
    });
  }
}

// Calculate property statistics
function handleStatsCalculation({ properties }) {
  try {
    const stats = {
      total: properties.length,
      forSale: 0,
      forRent: 0,
      averagePrice: 0,
      medianPrice: 0,
      priceRange: { min: Infinity, max: 0 },
      propertyTypes: {},
      bedroomDistribution: {},
      averageSqft: 0
    };

    const prices = [];
    let totalSqft = 0;
    let sqftCount = 0;

    properties.forEach(property => {
      // Sale type stats
      if (property.sale_type === 'For Sale') {
        stats.forSale++;
      } else if (property.sale_type === 'For Rent') {
        stats.forRent++;
      }

      // Price stats
      const price = parseFloat(property.price) || 0;
      if (price > 0) {
        prices.push(price);
        stats.priceRange.min = Math.min(stats.priceRange.min, price);
        stats.priceRange.max = Math.max(stats.priceRange.max, price);
      }

      // Property type distribution
      const propType = property.property_type || 'Other';
      stats.propertyTypes[propType] = (stats.propertyTypes[propType] || 0) + 1;

      // Bedroom distribution
      const bedrooms = property.bedrooms || 'Unknown';
      stats.bedroomDistribution[bedrooms] = (stats.bedroomDistribution[bedrooms] || 0) + 1;

      // Square footage
      const sqft = parseInt(property.sqft || property.square_feet) || 0;
      if (sqft > 0) {
        totalSqft += sqft;
        sqftCount++;
      }
    });

    // Calculate averages
    if (prices.length > 0) {
      stats.averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      
      // Calculate median
      const sortedPrices = prices.sort((a, b) => a - b);
      const mid = Math.floor(sortedPrices.length / 2);
      stats.medianPrice = sortedPrices.length % 2 === 0 ? 
        (sortedPrices[mid - 1] + sortedPrices[mid]) / 2 : 
        sortedPrices[mid];
    }

    if (sqftCount > 0) {
      stats.averageSqft = totalSqft / sqftCount;
    }

    // Fix infinite min price
    if (stats.priceRange.min === Infinity) {
      stats.priceRange.min = 0;
    }

    self.postMessage({
      type: 'STATS_COMPLETE',
      data: stats
    });
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      error: `Stats calculation error: ${error.message}` 
    });
  }
}

// Simple fuzzy matching helper
function findFuzzyMatches(term, text) {
  let matches = 0;
  const words = text.split(' ');
  
  words.forEach(word => {
    if (word.length >= term.length - 1 && word.includes(term.substring(0, term.length - 1))) {
      matches++;
    }
  });
  
  return matches;
}", "original_text": ""}]