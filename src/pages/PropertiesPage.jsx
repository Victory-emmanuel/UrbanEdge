import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import PropertyFilters from "../components/Properties/PropertyFilters";
import PropertyGrid from "../components/Properties/PropertyGrid";
import PropertyMap from "../components/Properties/PropertyMap";
import PropertySort from "../components/Properties/PropertySort";
import PropertyToggleView from "../components/Properties/PropertyToggleView";
import SectionHeading from "../components/UI/SectionHeading";

// Sample property data - in a real app, this would come from an API
const sampleProperties = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    location: "Beverly Hills, CA",
    price: 4500000,
    bedrooms: 5,
    bathrooms: 4.5,
    sqft: 4200,
    type: "house",
    features: ["pool", "garden", "garage", "security"],
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    isFavorite: false,
  },
  {
    id: 2,
    title: "Downtown Penthouse",
    location: "Manhattan, NY",
    price: 3200000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2800,
    type: "apartment",
    features: ["balcony", "airConditioning", "security"],
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    isFavorite: true,
  },
  {
    id: 3,
    title: "Seaside Retreat",
    location: "Malibu, CA",
    price: 5800000,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3600,
    type: "house",
    features: ["pool", "garden", "balcony", "fireplace"],
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    isFavorite: false,
  },
  {
    id: 4,
    title: "Urban Loft",
    location: "Chicago, IL",
    price: 1200000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1800,
    type: "condo",
    features: ["airConditioning", "security"],
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
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
    type: "house",
    features: ["fireplace", "garden"],
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80",
    isFavorite: false,
  },
  {
    id: 6,
    title: "Waterfront Condo",
    location: "Miami, FL",
    price: 1800000,
    bedrooms: 2,
    bathrooms: 2.5,
    sqft: 1600,
    type: "condo",
    features: ["pool", "balcony", "airConditioning", "security"],
    imageUrl: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    isFavorite: false,
  },
  {
    id: 7,
    title: "Historic Brownstone",
    location: "Boston, MA",
    price: 3900000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    type: "townhouse",
    features: ["fireplace", "garden"],
    imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    isFavorite: false,
  },
  {
    id: 8,
    title: "Desert Oasis",
    location: "Scottsdale, AZ",
    price: 2700000,
    bedrooms: 3,
    bathrooms: 3.5,
    sqft: 2800,
    type: "house",
    features: ["pool", "airConditioning", "security"],
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
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
    type: "house",
    features: ["pool", "garden", "fireplace", "security"],
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80",
    isFavorite: false,
  },
];

const PropertiesPage = () => {
  const location = useLocation();
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "",
    features: [],
  });
  const [filteredProperties, setFilteredProperties] = useState(sampleProperties);
  const [loading, setLoading] = useState(false);

  // Parse URL query parameters on initial load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialFilters = {
      location: searchParams.get("location") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      bathrooms: searchParams.get("bathrooms") || "",
      propertyType: searchParams.get("type") || "",
      features: [],
    };

    setFilters(initialFilters);
    applyFilters(initialFilters, sortBy);
  }, [location.search]);

  const applyFilters = (currentFilters, currentSort) => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      let results = [...sampleProperties];

      // Apply filters
      if (currentFilters.location) {
        results = results.filter(property =>
          property.location.toLowerCase().includes(currentFilters.location.toLowerCase())
        );
      }

      if (currentFilters.minPrice) {
        results = results.filter(property =>
          property.price >= parseInt(currentFilters.minPrice)
        );
      }

      if (currentFilters.maxPrice) {
        results = results.filter(property =>
          property.price <= parseInt(currentFilters.maxPrice)
        );
      }

      if (currentFilters.bedrooms) {
        results = results.filter(property =>
          property.bedrooms >= parseInt(currentFilters.bedrooms)
        );
      }

      if (currentFilters.bathrooms) {
        results = results.filter(property =>
          property.bathrooms >= parseInt(currentFilters.bathrooms)
        );
      }

      if (currentFilters.propertyType) {
        results = results.filter(property =>
          property.type === currentFilters.propertyType
        );
      }

      if (currentFilters.features && currentFilters.features.length > 0) {
        results = results.filter(property =>
          currentFilters.features.every(feature => property.features.includes(feature))
        );
      }

      // Apply sorting
      switch (currentSort) {
        case "price_low":
          results.sort((a, b) => a.price - b.price);
          break;
        case "price_high":
          results.sort((a, b) => b.price - a.price);
          break;
        case "beds_high":
          results.sort((a, b) => b.bedrooms - a.bedrooms);
          break;
        case "size_high":
          results.sort((a, b) => b.sqft - a.sqft);
          break;
        case "newest":
        default:
          // Assuming id correlates with newest (higher id = newer listing)
          results.sort((a, b) => b.id - a.id);
          break;
      }

      setFilteredProperties(results);
      setLoading(false);
    }, 500);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters, sortBy);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    applyFilters(filters, newSort);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <>
      <Helmet>
        <title>Properties | UrbanEdge Real Estate</title>
        <meta name="description" content="Browse our exclusive collection of luxury properties, homes, and investment opportunities. Find your perfect property with UrbanEdge Real Estate." />
      </Helmet>

      <div className="py-12 bg-beige-light dark:bg-brown">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Explore Our Properties"
            subtitle="Discover exceptional properties in prime locations, from luxury homes to high-potential investment opportunities."
            centered
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters - Left Sidebar on Desktop */}
            <div className="lg:col-span-3">
              <PropertyFilters
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-brown-dark dark:text-beige-light mr-2">
                    {filteredProperties.length} properties found
                  </span>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <PropertySort
                    onSortChange={handleSortChange}
                    initialSort={sortBy}
                  />
                  <PropertyToggleView
                    view={view}
                    onViewChange={handleViewChange}
                  />
                </div>
              </div>

              {/* Properties Display */}
              <div className="min-h-[500px]">
                {view === "grid" ? (
                  <PropertyGrid
                    properties={filteredProperties}
                    loading={loading}
                  />
                ) : (
                  <div className="h-[700px]">
                    <PropertyMap properties={filteredProperties} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertiesPage;