import { motion } from "framer-motion";
import { HeartIcon, LightBulbIcon, UsersIcon, TrophyIcon } from "@heroicons/react/24/outline";

const CultureSection = () => {
  const values = [
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: "Client-First Approach",
      description: "We put our clients' needs at the center of everything we do, building lasting relationships based on trust and exceptional service."
    },
    {
      icon: <LightBulbIcon className="h-8 w-8" />,
      title: "Innovation & Growth",
      description: "We embrace new technologies and creative solutions to stay ahead in the evolving real estate market."
    },
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: "Collaborative Team",
      description: "We believe in the power of teamwork, supporting each other to achieve collective success and individual growth."
    },
    {
      icon: <TrophyIcon className="h-8 w-8" />,
      title: "Excellence & Integrity",
      description: "We maintain the highest standards of professionalism and ethical conduct in all our business practices."
    }
  ];

  return (
    <section id="culture" className="py-16 bg-white dark:bg-brown-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Our Culture & Values
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            At UrbanEdge, we've built a culture that empowers our team members to thrive, 
            innovate, and deliver exceptional results for our clients.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-beige-light dark:bg-brown rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="text-taupe mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3 text-brown-dark dark:text-beige-light">
                  {value.title}
                </h3>
                <p className="text-brown dark:text-beige-medium">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light">
              Why Choose UrbanEdge?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-brown dark:text-beige-medium">
                  <strong className="text-brown-dark dark:text-beige-light">Professional Development:</strong> Continuous learning opportunities, mentorship programs, and career advancement paths.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-brown dark:text-beige-medium">
                  <strong className="text-brown-dark dark:text-beige-light">Work-Life Balance:</strong> Flexible schedules, remote work options, and comprehensive wellness programs.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-brown dark:text-beige-medium">
                  <strong className="text-brown-dark dark:text-beige-light">Cutting-Edge Technology:</strong> Access to the latest real estate technology and tools to enhance your productivity.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-brown dark:text-beige-medium">
                  <strong className="text-brown-dark dark:text-beige-light">Diverse & Inclusive:</strong> A welcoming environment that celebrates diversity and promotes inclusion.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Team collaboration at UrbanEdge"
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/30 to-transparent rounded-lg"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CultureSection;
