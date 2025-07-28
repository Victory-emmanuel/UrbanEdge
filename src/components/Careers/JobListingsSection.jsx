import { motion } from "framer-motion";
import { MapPinIcon, ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

const JobListingsSection = () => {
  const jobListings = [
    {
      title: "Senior Real Estate Agent",
      department: "Sales",
      location: "Lagos, Nigeria",
      type: "Full-time",
      salary: "₦2,000,000 - ₦5,000,000",
      description: "Lead luxury property sales and build lasting client relationships. Requires 3+ years experience in high-end real estate.",
      requirements: ["3+ years real estate experience", "Strong negotiation skills", "Client relationship management", "Market analysis expertise"]
    },
    {
      title: "Property Manager",
      department: "Property Management",
      location: "Abuja, Nigeria",
      type: "Full-time",
      salary: "₦1,500,000 - ₦3,000,000",
      description: "Oversee property portfolios, manage tenant relationships, and ensure optimal property performance.",
      requirements: ["Property management experience", "Strong organizational skills", "Tenant relations", "Maintenance coordination"]
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Lagos, Nigeria",
      type: "Full-time",
      salary: "₦1,200,000 - ₦2,500,000",
      description: "Develop and execute marketing strategies for property listings and brand awareness campaigns.",
      requirements: ["Digital marketing experience", "Content creation skills", "Social media management", "Analytics proficiency"]
    },
    {
      title: "Investment Advisor",
      department: "Investment Services",
      location: "Lagos, Nigeria",
      type: "Full-time",
      salary: "₦2,500,000 - ₦6,000,000",
      description: "Provide expert investment advice and help clients build profitable real estate portfolios.",
      requirements: ["Finance or real estate background", "Investment analysis", "Client advisory experience", "Market research skills"]
    },
    {
      title: "Junior Real Estate Agent",
      department: "Sales",
      location: "Port Harcourt, Nigeria",
      type: "Full-time",
      salary: "₦800,000 - ₦1,800,000",
      description: "Start your real estate career with comprehensive training and mentorship from experienced agents.",
      requirements: ["Bachelor's degree", "Excellent communication", "Sales aptitude", "Willingness to learn"]
    },
    {
      title: "Customer Success Manager",
      department: "Client Services",
      location: "Remote",
      type: "Full-time",
      salary: "₦1,000,000 - ₦2,200,000",
      description: "Ensure exceptional client experiences and manage ongoing customer relationships.",
      requirements: ["Customer service experience", "Relationship management", "Problem-solving skills", "CRM proficiency"]
    }
  ];

  return (
    <section id="job-listings" className="py-16 bg-white dark:bg-brown-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Open Positions
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            Discover exciting career opportunities across our various departments. 
            Find the perfect role that matches your skills and career aspirations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {jobListings.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-beige-light dark:bg-brown rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-heading font-semibold text-brown-dark dark:text-beige-light mb-1">
                    {job.title}
                  </h3>
                  <p className="text-taupe font-medium">{job.department}</p>
                </div>
                <span className="bg-taupe text-white px-3 py-1 rounded-full text-sm">
                  {job.type}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mb-4 text-sm text-brown dark:text-beige-medium">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  {job.salary}
                </div>
              </div>

              <p className="text-brown dark:text-beige-medium mb-4">
                {job.description}
              </p>

              <div className="mb-6">
                <h4 className="font-semibold text-brown-dark dark:text-beige-light mb-2">
                  Key Requirements:
                </h4>
                <ul className="space-y-1">
                  {job.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className="flex items-start gap-2 text-sm text-brown dark:text-beige-medium">
                      <div className="w-1.5 h-1.5 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button className="btn-primary flex-1">
                  Apply Now
                </button>
                <button className="btn-outline">
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-brown dark:text-beige-medium mb-4">
            Don't see a position that fits? We're always looking for talented individuals.
          </p>
          <a
            href="mailto:careers@urbanedge.com"
            className="btn-outline"
          >
            Send Us Your Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default JobListingsSection;
