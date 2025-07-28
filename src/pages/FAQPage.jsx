import { Helmet } from "react-helmet";
import HeroSection from "../components/FAQ/HeroSection";
import FAQSection from "../components/FAQ/FAQSection";
import ContactCTASection from "../components/FAQ/ContactCTASection";

const FAQPage = () => {
  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | UrbanEdge Real Estate</title>
        <meta
          name="description"
          content="Find answers to common questions about UrbanEdge Real Estate services, buying and selling processes, property management, and more. Get expert guidance for your real estate needs."
        />
        <meta
          name="keywords"
          content="real estate FAQ, property buying questions, selling process, property management, UrbanEdge Real Estate"
        />
      </Helmet>

      <HeroSection />
      <FAQSection />
      <ContactCTASection />
    </>
  );
};

export default FAQPage;
