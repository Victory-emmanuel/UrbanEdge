import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PropertyTabs = ({ property }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "floorPlan", label: "Floor Plan" },
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PropertyTabs;
