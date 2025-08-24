import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80"
          alt="Modern luxury interior"
          className="w-full h-full object-cover"
          width="1973"
          height="1316"
          loading="eager"
          decoding="async"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-brown-dark/90 to-brown/70"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white"
          >
            Our Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-beige-light mb-8"
          >
            Comprehensive real estate solutions tailored to your unique needs,
            delivered with expertise and personalized attention.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
