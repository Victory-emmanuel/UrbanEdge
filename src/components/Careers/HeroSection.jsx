import { motion } from "framer-motion";
import { BriefcaseIcon, UserGroupIcon, TrophyIcon } from "@heroicons/react/24/outline";

const HeroSection = () => {
  const stats = [
    {
      icon: <BriefcaseIcon className="h-8 w-8" />,
      number: "50+",
      label: "Open Positions"
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      number: "200+",
      label: "Team Members"
    },
    {
      icon: <TrophyIcon className="h-8 w-8" />,
      number: "15+",
      label: "Years Experience"
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-beige-light to-beige-medium dark:from-brown-dark dark:to-brown overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light"
              >
                Build Your Career with{" "}
                <span className="text-taupe">UrbanEdge</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-brown dark:text-beige-medium mb-8 leading-relaxed"
              >
                Join Nigeria's leading real estate company and be part of a team that's 
                transforming the property landscape. We offer exceptional career growth, 
                competitive compensation, and the opportunity to work with luxury properties.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <a
                  href="#job-listings"
                  className="btn-primary"
                >
                  View Open Positions
                </a>
                <a
                  href="#culture"
                  className="btn-outline"
                >
                  Learn About Our Culture
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-3 gap-6"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-taupe mb-2 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-heading font-bold text-brown-dark dark:text-beige-light mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-brown dark:text-beige-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="UrbanEdge team working together"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-lg font-heading font-semibold">
                    Join Our Growing Team
                  </p>
                  <p className="text-beige-light">
                    Where talent meets opportunity
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-taupe/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brown/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default HeroSection;
