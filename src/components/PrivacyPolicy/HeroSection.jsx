import { motion } from "framer-motion";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-beige-light to-beige-medium dark:from-brown-dark dark:to-brown">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-taupe/20 p-4 rounded-full">
              <ShieldCheckIcon className="h-16 w-16 text-taupe" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light"
          >
            Privacy Policy
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-brown dark:text-beige-medium mb-6 max-w-3xl mx-auto"
          >
            Your privacy and data security are fundamental to how we operate. 
            This policy explains how UrbanEdge Real Estate collects, uses, and protects your personal information.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm text-brown dark:text-beige-medium"
          >
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-taupe/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brown/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default HeroSection;
