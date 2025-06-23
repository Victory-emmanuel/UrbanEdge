import { motion } from "framer-motion";

// Sample awards data
const awards = [
  {
    year: "2023",
    title: "Best Luxury Real Estate Agency",
    organization: "International Property Awards",
    logo: "https://via.placeholder.com/150",
  },
  {
    year: "2022",
    title: "Top 100 Real Estate Companies",
    organization: "Real Estate Executive Magazine",
    logo: "https://via.placeholder.com/150",
  },
  {
    year: "2021",
    title: "Excellence in Client Satisfaction",
    organization: "American Business Awards",
    logo: "https://via.placeholder.com/150",
  },
  {
    year: "2020",
    title: "Most Innovative Real Estate Agency",
    organization: "Real Estate Innovation Summit",
    logo: "https://via.placeholder.com/150",
  },
];

// Sample partners data
const partners = [
  {
    name: "Luxury Portfolio International",
    logo: "https://via.placeholder.com/150",
  },
  {
    name: "Christie's International Real Estate",
    logo: "https://via.placeholder.com/150",
  },
  {
    name: "Leading Real Estate Companies of the World",
    logo: "https://via.placeholder.com/150",
  },
  {
    name: "National Association of Realtors",
    logo: "https://via.placeholder.com/150",
  },
  {
    name: "Institute for Luxury Home Marketing",
    logo: "https://via.placeholder.com/150",
  },
  {
    name: "U.S. Green Building Council",
    logo: "https://via.placeholder.com/150",
  },
];

const AwardsSection = () => {
  return (
    <section className="py-16 bg-beige-light dark:bg-brown">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Awards & Recognition
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            Our commitment to excellence has been recognized by leading
            organizations in the real estate industry.
          </p>
        </motion.div>

        {/* Awards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-brown-dark p-6 rounded-lg shadow-md text-center"
            >
              <div className="mb-4 flex justify-center">
                <img
                  src={award.logo}
                  alt={award.organization}
                  className="h-16 w-auto"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-brown-dark dark:text-beige-light mb-2">
                {award.title}
              </h3>
              <p className="text-taupe mb-1">{award.organization}</p>
              <p className="text-sm text-brown dark:text-beige-medium">
                {award.year}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Our Partners
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            We collaborate with industry leaders to provide exceptional service
            and opportunities for our clients.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 w-auto"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
