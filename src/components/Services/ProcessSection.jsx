import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Initial Consultation",
    description:
      "We begin with a detailed discussion to understand your specific needs, goals, and timeline. This allows us to tailor our services to your unique situation.",
  },
  {
    number: "02",
    title: "Strategy Development",
    description:
      "Based on your consultation, we develop a customized strategy that outlines the steps, timeline, and expected outcomes for your real estate journey.",
  },
  {
    number: "03",
    title: "Implementation",
    description:
      "Our team executes the strategy with precision, keeping you informed at every step and making adjustments as needed to ensure optimal results.",
  },
  {
    number: "04",
    title: "Successful Outcome",
    description:
      "We guide you through to a successful conclusion, whether that's finding your dream home, selling your property for maximum value, or optimizing your investment portfolio.",
  },
  {
    number: "05",
    title: "Ongoing Support",
    description:
      "Our relationship doesn't end at closing. We provide continued support and remain a resource for all your future real estate needs.",
  },
];

const ProcessSection = () => {
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
            Our Process
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            We follow a structured approach to ensure exceptional results for
            every client, regardless of which service you choose.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-taupe transform -translate-x-1/2"></div>

          {/* Steps */}
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`md:flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Step Number (Mobile) */}
                <div className="md:hidden flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-taupe text-white text-xl font-bold">
                    {step.number}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-heading font-bold text-brown-dark dark:text-beige-light">
                      {step.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-5/12">
                  <div
                    className={`p-6 bg-beige-light dark:bg-brown rounded-lg shadow-md ${
                      index % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <h3 className="hidden md:block text-xl font-heading font-bold mb-3 text-brown-dark dark:text-beige-light">
                      {step.title}
                    </h3>
                    <p className="text-brown dark:text-beige-medium">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Step Number (Desktop) */}
                <div className="hidden md:flex md:w-2/12 justify-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-taupe text-white text-2xl font-bold z-10">
                    {step.number}
                  </div>
                </div>

                {/* Empty Space for Alternating Layout */}
                <div className="hidden md:block md:w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
