import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 bg-beige-light dark:bg-brown overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-taupe"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light"
          >
            About UrbanEdge
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-brown dark:text-beige-medium"
          >
            We're a team of passionate real estate professionals dedicated to
            helping you find your perfect property.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
