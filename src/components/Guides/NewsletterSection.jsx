import { motion } from "framer-motion";
import { EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const NewsletterSection = () => {
  const benefits = [
    "Weekly market insights and trends",
    "New guide releases and updates",
    "Exclusive investment opportunities",
    "Expert tips and strategies",
    "Property market forecasts",
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-taupe to-brown text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <EnvelopeIcon className="h-12 w-12" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Stay Updated with Our Newsletter
            </h2>
            <p className="text-lg text-beige-light max-w-2xl mx-auto">
              Get the latest real estate insights, new guides, and exclusive
              content delivered directly to your inbox every week.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-heading font-semibold mb-6">
                What You'll Receive:
              </h3>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircleIcon className="h-5 w-5 text-beige-light flex-shrink-0" />
                    <span className="text-beige-light">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-8 p-4 bg-white/10 rounded-lg"
              >
                <p className="text-sm text-beige-light">
                  <strong>Join 10,000+ subscribers</strong> who trust UrbanEdge
                  for their real estate insights. Unsubscribe anytime.
                </p>
              </motion.div>
            </motion.div>

            {/* Newsletter Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-8"
            >
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-beige-light mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-beige-light focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-beige-light mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-beige-light focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="interests"
                    className="block text-sm font-medium text-beige-light mb-2"
                  >
                    Interests (Optional)
                  </label>
                  <select
                    id="interests"
                    name="interests"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  >
                    <option value="">Select your primary interest</option>
                    <option value="buying">Property Buying</option>
                    <option value="selling">Property Selling</option>
                    <option value="investing">Real Estate Investment</option>
                    <option value="management">Property Management</option>
                    <option value="commercial">Commercial Real Estate</option>
                  </select>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    className="mt-1 h-4 w-4 text-white bg-white/20 border-white/30 rounded focus:ring-white/50"
                    required
                  />
                  <label htmlFor="consent" className="text-sm text-beige-light">
                    I agree to receive marketing emails and understand I can
                    unsubscribe at any time.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-brown-dark py-3 px-6 rounded-md font-medium hover:bg-beige-light transition-colors duration-300"
                >
                  Subscribe to Newsletter
                </button>
              </form>

              <p className="text-xs text-beige-light mt-4 text-center">
                We respect your privacy. Read our{" "}
                <a
                  href="/privacy-policy"
                  className="underline hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
