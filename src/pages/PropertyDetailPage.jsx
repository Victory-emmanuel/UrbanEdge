import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { HeartIcon, ArrowLeftIcon, ShareIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

import PropertyGallery from "../components/Properties/PropertyDetail/PropertyGallery";
import PropertyFeatures from "../components/Properties/PropertyDetail/PropertyFeatures";
import PropertyTabs from "../components/Properties/PropertyDetail/PropertyTabs";
import PropertyContactForm from "../components/Properties/PropertyDetail/PropertyContactForm";
import PropertyMortgageCalculator from "../components/Properties/PropertyDetail/PropertyMortgageCalculator";
import SimilarProperties from "../components/Properties/PropertyDetail/SimilarProperties";

// Sample property data - in a real app, this would come from an API
const sampleProperty = {
  id: 1,
  title: "Modern Luxury Villa with Ocean View",
  location: "Beverly Hills, CA",
  price: 4500000,
  features: {
    bedrooms: 5,
    bathrooms: 4.5,
    area: 4200,
    garage: 2,
    yearBuilt: 2020,
    propertyType: "Villa",
  },
  amenities: ["pool", "garden", "garage", "balcony", "airConditioning", "security", "fireplace"],
  description: "This stunning modern villa offers breathtaking ocean views and luxurious living spaces. Featuring an open floor plan with high ceilings, floor-to-ceiling windows, and premium finishes throughout. The gourmet kitchen includes top-of-the-line appliances, custom cabinetry, and a large center island. The primary suite boasts a spa-like bathroom and private balcony. Outside, enjoy the infinity pool, landscaped gardens, and multiple entertaining areas.",
  additionalInfo: "The property includes smart home technology, solar panels, and a state-of-the-art security system. Located in a prestigious gated community with easy access to shopping, dining, and entertainment.",
  images: [
    { url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", alt: "Front view of modern luxury villa" },
    { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", alt: "Living room with ocean view" },
    { url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", alt: "Modern kitchen with island" },
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", alt: "Backyard with pool" },
    { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", alt: "Master bedroom" },
  ],
  floorPlans: [
    {
      name: "Main Floor",
      size: 2500,
      bedrooms: 3,
      bathrooms: 2.5,
      imageUrl: "https://images.unsplash.com/photo-1580800218522-fae1a9d6b1d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      name: "Second Floor",
      size: 1700,
      bedrooms: 2,
      bathrooms: 2,
      imageUrl: "https://images.unsplash.com/photo-1580800218522-fae1a9d6b1d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  neighborhood: {
    description: "Located in the prestigious Beverly Hills neighborhood, this property offers the perfect blend of privacy and convenience. Enjoy proximity to high-end shopping, fine dining, and cultural attractions.",
    nearbyPlaces: [
      { name: "Beverly Hills High School", type: "School", distance: "0.5 miles" },
      { name: "Rodeo Drive", type: "Shopping", distance: "1.2 miles" },
      { name: "Beverly Hills Park", type: "Park", distance: "0.8 miles" },
      { name: "Cedars-Sinai Medical Center", type: "Hospital", distance: "2.5 miles" },
      { name: "The Grove", type: "Shopping & Dining", distance: "3.1 miles" },
      { name: "Beverly Hills Country Club", type: "Recreation", distance: "1.7 miles" },
    ],
  },
  reviews: [
    {
      name: "Michael Johnson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      date: "August 15, 2023",
      rating: 5,
      comment: "I recently toured this property and was blown away by the attention to detail and quality of finishes. The views are even more spectacular in person!",
    },
    {
      name: "Sarah Williams",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      date: "July 28, 2023",
      rating: 4,
      comment: "The location and amenities are fantastic. The only reason I'm giving 4 stars instead of 5 is because the property would benefit from some additional landscaping in the side yard.",
    },
  ],
  agent: {
    name: "Jennifer Parker",
    title: "Luxury Property Specialist",
    phone: "(310) 555-1234",
    email: "jennifer@urbanedge.com",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
  },
};

// Sample similar properties
const similarProperties = [
  {
    id: 3,
    title: "Seaside Retreat",
    location: "Malibu, CA",
    price: 5800000,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3600,
    type: "House",
    features: ["pool", "garden", "balcony", "fireplace"],
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    isFavorite: false,
  },
  {
    id: 5,
    title: "Mountain View Cabin",
    location: "Aspen, CO",
    price: 2100000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2200,
    type: "House",
    features: ["fireplace", "garden"],
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80",
    isFavorite: false,
  },
  {
    id: 9,
    title: "Lakefront Property",
    location: "Lake Tahoe, NV",
    price: 4200000,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3800,
    type: "House",
    features: ["pool", "garden", "fireplace", "security"],
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80",
    isFavorite: false,
  },
];

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch property details
    setLoading(true);
    setTimeout(() => {
      // In a real app, you would fetch the property with the matching ID
      setProperty(sampleProperty);
      setLoading(false);
    }, 800);
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would call an API to save the favorite status
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert("Share functionality would be implemented here");
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

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-heading font-bold text-brown-dark dark:text-beige-light mb-4">
          Property Not Found
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

  return (
    <>
      <Helmet>
        <title>{property.title} | UrbanEdge Real Estate</title>
        <meta name="description" content={`${property.title} - ${property.location}. ${property.features.bedrooms} bedrooms, ${property.features.bathrooms} bathrooms, ${property.features.area} sqft. Offered at $${property.price.toLocaleString()}.`} />
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
            <PropertyGallery images={property.images} />
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
                  ${property.price.toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={toggleFavorite}
                  className="p-3 bg-white dark:bg-brown-dark rounded-full shadow-md hover:shadow-lg transition-shadow"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
              features={property.features}
              amenities={property.amenities}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2">
              <PropertyTabs property={property} />
            </div>

            {/* Right Column - Contact Form & Mortgage Calculator */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PropertyContactForm
                  agent={property.agent}
                  propertyTitle={property.title}
                />
              </motion.div>

              <PropertyMortgageCalculator propertyPrice={property.price} />
            </div>
          </div>

          {/* Similar Properties */}
          <SimilarProperties properties={similarProperties} />
        </div>
      </div>
    </>
  );
};

export default PropertyDetailPage;
