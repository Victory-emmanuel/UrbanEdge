import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { heroImage } from "../../assets/images/hero.js";

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <picture>
          {heroImage.sources.map((source, index) => (
            <source
              key={index}
              media={source.media}
              srcSet={source.srcSet}
              type={source.type}
            />
          ))}
          <img
            src={heroImage.src}
            alt={heroImage.alt}
            className="w-full h-full object-cover"
            width={heroImage.width}
            height={heroImage.height}
            sizes={heroImage.sizes}
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        <div className="absolute inset-0 bg-gradient-to-r from-brown-dark/70 to-brown/50"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white mb-4"
          >
            Find Your Perfect Place to Call Home
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-beige-light text-xl mb-8"
          >
            Discover exceptional properties in prime locations with UrbanEdge,
            your trusted partner in real estate excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          ></motion.div>
          <Link
            to="/properties"
            className="inline-block bg-brown text-white font-bold py-3 px-6 rounded-full hover:text-white hover:bg-brown-dark transition duration-300"
          >
            Explore Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
