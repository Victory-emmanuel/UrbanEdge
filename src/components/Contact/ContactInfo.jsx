import { motion } from "framer-motion";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const ContactInfo = () => {
  const officeLocations = [
    {
      name: "Headquarters",
      address: "123 Luxury Lane, Beverly Hills, CA 90210",
      phone: "(310) 555-1234",
      email: "info@urbanedge.com",
      hours: "Monday - Friday: 9AM - 6PM\nSaturday: 10AM - 4PM\nSunday: Closed",
    },
    {
      name: "Downtown Office",
      address: "456 Urban Avenue, Los Angeles, CA 90017",
      phone: "(213) 555-5678",
      email: "downtown@urbanedge.com",
      hours:
        "Monday - Friday: 9AM - 6PM\nSaturday: By appointment\nSunday: Closed",
    },
    {
      name: "Malibu Office",
      address: "789 Seaside Drive, Malibu, CA 90265",
      phone: "(424) 555-9012",
      email: "malibu@urbanedge.com",
      hours: "Monday - Friday: 9AM - 6PM\nSaturday: 10AM - 4PM\nSunday: Closed",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light">
        Our Offices
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officeLocations.map((office, index) => (
          <div
            key={index}
            className="bg-white dark:bg-brown-dark rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
              {office.name}
            </h3>

            <div className="space-y-4 text-brown dark:text-beige-medium">
              <div className="flex">
                <MapPinIcon className="h-6 w-6 text-taupe flex-shrink-0 mr-3" />

                <span>{office.address}</span>
              </div>

              <div className="flex">
                <PhoneIcon className="h-6 w-6 text-taupe flex-shrink-0 mr-3" />

                <a
                  href={`tel:${office.phone}`}
                  className="hover:text-taupe transition-colors"
                >
                  {office.phone}
                </a>
              </div>

              <div className="flex">
                <EnvelopeIcon className="h-6 w-6 text-taupe flex-shrink-0 mr-3" />

                <a
                  href={`mailto:${office.email}`}
                  className="hover:text-taupe transition-colors"
                >
                  {office.email}
                </a>
              </div>

              <div className="flex">
                <ClockIcon className="h-6 w-6 text-taupe flex-shrink-0 mr-3" />

                <div className="whitespace-pre-line">{office.hours}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ContactInfo;
