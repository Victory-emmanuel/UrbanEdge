import { motion } from "framer-motion";
import { PhoneIcon, EnvelopeIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const ContactCTASection = () => {
  const contactMethods = [
    {
      icon: <PhoneIcon className="h-8 w-8" />,
      title: "Call Us",
      description: "Speak directly with our experts",
      action: "Call Now",
      link: "tel:+234-800-URBAN-EDGE",
      details: "+234 800 URBAN EDGE"
    },
    {
      icon: <EnvelopeIcon className="h-8 w-8" />,
      title: "Email Us",
      description: "Get detailed answers via email",
      action: "Send Email",
      link: "mailto:info@urbanedge.com",
      details: "info@urbanedge.com"
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      link: "/contact",
      details: "Available 9 AM - 6 PM"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-taupe to-brown text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-beige-light max-w-2xl mx-auto">
            Our team of real estate experts is here to help. Get personalized answers 
            and guidance for your specific situation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all duration-300 group">
                <div className="text-beige-light mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {method.title}
                </h3>
                
                <p className="text-beige-light mb-4">
                  {method.description}
                </p>
                
                <p className="text-sm text-beige-light mb-6">
                  {method.details}
                </p>
                
                <a
                  href={method.link}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-brown-dark rounded-md font-medium hover:bg-beige-light transition-colors duration-300"
                >
                  {method.action}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-heading font-semibold mb-4">
              Schedule a Free Consultation
            </h3>
            <p className="text-beige-light mb-6">
              Get personalized advice from our real estate experts. We'll discuss your 
              goals, answer your questions, and create a customized strategy for your needs.
            </p>
            <a
              href="/contact"
              className="btn bg-white text-brown-dark hover:bg-beige-light"
            >
              Book Consultation
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTASection;
