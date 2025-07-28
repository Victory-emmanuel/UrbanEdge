import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-beige-light to-beige-medium dark:from-brown-dark dark:to-brown">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light"
          >
            Frequently Asked Questions
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-brown dark:text-beige-medium mb-8 max-w-3xl mx-auto"
          >
            Get answers to the most common questions about our real estate services, 
            buying and selling processes, property management, and more. Can't find what 
            you're looking for? Our team is here to help.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#faq-section"
              className="btn-primary"
            >
              Browse Questions
            </a>
            <a
              href="/contact"
              className="btn-outline"
            >
              Contact Us
            </a>
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
