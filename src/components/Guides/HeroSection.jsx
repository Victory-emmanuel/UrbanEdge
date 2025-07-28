import { motion } from "framer-motion";
import {
  BookOpenIcon,
  LightBulbIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const HeroSection = () => {
  const features = [
    {
      icon: <BookOpenIcon className="h-6 w-6" />,
      text: "Comprehensive Guides",
    },
    {
      icon: <LightBulbIcon className="h-6 w-6" />,
      text: "Expert Insights",
    },
    {
      icon: <ChartBarIcon className="h-6 w-6" />,
      text: "Market Analysis",
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-beige-light to-beige-medium dark:from-brown-dark dark:to-brown overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light"
              >
                Real Estate{" "}
                <span className="text-taupe">Guides & Resources</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-brown dark:text-beige-medium mb-8 leading-relaxed"
              >
                Navigate the real estate market with confidence using our
                comprehensive guides, expert insights, and practical resources.
                Whether you're buying, selling, or investing, we've got you
                covered.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-6 mb-8"
              >
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-brown dark:text-beige-medium"
                  >
                    <div className="text-taupe">{feature.icon}</div>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a href="#featured-guides" className="btn-primary">
                  Explore Guides
                </a>
                <a href="#resources" className="btn-outline">
                  Browse Resources
                </a>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Real estate guides and resources"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-lg font-heading font-semibold">
                    Expert Knowledge
                  </p>
                  <p className="text-beige-light">At your fingertips</p>
                </div>
              </div>
            </motion.div>
          </div>
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
