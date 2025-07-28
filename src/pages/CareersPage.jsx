import { Helmet } from "react-helmet";
import HeroSection from "../components/Careers/HeroSection";
import CultureSection from "../components/Careers/CultureSection";
import BenefitsSection from "../components/Careers/BenefitsSection";
import JobListingsSection from "../components/Careers/JobListingsSection";
import ApplicationProcessSection from "../components/Careers/ApplicationProcessSection";
import CTASection from "../components/Careers/CTASection";

const CareersPage = () => {
  return (
    <>
      <Helmet>
        <title>Careers | Join UrbanEdge Real Estate Team</title>
        <meta
          name="description"
          content="Join UrbanEdge Real Estate and build your career in luxury real estate. Explore job opportunities, learn about our company culture, benefits, and application process."
        />
        <meta
          name="keywords"
          content="real estate careers, real estate jobs, UrbanEdge careers, real estate agent jobs, property management careers, real estate sales"
        />
      </Helmet>

      <HeroSection />
      <CultureSection />
      <BenefitsSection />
      <JobListingsSection />
      <ApplicationProcessSection />
      <CTASection />
    </>
  );
};

export default CareersPage;
