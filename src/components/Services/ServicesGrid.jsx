import ServiceCard from "./ServiceCard";

// Sample services data
const services = [
  {
    id: "buying",
    title: "Buying",
    description:
      "Find your dream property with our expert guidance. We'll help you navigate the market, identify opportunities that match your criteria, and negotiate the best possible terms.",
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

    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
    features: [
      "Personalized property search based on your criteria",
      "Market analysis and property valuation",
      "Expert negotiation to secure the best price and terms",
      "Guidance through inspections and due diligence",
      "Coordination with lenders, attorneys, and other professionals",
      "Support through closing and beyond",
    ],

    cta: {
      text: "Start Your Search",
      link: "/properties",
    },
  },
  {
    id: "selling",
    title: "Selling",
    description:
      "Maximize your property's value with our comprehensive selling services. We combine market expertise, innovative marketing strategies, and skilled negotiation to achieve optimal results.",
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),

    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    features: [
      "Comprehensive market analysis to determine optimal pricing",
      "Professional photography and virtual tours",
      "Strategic marketing across digital and traditional channels",
      "Targeted exposure to qualified buyers",
      "Expert negotiation to maximize your return",
      "Seamless transaction management through closing",
    ],

    cta: {
      text: "Get a Property Valuation",
      link: "/contact",
    },
  },
  {
    id: "renting",
    title: "Renting",
    description:
      "Whether you're looking to rent a property or need help managing your rental investment, our rental services provide comprehensive solutions tailored to your specific needs.",
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
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),

    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    features: [
      "Extensive rental property listings across all price points",
      "Personalized search based on your requirements",
      "Property showings and application assistance",
      "Lease negotiation and review",
      "Tenant screening and selection for property owners",
      "Ongoing lease administration and renewal services",
    ],

    cta: {
      text: "Find Rental Properties",
      link: "/properties",
    },
  },
  {
    id: "management",
    title: "Property Management",
    description:
      "Maximize the return on your real estate investments while minimizing stress. Our property management services handle every aspect of your rental property, ensuring it performs optimally.",
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
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),

    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    features: [
      "Comprehensive tenant screening and selection",
      "Rent collection and financial reporting",
      "Property maintenance and emergency response",
      "Regular property inspections",
      "Lease enforcement and renewal management",
      "Legal compliance and eviction handling when necessary",
    ],

    cta: {
      text: "Learn About Management",
      link: "/contact",
    },
  },
  {
    id: "investment",
    title: "Investment Advisory",
    description:
      "Build wealth through strategic real estate investments. Our advisors analyze market trends, identify high-potential opportunities, and develop customized investment strategies aligned with your goals.",
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),

    image:
      "https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    features: [
      "Market analysis and investment opportunity identification",
      "ROI projections and financial modeling",
      "Portfolio diversification strategies",
      "Due diligence and risk assessment",
      "Acquisition and disposition guidance",
      "Ongoing portfolio performance monitoring",
    ],

    cta: {
      text: "Schedule a Consultation",
      link: "/contact",
    },
  },
  {
    id: "development",
    title: "Development Services",
    description:
      "Transform your vision into reality with our comprehensive development services. From site selection to project completion, we provide expert guidance at every stage of the development process.",
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
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),

    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    features: [
      "Site selection and feasibility analysis",
      "Zoning and entitlement assistance",
      "Design and construction team coordination",
      "Budget development and financial modeling",
      "Construction oversight and quality control",
      "Marketing and sales/leasing strategy",
    ],

    cta: {
      text: "Discuss Your Project",
      link: "/contact",
    },
  },
];

const ServicesGrid = () => {
  return (
    <section className="py-16 bg-beige-light dark:bg-brown">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
