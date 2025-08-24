import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ServiceCard = ({ service, index }) => {
  const { id, title, description, icon, image, features, cta } = service;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      id={id}
      className="bg-white dark:bg-brown-dark rounded-lg shadow-lg overflow-hidden"
    >
      {/* Image */}
      <div
        className="relative h-64 overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          width="400"
          height="225"
          loading="lazy"
          decoding="async"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <div className="text-white mb-2">{icon}</div>
          <h3 className="text-2xl font-heading font-bold text-white">
            {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-brown dark:text-beige-medium mb-6">{description}</p>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <svg
                className="h-5 w-5 text-taupe mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-brown-dark dark:text-beige-light">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to={cta.link}
          className="block w-full text-center py-3 bg-taupe text-white hover:bg-brown transition-colors duration-300 rounded-md font-medium"
        >
          {cta.text}
        </Link>
      </div>
    </motion.div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    image: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    cta: PropTypes.shape({
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default ServiceCard;
