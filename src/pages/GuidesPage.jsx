import { Helmet } from "react-helmet";
import HeroSection from "../components/Guides/HeroSection";
import GuideCategoriesSection from "../components/Guides/GuideCategoriesSection";
import FeaturedGuidesSection from "../components/Guides/FeaturedGuidesSection";
import ResourcesSection from "../components/Guides/ResourcesSection";
import NewsletterSection from "../components/Guides/NewsletterSection";

const GuidesPage = () => {
  return (
    <>
      <Helmet>
        <title>Real Estate Guides & Resources | UrbanEdge Real Estate</title>
        <meta
          name="description"
          content="Access comprehensive real estate guides, market insights, buying and selling tips, investment strategies, and expert resources from UrbanEdge Real Estate professionals."
        />
        <meta
          name="keywords"
          content="real estate guides, property buying guide, selling tips, investment strategies, market insights, real estate resources, UrbanEdge guides"
        />
      </Helmet>

      <HeroSection />
      <GuideCategoriesSection />
      <FeaturedGuidesSection />
      <ResourcesSection />
      <NewsletterSection />
    </>
  );
};

export default GuidesPage;
