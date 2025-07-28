import { motion } from "framer-motion";
import { 
  CurrencyDollarIcon, 
  HeartIcon, 
  AcademicCapIcon, 
  CalendarDaysIcon,
  GiftIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      title: "Competitive Compensation",
      description: "Industry-leading salaries, performance bonuses, and commission structures that reward your success."
    },
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, dental coverage, and wellness programs for you and your family."
    },
    {
      icon: <AcademicCapIcon className="h-8 w-8" />,
      title: "Professional Development",
      description: "Training programs, certifications, conferences, and educational reimbursements to advance your career."
    },
    {
      icon: <CalendarDaysIcon className="h-8 w-8" />,
      title: "Flexible Schedule",
      description: "Work-life balance with flexible hours, remote work options, and generous paid time off."
    },
    {
      icon: <GiftIcon className="h-8 w-8" />,
      title: "Performance Rewards",
      description: "Recognition programs, achievement bonuses, and exclusive incentive trips for top performers."
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "Job Security",
      description: "Stable employment with a growing company, retirement planning, and long-term career opportunities."
    }
  ];

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
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Benefits & Perks
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            We believe in taking care of our team members with comprehensive benefits 
            and perks that support both your professional and personal well-being.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-brown-dark rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-taupe mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-heading font-semibold mb-3 text-brown-dark dark:text-beige-light">
                {benefit.title}
              </h3>
              <p className="text-brown dark:text-beige-medium">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-taupe to-brown text-white rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl font-heading font-bold mb-4">
            Ready to Join Our Team?
          </h3>
          <p className="text-beige-light mb-6 max-w-2xl mx-auto">
            Take the next step in your real estate career with UrbanEdge. 
            Explore our open positions and find the perfect role for your skills and ambitions.
          </p>
          <a
            href="#job-listings"
            className="btn bg-white text-brown-dark hover:bg-beige-light"
          >
            View Open Positions
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
