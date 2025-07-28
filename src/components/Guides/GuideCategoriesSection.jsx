import { motion } from "framer-motion";
import { 
  HomeIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  DocumentTextIcon,
  KeyIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";

const GuideCategoriesSection = () => {
  const categories = [
    {
      icon: <HomeIcon className="h-8 w-8" />,
      title: "Buying Guides",
      description: "Complete guides for first-time and experienced buyers",
      count: "12 Guides",
      color: "bg-blue-500"
    },
    {
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      title: "Selling Guides",
      description: "Maximize your property value with expert selling tips",
      count: "8 Guides",
      color: "bg-green-500"
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "Investment Strategies",
      description: "Build wealth through smart real estate investments",
      count: "15 Guides",
      color: "bg-purple-500"
    },
    {
      icon: <DocumentTextIcon className="h-8 w-8" />,
      title: "Legal & Finance",
      description: "Navigate contracts, mortgages, and legal requirements",
      count: "10 Guides",
      color: "bg-orange-500"
    },
    {
      icon: <KeyIcon className="h-8 w-8" />,
      title: "Property Management",
      description: "Manage your rental properties like a professional",
      count: "6 Guides",
      color: "bg-red-500"
    },
    {
      icon: <BuildingOfficeIcon className="h-8 w-8" />,
      title: "Commercial Real Estate",
      description: "Commercial property investment and management",
      count: "9 Guides",
      color: "bg-indigo-500"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-brown-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Guide Categories
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            Explore our comprehensive collection of real estate guides organized by category. 
            Find exactly what you need to make informed decisions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="bg-beige-light dark:bg-brown rounded-lg p-6 hover:shadow-lg transition-all duration-300 group-hover:transform group-hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-taupe">
                    {category.icon}
                  </div>
                  <span className="text-xs font-medium text-brown dark:text-beige-medium bg-white dark:bg-brown-dark px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </div>
                
                <h3 className="text-xl font-heading font-semibold mb-3 text-brown-dark dark:text-beige-light group-hover:text-taupe transition-colors">
                  {category.title}
                </h3>
                
                <p className="text-brown dark:text-beige-medium mb-4">
                  {category.description}
                </p>
                
                <div className="flex items-center text-taupe font-medium text-sm group-hover:text-brown dark:group-hover:text-beige-light transition-colors">
                  <span>Explore Guides</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-taupe to-brown text-white rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-heading font-semibold mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-beige-light mb-6">
              Our team of experts is constantly creating new guides and resources. 
              Let us know what topics you'd like us to cover next.
            </p>
            <a
              href="/contact"
              className="btn bg-white text-brown-dark hover:bg-beige-light"
            >
              Request a Guide
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GuideCategoriesSection;
