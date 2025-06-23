import { Helmet } from "react-helmet";
import HeroSection from "../components/Services/HeroSection";
import ServicesGrid from "../components/Services/ServicesGrid";
import ProcessSection from "../components/Services/ProcessSection";
import TestimonialsSection from "../components/Services/TestimonialsSection";
import FAQSection from "../components/Services/FAQSection";
import CTASection from "../components/Services/CTASection";

const ServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>Our Services | UrbanEdge Real Estate</title>
        <meta
          name="description"
          content="Discover UrbanEdge Real Estate's comprehensive services including buying, selling, property management, investment advisory, and development services."
        />
      </Helmet>

      <HeroSection />
      <ServicesGrid />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
};

export default ServicesPage;
