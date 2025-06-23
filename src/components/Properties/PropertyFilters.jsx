import { useState } from "react";
import { motion } from "framer-motion";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const PropertyFilters = ({
  onFilterChange,
  initialFilters,
  filterOptions = {},
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(
    initialFilters || {
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
    },
  );

  // Use dynamic property types from filterOptions or fallback to empty array
  const propertyTypes = [
    { id: "", name: "All Types" },
    ...(filterOptions.propertyTypes || []),
  ];

  // Use dynamic sale types from filterOptions or fallback to empty array
  const saleTypes = [
    { id: "", name: "All Sale Types" },
    ...(filterOptions.saleTypes || []),
  ];

  // Use dynamic features from filterOptions or fallback to empty array
  const features = filterOptions.features || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const featureId = name; // Keep as string UUID, don't convert to integer

    const updatedFeatures = checked
      ? [...filters.features, featureId]
      : filters.features.filter((id) => id !== featureId);

    setFilters({ ...filters, features: updatedFeatures });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
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
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={toggleFilters}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-brown-dark rounded-lg shadow-md text-brown-dark dark:text-beige-light"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          {isOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters Panel */}
      <motion.div
        className={`bg-white dark:bg-brown-dark rounded-lg shadow-lg p-5 ${
          isOpen ? "block" : "hidden md:block"
        }`}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen || window.innerWidth >= 768 ? 1 : 0,
          height: isOpen || window.innerWidth >= 768 ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-heading font-semibold text-brown-dark dark:text-beige-light">
            Filters
          </h3>
          <button
            onClick={toggleFilters}
            className="md:hidden text-brown-dark dark:text-beige-light"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="City, neighborhood, or address"
              className="input"
              value={filters.location}
              onChange={handleInputChange}
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1">
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                className="input"
                value={filters.minPrice}
                onChange={handleInputChange}
              />

              <span className="text-brown-dark dark:text-beige-light">-</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                className="input"
                value={filters.maxPrice}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="minBedrooms"
                className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
              >
                Bedrooms (Min)
              </label>
              <select
                id="minBedrooms"
                name="minBedrooms"
                className="input"
                value={filters.minBedrooms}
                onChange={handleInputChange}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="minBathrooms"
                className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
              >
                Bathrooms (Min)
              </label>
              <select
                id="minBathrooms"
                name="minBathrooms"
                className="input"
                value={filters.minBathrooms}
                onChange={handleInputChange}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label
              htmlFor="propertyType"
              className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
            >
              Property Type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              className="input"
              value={filters.propertyType}
              onChange={handleInputChange}
            >
              {propertyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sale Type */}
          <div>
            <label
              htmlFor="saleType"
              className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
            >
              Sale Type
            </label>
            <select
              id="saleType"
              name="saleType"
              className="input"
              value={filters.saleType}
              onChange={handleInputChange}
            >
              {saleTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Features */}
          <div>
            <p className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-2">
              Features
            </p>
            <div className="grid grid-cols-2 gap-2">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`feature-${feature.id}`}
                    name={feature.id}
                    checked={filters.features.includes(feature.id)}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-taupe border-taupe rounded focus:ring-taupe"
                  />

                  <label
                    htmlFor={`feature-${feature.id}`}
                    className="ml-2 text-sm text-brown-dark dark:text-beige-light"
                  >
                    {feature.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-beige-medium dark:border-brown">
            <button onClick={handleApplyFilters} className="btn-primary flex-1">
              Apply Filters
            </button>
            <button onClick={handleResetFilters} className="btn-outline flex-1">
              Reset
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PropertyFilters;
