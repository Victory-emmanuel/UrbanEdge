import { Helmet } from "react-helmet";
import HeroSection from "../components/About/HeroSection";
import StorySection from "../components/About/StorySection";
import ValuesSection from "../components/About/ValuesSection";
import TeamSection from "../components/About/TeamSection";
import AwardsSection from "../components/About/AwardsSection";
import CTASection from "../components/About/CTASection";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us | UrbanEdge Real Estate</title>
        <meta
          name="description"
          content="Learn about UrbanEdge Real Estate, our team of experienced professionals, our mission, values, and commitment to exceptional service in luxury real estate."
        />
      </Helmet>

      <HeroSection />
      <StorySection />
      <ValuesSection />
      <TeamSection />
      <AwardsSection />
      <CTASection />
    </>
  );
};

export default AboutPage;
