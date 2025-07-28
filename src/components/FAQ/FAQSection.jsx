import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Comprehensive FAQ data organized by categories
const faqCategories = [
  {
    title: "General Services",
    faqs: [
      {
        question: "What areas does UrbanEdge Real Estate serve?",
        answer: "UrbanEdge serves major metropolitan areas across Nigeria, with primary focus on Lagos, Abuja, Port Harcourt, and Kano. We specialize in luxury and high-end properties but also handle mid-range residential and commercial properties. Our network of partner agents extends to other major cities including Ibadan, Benin City, and Calabar."
      },
      {
        question: "What types of properties do you handle?",
        answer: "We handle a wide range of properties including luxury residential homes, apartments, commercial buildings, office spaces, retail properties, industrial facilities, and land for development. Our expertise spans from starter homes to multi-million naira luxury estates and commercial developments."
      },
      {
        question: "How do I get started with UrbanEdge?",
        answer: "Getting started is simple! You can browse our properties online, schedule a consultation with one of our agents, or visit our offices. We offer free initial consultations where we discuss your needs, budget, and timeline to create a personalized strategy for your real estate goals."
      }
    ]
  },
  {
    title: "Buying Process",
    faqs: [
      {
        question: "How long does the typical buying process take?",
        answer: "The buying process typically takes 30-90 days from initial search to completion, depending on factors like property type, financing arrangements, and legal documentation. Cash purchases can be completed faster, while mortgage-financed purchases may take longer due to bank approval processes."
      },
      {
        question: "What documents do I need to buy a property?",
        answer: "Required documents include valid identification (National ID, International Passport, or Driver's License), proof of income, bank statements, tax clearance certificate, and for foreign buyers, additional documentation may be required. We provide a complete checklist during our initial consultation."
      },
      {
        question: "Do you assist with mortgage financing?",
        answer: "Yes! We have partnerships with leading Nigerian banks and mortgage institutions. Our team can help you understand financing options, connect you with preferred lenders, and guide you through the mortgage application process to secure competitive rates."
      },
      {
        question: "What is included in your property inspection service?",
        answer: "Our comprehensive property inspection covers structural integrity, electrical systems, plumbing, HVAC systems, roofing, and overall property condition. We provide detailed reports with photographs and recommendations, helping you make informed decisions and negotiate repairs if needed."
      }
    ]
  },
  {
    title: "Selling Process",
    faqs: [
      {
        question: "How do you determine the right listing price for my property?",
        answer: "We conduct a comprehensive Comparative Market Analysis (CMA) examining recent sales of similar properties, current market conditions, property-specific features, location advantages, and neighborhood trends. Our pricing strategy considers your timeline and goals while ensuring competitive market positioning."
      },
      {
        question: "What marketing strategies do you use to sell properties?",
        answer: "Our marketing approach includes professional photography and virtual tours, listing on major property portals, social media marketing, email campaigns to our database, print advertising in relevant publications, open houses, and targeted digital advertising. We also leverage our network of agents and international partnerships."
      },
      {
        question: "How long does it typically take to sell a property?",
        answer: "Average selling time varies by location and property type, but typically ranges from 30-120 days. Luxury properties may take longer, while well-priced properties in desirable locations often sell within 30-60 days. Market conditions and pricing strategy significantly impact selling time."
      }
    ]
  }
];

const FAQSection = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleFAQ = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <section id="faq-section" className="py-16 bg-white dark:bg-brown-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Everything You Need to Know
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            Browse our comprehensive FAQ sections to find answers to your questions about our services and processes.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-heading font-semibold mb-6 text-brown-dark dark:text-beige-light border-b-2 border-taupe pb-2">
                {category.title}
              </h3>
              
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const key = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openItems[key];
                  
                  return (
                    <motion.div
                      key={faqIndex}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: faqIndex * 0.05 }}
                      className="border border-beige-medium dark:border-brown rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                        className={`w-full flex justify-between items-center p-5 text-left transition-colors ${
                          isOpen
                            ? "bg-taupe text-white"
                            : "bg-beige-light dark:bg-brown hover:bg-beige-medium dark:hover:bg-brown-dark text-brown-dark dark:text-beige-light"
                        }`}
                        aria-expanded={isOpen}
                      >
                        <span className="font-heading font-semibold pr-4">
                          {faq.question}
                        </span>
                        <ChevronDownIcon
                          className={`h-5 w-5 transition-transform flex-shrink-0 ${
                            isOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 bg-white dark:bg-brown-dark">
                              <p className="text-brown dark:text-beige-medium leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
