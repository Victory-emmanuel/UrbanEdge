import { motion } from "framer-motion";

const MapSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light">
        Find Us
      </h2>

      {/* Map Container */}
      <div className="bg-beige-medium dark:bg-brown rounded-lg overflow-hidden h-[400px] md:h-[500px] relative">
        {/* This would be replaced with an actual map component like Google Maps or Mapbox */}
        <div className="absolute inset-0 flex items-center justify-center bg-beige-light dark:bg-brown p-4">
          <div className="text-center">
            <p className="text-brown-dark dark:text-beige-light mb-2">
              Map Component Placeholder
            </p>
            <p className="text-sm text-brown dark:text-beige-medium">
              In a real implementation, this would be replaced with a Google
              Maps or Mapbox component
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-brown dark:text-beige-medium">
        <p>
          Note: You can click on the map markers to view our office locations.
          For detailed directions, please contact us directly.
        </p>
      </div>
    </motion.div>
  );
};

export default MapSection;
