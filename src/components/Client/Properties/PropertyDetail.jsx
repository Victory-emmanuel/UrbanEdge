import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { propertyService } from "../../../lib/propertyService";
import { formatPropertyPrice } from "../../../utils/currencyUtils";
import { handleImageError, getFallbackImage } from "../../../utils/imageUtils";

/**
 * Property Detail component for displaying detailed information about a property
 */
const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await propertyService.getPropertyById(id);
        if (error) throw error;
        if (!data) throw new Error("Property not found");

        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Format price display
  // const formatPrice = (price) => {
  //   const formattedNumber = new Intl.NumberFormat("en-NG", {
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   }).format(price);
  //   return `₦${formattedNumber}`;
  // };

  // Get sorted images with reliable fallback
  const getSortedImages = () => {
    if (!property?.property_images || !property.property_images.length) {
      return [
        { image_url: getFallbackImage('gallery') },
      ];
    }

    return [...property.property_images].sort((a, b) => a.order - b.order);
  };

  // Get feature names
  const getFeatures = () => {
    if (!property?.property_features || !property.property_features.length) {
      return [];
    }

    return property.property_features.map((pf) => pf.feature).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const sortedImages = getSortedImages();
  const features = getFeatures();

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Properties
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Property Title and Price */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <p className="text-gray-600 text-lg">{property.location}</p>
              {property.neighborhood && (
                <p className="text-gray-500">{property.neighborhood}</p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-3xl font-bold text-blue-600">
               {formatPropertyPrice(property.price)}
              </p>
              <p className="text-gray-500 text-right">
                {property.sale_type?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="p-6">
          <div className="mb-4">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img
                src={sortedImages[activeImageIndex]?.image_url}
                alt={`Property ${activeImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, 'gallery')}
              />

              {sortedImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? sortedImages.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === sortedImages.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {sortedImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {sortedImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`cursor-pointer h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${index === activeImageIndex ? "border-blue-500" : "border-transparent"}`}
                >
                  <img
                    src={image.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/100?text=Error";
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-t">
          <div className="col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Property Details</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500 text-sm">Bedrooms</p>
                <p className="text-xl font-semibold">{property.bedrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500 text-sm">Bathrooms</p>
                <p className="text-xl font-semibold">{property.bathrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500 text-sm">Square Feet</p>
                <p className="text-xl font-semibold">{property.square_feet}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500 text-sm">Property Type</p>
                <p className="text-xl font-semibold">
                  {property.property_type?.name || "N/A"}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {property.description || "No description provided."}
            </p>

            {property.floor_plan_url && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Floor Plan</h3>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={property.floor_plan_url}
                    alt="Floor Plan"
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/800x600?text=Floor+Plan+Not+Available";
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              {features.length > 0 ? (
                <ul className="space-y-2">
                  {features.map((feature) => (
                    <li key={feature.id} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No features listed</p>
              )}
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Contact Information
              </h3>
              <p className="text-gray-700 mb-4">
                Interested in this property? Contact us for more information or
                to schedule a viewing.
              </p>
              <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() =>
                  (window.location.href =
                    "mailto:contact@urbanedge.com?subject=Inquiry about " +
                    property.title)
                }
              >
                Contact Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
