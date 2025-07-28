import { motion } from "framer-motion";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

const ContactSection = () => {
  return (
    <section className="py-16 bg-beige-light dark:bg-brown">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
              Questions About Your Privacy?
            </h2>
            <p className="text-lg text-brown dark:text-beige-medium max-w-2xl mx-auto">
              If you have any questions about this privacy policy or how we handle your personal information, 
              please don't hesitate to contact us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-white dark:bg-brown-dark rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-taupe mb-4 flex justify-center">
                  <EnvelopeIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2 text-brown-dark dark:text-beige-light">
                  Email Us
                </h3>
                <p className="text-brown dark:text-beige-medium mb-4">
                  Send us your privacy questions
                </p>
                <a
                  href="mailto:privacy@urbanedge.com"
                  className="text-taupe hover:text-brown dark:hover:text-beige-medium transition-colors font-medium"
                >
                  privacy@urbanedge.com
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-white dark:bg-brown-dark rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-taupe mb-4 flex justify-center">
                  <PhoneIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2 text-brown-dark dark:text-beige-light">
                  Call Us
                </h3>
                <p className="text-brown dark:text-beige-medium mb-4">
                  Speak with our privacy team
                </p>
                <a
                  href="tel:+234-800-PRIVACY"
                  className="text-taupe hover:text-brown dark:hover:text-beige-medium transition-colors font-medium"
                >
                  +234 800 PRIVACY
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-white dark:bg-brown-dark rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-taupe mb-4 flex justify-center">
                  <MapPinIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2 text-brown-dark dark:text-beige-light">
                  Visit Us
                </h3>
                <p className="text-brown dark:text-beige-medium mb-4">
                  Data Protection Office
                </p>
                <p className="text-taupe font-medium">
                  Lagos, Nigeria
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <div className="bg-white dark:bg-brown-dark rounded-lg p-8 shadow-md">
              <h3 className="text-xl font-heading font-semibold mb-4 text-brown-dark dark:text-beige-light">
                Data Protection Rights
              </h3>
              <p className="text-brown dark:text-beige-medium mb-6 leading-relaxed">
                You have the right to access, correct, or delete your personal information. 
                To exercise these rights or if you have concerns about how we handle your data, 
                please contact our Data Protection Officer.
              </p>
              <a
                href="/contact"
                className="btn-primary"
              >
                Contact Data Protection Officer
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
