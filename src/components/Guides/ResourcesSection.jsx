import { motion } from "framer-motion";
import { 
  CalculatorIcon, 
  DocumentChartBarIcon, 
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  HomeIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

const ResourcesSection = () => {
  const tools = [
    {
      icon: <CalculatorIcon className="h-8 w-8" />,
      title: "Mortgage Calculator",
      description: "Calculate monthly payments, interest rates, and loan terms",
      type: "Calculator",
      link: "#"
    },
    {
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      title: "Property Value Estimator",
      description: "Get an estimated value for any property in Nigeria",
      type: "Tool",
      link: "#"
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "ROI Calculator",
      description: "Calculate potential returns on investment properties",
      type: "Calculator",
      link: "#"
    },
    {
      icon: <HomeIcon className="h-8 w-8" />,
      title: "Affordability Calculator",
      description: "Determine how much house you can afford",
      type: "Calculator",
      link: "#"
    }
  ];

  const documents = [
    {
      icon: <DocumentChartBarIcon className="h-6 w-6" />,
      title: "Market Report Q4 2024",
      description: "Comprehensive analysis of Nigerian real estate market trends",
      size: "2.4 MB",
      type: "PDF"
    },
    {
      icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
      title: "Property Inspection Checklist",
      description: "Complete checklist for property inspections",
      size: "1.2 MB",
      type: "PDF"
    },
    {
      icon: <DocumentChartBarIcon className="h-6 w-6" />,
      title: "Investment Property Analysis Template",
      description: "Excel template for analyzing investment opportunities",
      size: "856 KB",
      type: "XLSX"
    },
    {
      icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
      title: "Legal Documents Checklist",
      description: "Essential documents for property transactions",
      size: "945 KB",
      type: "PDF"
    }
  ];

  return (
    <section id="resources" className="py-16 bg-white dark:bg-brown-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Tools & Resources
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            Access our collection of calculators, templates, and downloadable resources 
            to make informed real estate decisions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Interactive Tools */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-2xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light">
              Interactive Tools
            </h3>
            
            <div className="space-y-4">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="bg-beige-light dark:bg-brown rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-taupe group-hover:scale-110 transition-transform duration-300">
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-heading font-semibold text-brown-dark dark:text-beige-light group-hover:text-taupe transition-colors">
                          {tool.title}
                        </h4>
                        <span className="text-xs bg-taupe text-white px-2 py-1 rounded-full">
                          {tool.type}
                        </span>
                      </div>
                      <p className="text-brown dark:text-beige-medium text-sm mb-3">
                        {tool.description}
                      </p>
                      <button className="text-taupe hover:text-brown dark:hover:text-beige-light transition-colors text-sm font-medium">
                        Use Tool →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Downloadable Resources */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light">
              Downloadable Resources
            </h3>
            
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="bg-beige-light dark:bg-brown rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-taupe">
                      {doc.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-heading font-semibold text-brown-dark dark:text-beige-light group-hover:text-taupe transition-colors">
                          {doc.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-brown dark:text-beige-medium">
                          <span className="bg-white dark:bg-brown-dark px-2 py-1 rounded">
                            {doc.type}
                          </span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                      <p className="text-brown dark:text-beige-medium text-sm mb-3">
                        {doc.description}
                      </p>
                      <button className="text-taupe hover:text-brown dark:hover:text-beige-light transition-colors text-sm font-medium">
                        Download →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-taupe to-brown text-white rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-heading font-bold mb-4">
              Need Custom Resources?
            </h3>
            <p className="text-beige-light mb-6">
              Our team can create custom calculators, templates, and guides tailored 
              to your specific needs. Contact us to discuss your requirements.
            </p>
            <a
              href="/contact"
              className="btn bg-white text-brown-dark hover:bg-beige-light"
            >
              Request Custom Resource
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResourcesSection;
