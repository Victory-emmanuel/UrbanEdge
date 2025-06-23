import { Helmet } from "react-helmet";
import HeroSection from "../components/Contact/HeroSection";
import ContactForm from "../components/Contact/ContactForm";
import ContactInfo from "../components/Contact/ContactInfo";
import MapSection from "../components/Contact/MapSection";
import FAQSection from "../components/Contact/FAQSection";

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | UrbanEdge Real Estate</title>
        <meta
          name="description"
          content="Get in touch with UrbanEdge Real Estate. Contact our team of experienced professionals for all your real estate needs, questions, and inquiries."
        />
      </Helmet>

      <HeroSection />

      <section className="py-16 bg-beige-light dark:bg-brown">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div>
              <ContactInfo />
            </div>
          </div>

          {/* Map */}
          <MapSection />

          {/* FAQs */}
          <FAQSection />
        </div>
      </section>
    </>
  );
};

export default ContactPage;
