import { useState, useEffect } from 'react';
import { propertyService } from '../../../lib/propertyService';

/**
 * Client Dashboard component for displaying and filtering properties
 */
const ClientDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [saleTypes, setSaleTypes] = useState([]);
  const [features, setFeatures] = useState([]);
  const [filters, setFilters] = useState({
    propertyTypeId: '',
    saleTypeId: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    minBathrooms: '',
    selectedFeatures: []
  });

  // Fetch properties and reference data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch reference data
        const [propertyTypesRes, saleTypesRes, featuresRes] = await Promise.all([
          propertyService.getPropertyTypes(),
          propertyService.getSaleTypes(),
          propertyService.getFeatures()
        ]);

        if (propertyTypesRes.error) throw propertyTypesRes.error;
        if (saleTypesRes.error) throw saleTypesRes.error;
        if (featuresRes.error) throw featuresRes.error;

        setPropertyTypes(propertyTypesRes.data || []);
        setSaleTypes(saleTypesRes.data || []);
        setFeatures(featuresRes.data || []);

        // Fetch properties
        await fetchProperties();
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch properties with current filters
  const fetchProperties = async () => {
    try {
      const { data, error } = await propertyService.getProperties(filters);
      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle feature selection
  const handleFeatureToggle = (featureId) => {
    setFilters(prev => {
      const selectedFeatures = [...prev.selectedFeatures];
      
      if (selectedFeatures.includes(featureId)) {
        return {
          ...prev,
          selectedFeatures: selectedFeatures.filter(id => id !== featureId)
        };
      } else {
        return {
          ...prev,
          selectedFeatures: [...selectedFeatures, featureId]
        };
      }
    });
  };

  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      propertyTypeId: '',
      saleTypeId: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      minBathrooms: '',
      selectedFeatures: []
    });
    // Fetch properties without filters
    fetchProperties();
  };

  // Format price display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get feature names for a property
  const getPropertyFeatures = (property) => {
    if (!property.property_features || !property.property_features.length) {
      return 'None';
    }

    return property.property_features
      .map(pf => pf.feature?.name)
      .filter(Boolean)
      .join(', ');
  };

  // Get primary image for a property
  const getPrimaryImage = (property) => {
    if (!property.property_images || !property.property_images.length) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }

    // Sort by order and get the first one
    const sortedImages = [...property.property_images].sort((a, b) => a.order - b.order);
    return sortedImages[0].image_url;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Find Your Dream Property</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <form onSubmit={applyFilters}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="propertyTypeId"
                value={filters.propertyTypeId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Property Types</option>
                {propertyTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            {/* Sale Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sale Type
              </label>
              <select
                name="saleTypeId"
                value={filters.saleTypeId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Sale Types</option>
                {saleTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min $"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max $"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Bedrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Bedrooms
              </label>
              <select
                name="minBedrooms"
                value={filters.minBedrooms}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>

            {/* Bathrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Bathrooms
              </label>
              <select
                name="minBathrooms"
                value={filters.minBathrooms}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>
          </div>

          {/* Features Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {features.map(feature => (
                <div key={feature.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`feature-${feature.id}`}
                    checked={filters.selectedFeatures.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`feature-${feature.id}`} className="ml-2 text-sm text-gray-700">
                    {feature.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={getPrimaryImage(property)}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 truncate">{property.title}</h3>
                <p className="text-gray-600 mb-2">{property.location}</p>
                <p className="text-blue-600 font-bold text-xl mb-2">{formatPrice(property.price)}</p>
                
                <div className="flex justify-between text-gray-500 mb-2">
                  <span>{property.bedrooms} Beds</span>
                  <span>{property.bathrooms} Baths</span>
                  <span>{property.square_feet} sqft</span>
                </div>
                
                <div className="border-t pt-2 mt-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Type:</span> {property.property_type?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Sale Type:</span> {property.sale_type?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    <span className="font-medium">Features:</span> {getPropertyFeatures(property)}
                  </p>
                </div>
                
                <button
                  className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => window.location.href = `/properties/${property.id}`}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600 mb-2">No properties found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;