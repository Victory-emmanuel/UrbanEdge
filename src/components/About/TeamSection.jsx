import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Sample team data
const teamMembers = [
  {
    id: 1,
    name: "Jennifer Parker",
    role: "CEO & Founder",
    bio: "Jennifer founded UrbanEdge in 2005 after a successful career in luxury real estate. With over 20 years of experience, she has built a reputation for excellence and innovation in the industry. Jennifer holds a degree in Business Administration from Stanford University and is a certified Real Estate Broker.",
    expertise: [
      "Luxury Properties",
      "Commercial Real Estate",
      "Investment Strategy",
    ],

    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
    email: "jennifer@urbanedge.com",
    phone: "(310) 555-1234",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Chief Operating Officer",
    bio: "Michael brings 15 years of operational expertise to UrbanEdge. Previously, he managed operations for a national real estate firm, where he implemented systems that increased efficiency by 40%. Michael has an MBA from Harvard Business School and is passionate about leveraging technology to enhance the client experience.",
    expertise: [
      "Operations Management",
      "Process Optimization",
      "Technology Integration",
    ],

    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    email: "michael@urbanedge.com",
    phone: "(310) 555-2345",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Luxury Property Specialist",
    bio: "Sarah specializes in high-end residential properties and has closed over $100 million in sales. Her attention to detail and deep understanding of the luxury market make her a trusted advisor to discerning clients. Sarah holds a degree in Marketing from UCLA and is a member of the Institute for Luxury Home Marketing.",
    expertise: ["Luxury Homes", "Waterfront Properties", "Celebrity Estates"],
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    email: "sarah@urbanedge.com",
    phone: "(310) 555-3456",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Commercial Real Estate Director",
    bio: "David leads our commercial division with expertise in office, retail, and industrial properties. He has facilitated transactions valued at over $250 million throughout his 12-year career. David holds a degree in Finance from NYU and is a Certified Commercial Investment Member (CCIM).",
    expertise: ["Office Spaces", "Retail Properties", "Industrial Real Estate"],
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    email: "david@urbanedge.com",
    phone: "(310) 555-4567",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: 5,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    bio: "Emily oversees all marketing initiatives at UrbanEdge, developing innovative strategies that showcase our properties to targeted audiences. Her background in digital marketing and real estate has resulted in award-winning campaigns. Emily has a degree in Communications from USC and is Google Analytics certified.",
    expertise: ["Digital Marketing", "Brand Strategy", "Content Creation"],
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
    email: "emily@urbanedge.com",
    phone: "(310) 555-5678",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Investment Property Specialist",
    bio: "James specializes in investment properties and portfolio management, helping clients build wealth through strategic real estate acquisitions. He has personally invested in over 30 properties and brings this practical experience to his advisory role. James has a degree in Economics from UC Berkeley and is a licensed Real Estate Broker.",
    expertise: [
      "Investment Analysis",
      "Portfolio Management",
      "Rental Properties",
    ],

    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    email: "james@urbanedge.com",
    phone: "(310) 555-6789",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: 7,
    name: "Olivia Kim",
    role: "Client Relations Manager",
    bio: "Olivia ensures exceptional service for all UrbanEdge clients, coordinating communication and managing relationships throughout the real estate process. Her background in hospitality brings a unique perspective to client care. Olivia has a degree in Hospitality Management from Cornell University.",
    expertise: [
      "Client Experience",
      "Relationship Management",
      "Process Coordination",
    ],

    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80",
    email: "olivia@urbanedge.com",
    phone: "(310) 555-7890",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: 8,
    name: "Robert Martinez",
    role: "Property Development Specialist",
    bio: "Robert specializes in new developments and property renovations, with expertise in project management and construction oversight. He has managed the development of over 20 luxury properties. Robert has a degree in Architecture from Rhode Island School of Design and is a licensed contractor.",
    expertise: ["New Developments", "Renovations", "Project Management"],
    photo:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    email: "robert@urbanedge.com",
    phone: "(310) 555-8901",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
];

const TeamSection = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const openModal = (member) => {
    setSelectedMember(member);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = "auto"; // Restore scrolling
  };

  return (
    <section id="team" className="py-16 bg-white dark:bg-brown-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-heading font-bold mb-4 text-brown-dark dark:text-beige-light">
            Meet Our Team
          </h2>
          <p className="max-w-2xl mx-auto text-brown dark:text-beige-medium">
            Our experienced professionals are dedicated to providing exceptional
            service and expertise in every aspect of real estate.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => openModal(member)}
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white">
                    <p className="font-medium">View Profile</p>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-heading font-bold text-brown-dark dark:text-beige-light">
                {member.name}
              </h3>
              <p className="text-taupe">{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Team Member Modal */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-dark/80"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-brown-dark rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-brown-dark dark:text-beige-light hover:text-taupe transition-colors z-10"
                    aria-label="Close modal"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image */}
                    <div className="h-64 md:h-auto">
                      <img
                        src={selectedMember.photo}
                        alt={selectedMember.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-heading font-bold text-brown-dark dark:text-beige-light mb-1">
                        {selectedMember.name}
                      </h3>
                      <p className="text-taupe mb-4">{selectedMember.role}</p>

                      <div className="mb-4 space-y-2">
                        <div className="flex items-center text-brown dark:text-beige-medium">
                          <EnvelopeIcon className="h-5 w-5 mr-2" />

                          <a
                            href={`mailto:${selectedMember.email}`}
                            className="hover:text-taupe transition-colors"
                          >
                            {selectedMember.email}
                          </a>
                        </div>
                        <div className="flex items-center text-brown dark:text-beige-medium">
                          <PhoneIcon className="h-5 w-5 mr-2" />

                          <a
                            href={`tel:${selectedMember.phone}`}
                            className="hover:text-taupe transition-colors"
                          >
                            {selectedMember.phone}
                          </a>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-heading font-semibold text-brown-dark dark:text-beige-light mb-2">
                          Bio
                        </h4>
                        <p className="text-brown dark:text-beige-medium">
                          {selectedMember.bio}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-heading font-semibold text-brown-dark dark:text-beige-light mb-2">
                          Areas of Expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.expertise.map((item, index) => (
                            <span
                              key={index}
                              className="bg-beige-light dark:bg-brown text-brown-dark dark:text-beige-light px-3 py-1 rounded-full text-sm"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TeamSection;
