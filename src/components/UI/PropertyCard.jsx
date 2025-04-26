import { useState } from "react";
import { Link } from "react-router-dom";
import { HeartIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(property.isFavorite || false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    // Here you would typically call an API to save the favorite status
  };

  return (
    <div className="card group">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 xs:h-56 sm:h-64">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Price Badge */}
        <div className="absolute top-2 xs:top-4 left-2 xs:left-4 bg-white dark:bg-brown-dark px-2 xs:px-3 py-1 rounded-md shadow-md">
          <span className="font-heading font-bold text-sm xs:text-base text-brown-dark dark:text-beige-light">
            ${property.price.toLocaleString()}
            {property.isRental && <span className="text-xs xs:text-sm font-normal">/mo</span>}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 xs:top-4 right-2 xs:right-4 p-1 xs:p-2 bg-white dark:bg-brown-dark rounded-full shadow-md hover:shadow-lg transition-shadow"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <HeartIconSolid className="h-4 w-4 xs:h-5 xs:w-5 text-destructive" />
          ) : (
            <HeartIcon className="h-4 w-4 xs:h-5 xs:w-5 text-brown-dark dark:text-beige-light" />
          )}
        </button>

        {/* Property Type Badge */}
        {property.type && (
          <div className="absolute bottom-2 xs:bottom-4 left-2 xs:left-4 bg-taupe text-white px-2 xs:px-3 py-1 text-xs xs:text-sm rounded-md">
            {property.type}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 xs:p-4">
        <h3 className="font-heading font-bold text-base xs:text-lg sm:text-xl mb-1 xs:mb-2 text-brown-dark dark:text-beige-light line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center mb-2 xs:mb-3 text-brown dark:text-beige-medium">
          <MapPinIcon className="h-3 w-3 xs:h-4 xs:w-4 mr-1 flex-shrink-0" />
          <span className="text-xs xs:text-sm truncate">{property.location}</span>
        </div>

        {/* Features */}
        <div className="flex justify-between mb-3 xs:mb-4 text-brown dark:text-beige-medium">
          <div className="flex items-center">
            <svg className="h-3 w-3 xs:h-4 xs:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-xs xs:text-sm">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <svg className="h-3 w-3 xs:h-4 xs:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-xs xs:text-sm">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <svg className="h-3 w-3 xs:h-4 xs:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="text-xs xs:text-sm">{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/properties/${property.id}`}
          className="block w-full text-center py-1 xs:py-2 text-xs xs:text-sm border-2 border-taupe text-taupe hover:bg-taupe hover:text-white transition-colors duration-300 rounded-md font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
