import { Helmet } from "react-helmet";
import HeroSection from "../components/PrivacyPolicy/HeroSection";
import PolicyContent from "../components/PrivacyPolicy/PolicyContent";
import ContactSection from "../components/PrivacyPolicy/ContactSection";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | UrbanEdge Real Estate</title>
        <meta
          name="description"
          content="Read UrbanEdge Real Estate's privacy policy to understand how we collect, use, and protect your personal information. Your privacy and data security are our priorities."
        />
        <meta
          name="keywords"
          content="privacy policy, data protection, personal information, UrbanEdge Real Estate, data security"
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <HeroSection />
      <PolicyContent />
      <ContactSection />
    </>
  );
};

export default PrivacyPolicyPage;
