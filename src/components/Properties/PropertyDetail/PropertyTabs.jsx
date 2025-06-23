import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PropertyTabs = ({ property }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "floorPlan", label: "Floor Plan" },
    { id: "neighborhood", label: "Neighborhood" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-beige-medium dark:border-brown mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? "text-taupe border-b-2 border-taupe"
                : "text-brown dark:text-beige-medium hover:text-taupe dark:hover:text-beige-light"
            }`}
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div>
              <h3 className="text-xl font-heading font-semibold text-brown-dark dark:text-beige-light mb-4">
                Property Description
              </h3>
              <div className="space-y-4 text-brown dark:text-beige-medium">
                <p>{property.description}</p>
                {property.additionalInfo && <p>{property.additionalInfo}</p>}
              </div>
            </div>
          )}

          {activeTab === "floorPlan" && (
            <div>
              <h3 className="text-xl font-heading font-semibold text-brown-dark dark:text-beige-light mb-4">
                Floor Plans
              </h3>
              {property.floorPlans ? (
                <div className="space-y-6">
                  {property.floorPlans.map((plan, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-brown-dark rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="p-4 border-b border-beige-medium dark:border-brown">
                        <h4 className="font-heading font-semibold text-brown-dark dark:text-beige-light">
                          {plan.name}
                        </h4>
                        <p className="text-sm text-brown dark:text-beige-medium">
                          {plan.size} sqft • {plan.bedrooms} Bed •{" "}
                          {plan.bathrooms} Bath
                        </p>
                      </div>
                      <div className="p-4">
                        <img
                          src={plan.imageUrl}
                          alt={`Floor plan for ${plan.name}`}
                          className="w-full h-auto rounded-md"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-brown dark:text-beige-medium">
                  Floor plans are not available for this property.
                </p>
              )}
            </div>
          )}

          {activeTab === "neighborhood" && (
            <div>
              <h3 className="text-xl font-heading font-semibold text-brown-dark dark:text-beige-light mb-4">
                Neighborhood
              </h3>

              {property.neighborhood ? (
                <div className="space-y-6">
                  <p className="text-brown dark:text-beige-medium">
                    {property.neighborhood.description}
                  </p>

                  {/* Map Placeholder */}
                  <div className="bg-beige-light dark:bg-brown h-64 rounded-lg flex items-center justify-center">
                    <p className="text-brown-dark dark:text-beige-light">
                      Interactive map would be displayed here
                    </p>
                  </div>

                  {/* Nearby Places */}
                  <div>
                    <h4 className="text-lg font-heading font-semibold text-brown-dark dark:text-beige-light mb-3">
                      Nearby Places
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {property.neighborhood.nearbyPlaces.map(
                        (place, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-brown-dark p-3 rounded-lg shadow-sm"
                          >
                            <div className="flex items-center">
                              <div className="text-taupe mr-3">
                                <svg
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />

                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-brown-dark dark:text-beige-light">
                                  {place.name}
                                </p>
                                <p className="text-sm text-brown dark:text-beige-medium">
                                  {place.type} • {place.distance}
                                </p>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-brown dark:text-beige-medium">
                  Neighborhood information is not available for this property.
                </p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className="text-xl font-heading font-semibold text-brown-dark dark:text-beige-light mb-4">
                Reviews
              </h3>

              {property.reviews && property.reviews.length > 0 ? (
                <div className="space-y-6">
                  {property.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-brown-dark p-4 rounded-lg shadow-md"
                    >
                      <div className="flex items-center mb-3">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />

                        <div>
                          <p className="font-medium text-brown-dark dark:text-beige-light">
                            {review.name}
                          </p>
                          <p className="text-sm text-brown dark:text-beige-medium">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? "text-taupe"
                                : "text-beige-medium dark:text-brown"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-brown dark:text-beige-medium">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-brown dark:text-beige-medium">
                  There are no reviews for this property yet.
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PropertyTabs;
