import { motion } from "framer-motion";

const PolicyContent = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect personal information you provide directly to us, including your name, email address, phone number, mailing address, and financial information when you use our services, create an account, or communicate with us."
        },
        {
          subtitle: "Property Information",
          text: "When you list a property or express interest in purchasing, we collect property-related information including location preferences, budget range, property specifications, and transaction history."
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about how you use our website and services, including your IP address, browser type, device information, pages visited, and interaction patterns."
        }
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to provide real estate services, process transactions, communicate about properties, schedule appointments, and fulfill your requests."
        },
        {
          subtitle: "Communication",
          text: "We may use your contact information to send you property updates, market reports, service notifications, and respond to your inquiries."
        },
        {
          subtitle: "Improvement and Analytics",
          text: "We analyze usage patterns to improve our services, develop new features, and enhance user experience on our platforms."
        }
      ]
    },
    {
      title: "Information Sharing",
      content: [
        {
          subtitle: "Service Providers",
          text: "We may share your information with trusted third-party service providers who assist us in operating our business, including payment processors, marketing platforms, and technology providers."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information when required by law, to protect our rights, or to comply with legal proceedings, court orders, or government requests."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction."
        }
      ]
    },
    {
      title: "Data Security",
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        },
        {
          subtitle: "Data Retention",
          text: "We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements."
        }
      ]
    },
    {
      title: "Your Rights",
      content: [
        {
          subtitle: "Access and Correction",
          text: "You have the right to access, update, or correct your personal information. You can do this through your account settings or by contacting us directly."
        },
        {
          subtitle: "Data Portability",
          text: "You may request a copy of your personal information in a structured, commonly used format."
        },
        {
          subtitle: "Deletion",
          text: "You may request deletion of your personal information, subject to certain legal and business requirements."
        }
      ]
    },
    {
      title: "Cookies and Tracking",
      content: [
        {
          subtitle: "Cookie Usage",
          text: "We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser."
        },
        {
          subtitle: "Third-Party Analytics",
          text: "We use third-party analytics services to understand how our website is used and to improve our services."
        }
      ]
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-brown-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light border-b-2 border-taupe pb-2">
                {section.title}
              </h2>
              
              <div className="space-y-6">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-beige-light dark:bg-brown rounded-lg p-6">
                    <h3 className="text-lg font-heading font-semibold mb-3 text-brown-dark dark:text-beige-light">
                      {item.subtitle}
                    </h3>
                    <p className="text-brown dark:text-beige-medium leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-taupe to-brown text-white rounded-lg p-8"
          >
            <h2 className="text-2xl font-heading font-bold mb-4">
              Changes to This Policy
            </h2>
            <p className="text-beige-light leading-relaxed mb-4">
              We may update this privacy policy from time to time to reflect changes in our practices, 
              technology, legal requirements, or other factors. We will notify you of any material 
              changes by posting the updated policy on our website and updating the "Last updated" date.
            </p>
            <p className="text-beige-light leading-relaxed">
              Your continued use of our services after any changes indicates your acceptance of the 
              updated privacy policy.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PolicyContent;
