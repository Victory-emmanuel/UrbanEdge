import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { propertyService } from "../../../lib/propertyService";
import { formatPropertyPrice } from "../../../utils/currencyUtils";
import { handleImageError, getFallbackImage } from "../../../utils/imageUtils";
import {
  handleCommunicationAction,
  getAgentContactInfo,
} from "../../../utils/communicationUtils";

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
  const [communicationError, setCommunicationError] = useState(null);

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

  // Handle communication (WhatsApp or Email)
  const handleCommunication = (type) => {
    setCommunicationError(null);

    if (!property) return;

    try {
      // Create agent object from property data
      const agent = {
        name: property.agent_name || "UrbanEdge Agent",
        email: property.agent_email || "contact@urbanedge.com",
        whatsapp_link: property.agent_whatsapp_link || null,
      };

      // Basic user info (since we don't have a form here)
      const userInfo = {
        name: "Interested Client",
        email: "client@example.com", // This will be replaced by user's actual email in the message
        phone: "",
      };

      const propertyInfo = {
        id: property.id,
        title: property.title,
      };

      const result = handleCommunicationAction(type, {
        agent,
        userInfo,
        propertyInfo,
        inquiryType: "contact",
        customMessage: `I'm interested in this property and would like more information.`,
        tourDetails: {},
      });

      if (result.success) {
        // Open the communication link
        window.open(result.url, "_blank");
      } else {
        setCommunicationError(result.error);
      }
    } catch (error) {
      setCommunicationError(
        "Failed to generate communication link. Please try again."
      );
    }
  };

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
      return [{ image_url: getFallbackImage("gallery") }];
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
                onError={(e) => handleImageError(e, "gallery")}
              />

              {sortedImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? sortedImages.length - 1 : prev - 1
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
                        prev === sortedImages.length - 1 ? 0 : prev + 1
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
                  className={`cursor-pointer h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                    index === activeImageIndex
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
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

              {/* Error Message */}
              {communicationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                  {communicationError}
                </div>
              )}

              {/* Communication Buttons */}
              <div className="space-y-3">
                {/* WhatsApp Button (Primary) */}
                <button
                  onClick={() => handleCommunication("whatsapp")}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  Contact via WhatsApp
                </button>

                {/* Email Button (Secondary) */}
                <button
                  onClick={() => handleCommunication("email")}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
