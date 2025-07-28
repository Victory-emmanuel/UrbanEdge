import { motion } from "framer-motion";
import { ClockIcon, UserIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const FeaturedGuidesSection = () => {
  const featuredGuides = [
    {
      title: "First-Time Buyer's Complete Guide",
      description: "Everything you need to know about buying your first property in Nigeria, from budgeting to closing.",
      author: "Sarah Johnson",
      readTime: "15 min read",
      category: "Buying",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      featured: true
    },
    {
      title: "Property Investment ROI Calculator",
      description: "Learn how to calculate returns on real estate investments and make data-driven decisions.",
      author: "Michael Chen",
      readTime: "10 min read",
      category: "Investment",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      featured: true
    },
    {
      title: "Selling Your Property: A Step-by-Step Guide",
      description: "Maximize your property's value with our comprehensive selling strategy and timeline.",
      author: "Emma Williams",
      readTime: "12 min read",
      category: "Selling",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      featured: true
    },
    {
      title: "Understanding Nigerian Property Laws",
      description: "Navigate the legal landscape of property ownership, transfers, and documentation in Nigeria.",
      author: "David Okafor",
      readTime: "18 min read",
      category: "Legal",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      featured: false
    },
    {
      title: "Rental Property Management Best Practices",
      description: "Professional tips for managing rental properties, tenant relations, and maximizing income.",
      author: "Grace Adebayo",
      readTime: "14 min read",
      category: "Management",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      featured: false
    },
    {
      title: "Commercial Real Estate Investment Guide",
      description: "Explore opportunities in commercial real estate and learn about different investment strategies.",
      author: "James Thompson",
      readTime: "20 min read",
      category: "Commercial",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      featured: false
    }
  ];

  const featuredGuidesList = featuredGuides.filter(guide => guide.featured);
  const regularGuides = featuredGuides.filter(guide => !guide.featured);

  return (
    <section id="featured-guides" className="py-16 bg-beige-light dark:bg-brown">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Featured Guides
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            Our most popular and comprehensive guides, handpicked by our experts 
            to help you succeed in your real estate journey.
          </p>
        </motion.div>

        {/* Featured Guides Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {featuredGuidesList.map((guide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-brown-dark rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-taupe text-white px-3 py-1 rounded-full text-sm font-medium">
                    {guide.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold mb-3 text-brown-dark dark:text-beige-light group-hover:text-taupe transition-colors">
                  {guide.title}
                </h3>
                
                <p className="text-brown dark:text-beige-medium mb-4 text-sm">
                  {guide.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-brown dark:text-beige-medium mb-4">
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    {guide.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    {guide.readTime}
                  </div>
                </div>
                
                <button className="w-full btn-primary text-sm">
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download Guide
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Regular Guides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-2xl font-heading font-bold mb-8 text-brown-dark dark:text-beige-light text-center">
            More Guides & Resources
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularGuides.map((guide, index) => (
              <div
                key={index}
                className="bg-white dark:bg-brown-dark rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-beige-medium dark:bg-brown text-brown-dark dark:text-beige-light px-2 py-1 rounded text-xs font-medium">
                    {guide.category}
                  </span>
                  <div className="text-xs text-brown dark:text-beige-medium">
                    {guide.readTime}
                  </div>
                </div>
                
                <h4 className="text-lg font-heading font-semibold mb-2 text-brown-dark dark:text-beige-light group-hover:text-taupe transition-colors">
                  {guide.title}
                </h4>
                
                <p className="text-brown dark:text-beige-medium text-sm mb-4">
                  {guide.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brown dark:text-beige-medium">
                    By {guide.author}
                  </span>
                  <button className="text-taupe hover:text-brown dark:hover:text-beige-light transition-colors text-sm font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedGuidesSection;
