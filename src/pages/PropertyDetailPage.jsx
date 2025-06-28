import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  HeartIcon,
  ArrowLeftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { propertyService } from "../lib/propertyService";

import PropertyGallery from "../components/Properties/PropertyDetail/PropertyGallery";
import PropertyFeatures from "../components/Properties/PropertyDetail/PropertyFeatures";
import PropertyTabs from "../components/Properties/PropertyDetail/PropertyTabs";
import PropertyContactForm from "../components/Properties/PropertyDetail/PropertyContactForm";
// import PropertyMortgageCalculator from "../components/Properties/PropertyDetail/PropertyMortgageCalculator";
import SimilarProperties from "../components/Properties/PropertyDetail/SimilarProperties";
import PropertyLocationMap from "../components/Map/PropertyLocationMap";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch property details
        const { data, error } = await propertyService.getPropertyById(id);

        if (error) {
          throw new Error(error.message || "Failed to fetch property details");
        }

        if (!data) {
          throw new Error("Property not found");
        }

        console.log('PropertyDetailPage: Fetched property data:', data);

        // Handle the nested structure returned by get_property_details
        const propertyData = data.property || data;
        const propertyWithImages = {
          ...propertyData,
          images: data.images || [],
          features: data.features || []
        };

        setProperty(propertyWithImages);

        // Fetch similar properties based on property type
        const propertyTypeId = propertyData.property_type_id || data.property_type_id;
        if (propertyTypeId) {
          const similarParams = {
            property_type_ids: [propertyTypeId],
            limit_val: 4,
            offset_val: 0,
            exclude_property_id: id,
          };

          const { data: similarData } =
            await propertyService.getProperties(similarParams);
          if (similarData && similarData.properties) {
            setSimilarProperties(similarData.properties);
          }
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would call an API to save the favorite status
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    navigator.share
      ? navigator
          .share({
            title: property.title,
            text: `Check out this property: ${property.title}`,
            url: window.location.href,
          })
          .catch((err) => console.error("Share failed:", err))
      : alert("Share functionality not supported in this browser");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-[500px] bg-beige-medium dark:bg-brown rounded-lg mb-8"></div>
          <div className="h-8 bg-beige-medium dark:bg-brown rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-beige-medium dark:bg-brown rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-40 bg-beige-medium dark:bg-brown rounded mb-8"></div>
              <div className="h-80 bg-beige-medium dark:bg-brown rounded"></div>
            </div>
            <div className="h-96 bg-beige-medium dark:bg-brown rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-heading font-bold text-brown-dark dark:text-beige-light mb-4">
          {error || "Property Not Found"}
        </h2>
        <p className="text-brown dark:text-beige-medium mb-6">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/properties" className="btn-primary">
          Browse Properties
        </Link>
      </div>
    );
  }

  // Extract features and amenities from property data
  const propertyFeatures = {
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.square_feet,
    yearBuilt: property.year_built,
    propertyType: property.property_type?.name,
  };

  // Convert features array to expected format for PropertyFeatures component
  const amenities =
    property.features?.map((feature) =>
      feature.name.toLowerCase().replace(/\s+/g, ""),
    ) || [];

  return (
    <>
      <Helmet>
        <title>{property?.title || "Property Details"} | UrbanEdge Real Estate</title>
        <meta
          name="description"
          content={`${property?.title || "Property"} - ${property?.location || "Location"}. ${property?.bedrooms || 0} bedrooms, ${property?.bathrooms || 0} bathrooms, ${property?.square_feet || 0} sqft. Offered at $${property?.price?.toLocaleString() || "N/A"}.`}
        />
      </Helmet>

      <div className="bg-beige-light dark:bg-brown">
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/properties"
              className="inline-flex items-center text-brown-dark dark:text-beige-light hover:text-taupe dark:hover:text-beige-medium transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Properties
            </Link>
          </div>

          {/* Property Gallery */}
          <div className="mb-8">
            <PropertyGallery
              images={property.images?.map((img) => ({
                url: img.url || img.image_url,
                alt: property.title || "Property image",
              })) || property.property_images?.map((img) => ({
                url: img.image_url || img.url,
                alt: property.title || "Property image",
              }))}
            />
          </div>

          {/* Property Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-brown-dark dark:text-beige-light mb-2">
                  {property.title}
                </h1>
                <p className="text-lg text-brown dark:text-beige-medium mb-2">
                  {property.location}
                </p>
                <p className="text-2xl font-heading font-bold text-taupe">
                  ${property.price?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={toggleFavorite}
                  className="p-3 bg-white dark:bg-brown-dark rounded-full shadow-md hover:shadow-lg transition-shadow"
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  {isFavorite ? (
                    <HeartIconSolid className="h-6 w-6 text-destructive" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-brown-dark dark:text-beige-light" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white dark:bg-brown-dark rounded-full shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Share property"
                >
                  <ShareIcon className="h-6 w-6 text-brown-dark dark:text-beige-light" />
                </button>
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="mb-12">
            <PropertyFeatures
              features={propertyFeatures}
              amenities={amenities}
            />
          </div>

          {/* Property Location Map */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white dark:bg-brown-dark rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-heading font-bold text-brown-dark dark:text-beige-light mb-4">
                  Property Location
                </h2>
                <div className="mb-4">
                  <p className="text-brown dark:text-beige-medium">
                    <span className="font-semibold">Address:</span> {property.location}
                  </p>
                </div>
                <PropertyLocationMap
                  property={property}
                  height="400px"
                  showPopup={true}
                  zoom={15}
                />
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2">
              <PropertyTabs
                property={{
                  description: property.description,
                  floorPlans: property.floor_plan_url
                    ? [
                        {
                          name: "Floor Plan",
                          imageUrl: property.floor_plan_url,
                          size: property.square_feet,
                          bedrooms: property.bedrooms,
                          bathrooms: property.bathrooms,
                        },
                      ]
                    : [],
                  neighborhood: {
                    description:
                      property.neighborhood ||
                      "Neighborhood information not available.",
                    nearbyPlaces: [],
                  },
                  reviews: [],
                }}
              />
            </div>

            {/* Right Column - Contact Form & Mortgage Calculator */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PropertyContactForm
                  agent={
                    property.agent || {
                      name: "UrbanEdge Agent",
                      title: "Real Estate Agent",
                      phone: "(555) 123-4567",
                      email: "contact@urbanedge.com",
                      photo:
                        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
                    }
                  }
                  propertyTitle={property.title}
                />
              </motion.div>

              {/* <PropertyMortgageCalculator propertyPrice={property?.price || 0} /> */}
            </div>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <SimilarProperties properties={similarProperties} />
          )}
        </div>
      </div>
    </>
  );
};

export default PropertyDetailPage;
