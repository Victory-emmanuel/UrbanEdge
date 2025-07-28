import { motion } from "framer-motion";
import { 
  DocumentTextIcon, 
  UserIcon, 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon 
} from "@heroicons/react/24/outline";

const ApplicationProcessSection = () => {
  const steps = [
    {
      icon: <DocumentTextIcon className="h-8 w-8" />,
      title: "Submit Application",
      description: "Send us your resume and cover letter through our online portal or email.",
      details: "Include your relevant experience, achievements, and why you want to join UrbanEdge."
    },
    {
      icon: <UserIcon className="h-8 w-8" />,
      title: "Initial Screening",
      description: "Our HR team will review your application and contact qualified candidates.",
      details: "We typically respond within 3-5 business days for applications that match our requirements."
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />,
      title: "Interview Process",
      description: "Participate in interviews with our hiring managers and team members.",
      details: "This may include phone screening, video interviews, and in-person meetings."
    },
    {
      icon: <CheckCircleIcon className="h-8 w-8" />,
      title: "Welcome Aboard",
      description: "Receive your offer and begin your journey with comprehensive onboarding.",
      details: "We'll provide training, mentorship, and all the tools you need to succeed."
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
            Application Process
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            Our streamlined application process is designed to be efficient and transparent. 
            Here's what you can expect when you apply to join our team.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white dark:bg-brown-dark rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-taupe text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="text-taupe mb-4 flex justify-center mt-4">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-lg font-heading font-semibold mb-3 text-brown-dark dark:text-beige-light">
                    {step.title}
                  </h3>
                  
                  <p className="text-brown dark:text-beige-medium mb-3">
                    {step.description}
                  </p>
                  
                  <p className="text-sm text-brown/80 dark:text-beige-medium/80">
                    {step.details}
                  </p>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-taupe/30 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 bg-white dark:bg-brown-dark rounded-lg p-8 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light text-center">
            Application Tips
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-brown-dark dark:text-beige-light mb-2">
                What to Include:
              </h4>
              <ul className="space-y-2 text-brown dark:text-beige-medium">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                  Updated resume with relevant experience
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                  Compelling cover letter
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                  Portfolio or work samples (if applicable)
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                  Professional references
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-brown-dark dark:text-beige-light mb-2">
                Stand Out By:
              </h4>
              <ul className="space-y-2 text-brown dark:text-beige-medium">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                  Demonstrating knowledge of our company
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                  Highlighting relevant achievements
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                  Showing passion for real estate
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-taupe rounded-full mt-2 flex-shrink-0"></div>
                  Being authentic and professional
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ApplicationProcessSection;
