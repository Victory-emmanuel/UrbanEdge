import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ClockIcon, 
  HomeIcon, 
  MapPinIcon,
  CurrencyDollarIcon 
} from "@heroicons/react/24/outline";
import { propertyService } from "../../../lib/propertyService";

/**
 * Recent Properties component for displaying the 4 most recent properties
 */
const RecentProperties = () => {
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentProperties();
  }, []);

  const fetchRecentProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await propertyService.getRecentProperties();
      
      if (error) throw error;
      setRecentProperties(data || []);
    } catch (err) {
      console.error("Error fetching recent properties:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('NGN', '₦');
  };

  const cleanString = (str) => {
    if (!str) return '';
    // Remove extra quotes from database strings
    return str.replace(/^"(.*)"$/, '$1');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-brown-dark rounded-lg shadow-sm border border-gray-200 dark:border-brown p-6">
        <div className="flex items-center mb-6">
          <ClockIcon className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Properties
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-brown h-48 rounded-lg mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-brown rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-brown rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-brown rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-brown-dark rounded-lg shadow-sm border border-gray-200 dark:border-brown p-6">
        <div className="flex items-center mb-4">
          <ClockIcon className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Properties
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">Failed to load recent properties</div>
          <button
            onClick={fetchRecentProperties}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-brown-dark rounded-lg shadow-sm border border-gray-200 dark:border-brown p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ClockIcon className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Properties
          </h2>
        </div>
        <Link
          to="/properties"
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View All
        </Link>
      </div>

      {recentProperties.length === 0 ? (
        <div className="text-center py-8">
          <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No recent properties available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentProperties.map((property) => (
            <Link
              key={property.id}
              to={`/client/properties/${property.id}`}
              className="group block"
            >
              <div className="bg-gray-50 dark:bg-brown/50 rounded-lg overflow-hidden border border-gray-200 dark:border-brown hover:shadow-md transition-shadow">
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-brown">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HomeIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Property Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium capitalize">
                      {property.property_type?.name || 'Property'}
                    </span>
                  </div>

                  {/* Sale Type Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {property.sale_type?.name || 'For Sale'}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {cleanString(property.title)}
                  </h3>

                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm line-clamp-1">{cleanString(property.location)}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-blue-600 font-bold">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      <span>{formatPrice(property.price)}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(property.created_at)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-4">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                    </div>
                    <span>{property.square_feet?.toLocaleString()} sq ft</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentProperties;
