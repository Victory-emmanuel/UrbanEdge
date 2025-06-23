import { Helmet } from "react-helmet";
import HeroSection from "../components/Home/HeroSection";
import FeaturedProperties from "../components/Home/FeaturedProperties";
import LatestProperties from "../components/Home/LatestProperties";
import ValueProposition from "../components/Home/ValueProposition";
import HowItWorks from "../components/Home/HowItWorks";
import Testimonials from "../components/Home/Testimonials";
import BlogTeaser from "../components/Home/BlogTeaser";
import CTASection from "../components/Home/CTASection";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>
          UrbanEdge Real Estate | Luxury Properties & Exclusive Listings
        </title>
        <meta
          name="description"
          content="Discover exceptional properties with UrbanEdge Real Estate. We specialize in luxury homes, investment properties, and personalized real estate services."
        />
      </Helmet>

      <HeroSection />
      <FeaturedProperties />
      <LatestProperties />
      <ValueProposition />
      <HowItWorks />
      <Testimonials />
      <BlogTeaser />
      <CTASection />
    </>
  );
};

export default HomePage;
