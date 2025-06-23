import { motion } from "framer-motion";

const StorySection = () => {
  return (
    <section className="py-16 bg-white dark:bg-brown-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80"
              alt="UrbanEdge office"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light">
              Our Story
            </h2>

            <div className="space-y-4 text-brown dark:text-beige-medium">
              <p>
                Founded in 2005, UrbanEdge began with a simple mission: to
                transform the real estate experience by combining industry
                expertise with personalized service and cutting-edge technology.
              </p>

              <p>
                What started as a small team of three passionate agents has
                grown into a respected agency with over 50 professionals serving
                clients across the country. Throughout our growth, we've
                maintained our commitment to excellence and our client-first
                approach.
              </p>

              <p>
                Today, UrbanEdge is recognized as a leader in luxury real
                estate, known for our curated property selections, innovative
                marketing strategies, and exceptional client satisfaction. We
                continue to evolve and adapt to the changing market while
                staying true to our founding principles.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
