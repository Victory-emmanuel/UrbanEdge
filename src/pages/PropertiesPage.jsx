import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { propertyService } from "../lib/propertyService";
import PropertyFilters from "../components/Properties/PropertyFilters";
import PropertyGrid from "../components/Properties/PropertyGrid";
import PropertyMap from "../components/Properties/PropertyMap";
import PropertySort from "../components/Properties/PropertySort";
import PropertyToggleView from "../components/Properties/PropertyToggleView";
import SectionHeading from "../components/UI/SectionHeading";
import Pagination from "../components/UI/Pagination";

const PropertiesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    minBedrooms: "",
    maxBedrooms: "",
    minBathrooms: "",
    maxBathrooms: "",
    propertyType: "",
    saleType: "",
    features: [],
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
  });
  const [filterOptions, setFilterOptions] = useState({
    propertyTypes: [],
    saleTypes: [],
    features: [],
  });

  // Fetch filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data, error } = await propertyService.getFilterOptions();
        if (error)
          throw new Error(error.message || "Failed to fetch filter options");

        setFilterOptions({
          propertyTypes: data.property_types || [],
          saleTypes: data.sale_types || [],
          features: data.features || [],
        });
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setError("Failed to load filter options. Please try again later.");
      }
    };

    fetchFilterOptions();
  }, []);

  // Parse URL query parameters on initial load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialFilters = {
      location: searchParams.get("location") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      minBedrooms: searchParams.get("minBedrooms") || "",
      maxBedrooms: searchParams.get("maxBedrooms") || "",
      minBathrooms: searchParams.get("minBathrooms") || "",
      maxBathrooms: searchParams.get("maxBathrooms") || "",
      propertyType: searchParams.get("propertyType") || "",
      saleType: searchParams.get("saleType") || "",
      features: searchParams.get("features")
        ? searchParams.get("features").split(",")
        : [],
    };

    const page = parseInt(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort") || "newest";

    // Handle map-specific parameters
    if (searchParams.get("lat") && searchParams.get("lng")) {
      setView("map"); // Switch to map view if coordinates are provided
    }

    if (searchParams.get("property")) {
      setSelectedPropertyId(searchParams.get("property"));
    }

    setFilters(initialFilters);
    setSortBy(sort);
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, [location.search]);

  // Fetch properties when filters, sort, or pagination changes
  useEffect(() => {
    fetchProperties();
  }, [filters, sortBy, pagination.currentPage]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const offset = (pagination.currentPage - 1) * pagination.limit;

      const {
        data,
        totalCount,
        limit,
        offset: returnedOffset,
        error,
      } = await propertyService.getProperties({
        ...filters,
        sortBy,
        limit: pagination.limit,
        offset,
      });

      if (error) throw new Error(error.message || "Failed to fetch properties");

      setProperties(data || []);
      setPagination((prev) => ({
        ...prev,
        totalCount: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / (limit || pagination.limit)),
      }));
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties. Please try again later.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    // Reset to page 1 when filters change
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setFilters(newFilters);

    // Update URL with new filters
    updateUrl(newFilters, sortBy, 1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);

    // Update URL with new sort
    updateUrl(filters, newSort, pagination.currentPage);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));

    // Update URL with new page
    updateUrl(filters, sortBy, newPage);
  };

  const updateUrl = (currentFilters, currentSort, page) => {
    const params = new URLSearchParams();

    // Add filters to URL
    if (currentFilters.location)
      params.set("location", currentFilters.location);
    if (currentFilters.minPrice)
      params.set("minPrice", currentFilters.minPrice);
    if (currentFilters.maxPrice)
      params.set("maxPrice", currentFilters.maxPrice);
    if (currentFilters.minBedrooms)
      params.set("minBedrooms", currentFilters.minBedrooms);
    if (currentFilters.maxBedrooms)
      params.set("maxBedrooms", currentFilters.maxBedrooms);
    if (currentFilters.minBathrooms)
      params.set("minBathrooms", currentFilters.minBathrooms);
    if (currentFilters.maxBathrooms)
      params.set("maxBathrooms", currentFilters.maxBathrooms);
    if (currentFilters.propertyType)
      params.set("propertyType", currentFilters.propertyType);
    if (currentFilters.saleType)
      params.set("saleType", currentFilters.saleType);
    if (currentFilters.features && currentFilters.features.length > 0) {
      params.set("features", currentFilters.features.join(","));
    }

    // Add sort and page to URL
    params.set("sort", currentSort);
    params.set("page", page.toString());

    // Update URL without reloading the page
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <>
      <Helmet>
        <title>Properties | UrbanEdge Real Estate</title>
        <meta
          name="description"
          content="Browse our exclusive collection of luxury properties, homes, and investment opportunities. Find your perfect property with UrbanEdge Real Estate."
        />
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
                filterOptions={filterOptions}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-brown-dark dark:text-beige-light mr-2">
                    {pagination.totalCount} properties found
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

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              {/* Properties Display */}
              <div className="min-h-[500px]">
                {view === "grid" ? (
                  <PropertyGrid properties={properties} loading={loading} />
                ) : (
                  <div className="h-[700px]">
                    <PropertyMap
                      properties={properties}
                      selectedPropertyId={selectedPropertyId}
                      onPropertySelect={(property) => setSelectedPropertyId(property.id)}
                    />
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!loading && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertiesPage;
