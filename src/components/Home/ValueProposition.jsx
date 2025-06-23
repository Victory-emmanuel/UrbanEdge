import { motion } from "framer-motion";
import SectionHeading from "../UI/SectionHeading";

const features = [
  {
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),

    title: "Trusted Expertise",
    description:
      "With over 20 years of experience, our team of professionals provides unmatched real estate knowledge and personalized service.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),

    title: "Premium Properties",
    description:
      "Access to exclusive listings in the most desirable locations, from luxury homes to high-potential investment opportunities.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),

    title: "Streamlined Process",
    description:
      "We handle every detail from search to closing, making your real estate journey smooth, efficient, and stress-free.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),

    title: "Dedicated Support",
    description:
      "Our client-first approach means you'll have a dedicated agent available to answer questions and provide guidance at every step.",
  },
];

const ValueProposition = () => {
  return (
    <section className="py-16 bg-white dark:bg-brown-dark">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Why Choose UrbanEdge"
          subtitle="We combine industry expertise with personalized service to deliver exceptional real estate experiences."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 sm:gap-8 mt-8 xs:mt-10 sm:mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-beige-light dark:bg-brown p-4 xs:p-5 sm:p-6 rounded-lg text-center"
            >
              <div className="text-taupe mb-3 xs:mb-4 mx-auto">
                <div className="w-8 h-8 xs:w-10 xs:h-10 mx-auto">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg xs:text-xl font-heading font-bold mb-2 xs:mb-3 text-brown-dark dark:text-beige-light">
                {feature.title}
              </h3>
              <p className="text-sm xs:text-base text-brown dark:text-beige-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
