import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Sample FAQ data
const faqs = [
  {
    question: "What areas do you serve?",
    answer:
      "UrbanEdge primarily serves major metropolitan areas across the United States, with a focus on luxury and high-end properties. Our main offices are located in New York, Los Angeles, Miami, and Chicago, but we have partner agents in many other cities. For specific location inquiries, please contact our team.",
  },
  {
    question: "How long does the typical buying process take?",
    answer:
      "The buying process timeline varies depending on several factors, including property type, location, financing, and market conditions. On average, from initial search to closing, the process takes 60-90 days. However, we've helped clients close in as little as 30 days when circumstances require expedited service.",
  },
  {
    question: "What sets your property management services apart?",
    answer:
      "Our property management services stand out through our proactive approach, technology integration, and personalized attention. We maintain a lower property-to-manager ratio than industry standards, ensuring your investment receives proper attention. Our proprietary software provides real-time reporting and maintenance tracking, while our tenant screening process results in longer tenancies and fewer issues.",
  },
  {
    question: "How do you determine the right listing price for my property?",
    answer:
      "We determine the optimal listing price through a comprehensive comparative market analysis (CMA) that examines recent sales of similar properties, current market conditions, property-specific features, and neighborhood trends. Our pricing strategy also considers your timeline and goals. We provide a detailed pricing report and explain our recommendations before finalizing the listing price.",
  },
  {
    question: "What fees are associated with your services?",
    answer:
      "Our fee structure varies by service type. For residential sales, we typically charge a percentage-based commission on the final sale price. Property management services usually involve a monthly fee based on rent collected. Investment advisory and development services may include consultation fees or project-based pricing. We provide transparent fee information during our initial consultation and formalize all costs in our service agreements.",
  },
  {
    question: "Do you work with first-time homebuyers?",
    answer:
      "Absolutely! We have dedicated agents who specialize in guiding first-time homebuyers through the process. We provide additional education, resources, and support to ensure you understand each step. Our first-time buyer program includes workshops, preferred lender relationships with competitive rates, and post-purchase support.",
  },
  {
    question: "What types of investment properties do you recommend?",
    answer:
      "Our investment recommendations are tailored to your financial goals, risk tolerance, and investment timeline. We analyze various property types including residential rentals, commercial properties, multi-family units, and development opportunities. Our investment advisory team provides detailed market analysis, cash flow projections, and potential appreciation forecasts to help you make informed decisions.",
  },
  {
    question: "How do you screen potential tenants for rental properties?",
    answer:
      "Our comprehensive tenant screening process includes credit checks, income verification (we typically require income of 3x the monthly rent), employment history, rental history, background checks, and personal references. We comply with all fair housing laws while ensuring that tenants meet our rigorous standards for reliability and property care.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <h2 className="text-3xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Frequently Asked Questions
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            Find answers to common questions about our services and processes.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full flex justify-between items-center p-5 rounded-lg text-left transition-colors ${
                  openIndex === index
                    ? "bg-taupe text-white"
                    : "bg-beige-light dark:bg-brown hover:bg-beige-medium dark:hover:bg-brown-dark text-brown-dark dark:text-beige-light"
                }`}
                aria-expanded={openIndex === index}
              >
                <span className="font-heading font-semibold">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 transition-transform ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 bg-white dark:bg-brown-dark border border-beige-medium dark:border-brown rounded-b-lg">
                      <p className="text-brown dark:text-beige-medium">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
