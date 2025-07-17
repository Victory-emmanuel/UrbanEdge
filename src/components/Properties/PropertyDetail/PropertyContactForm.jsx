import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDaysIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const PropertyContactForm = ({ agent, propertyTitle }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in ${propertyTitle}. Please contact me with more information.`,
    tourDate: "",
    tourTime: "",
  });
  const [formType, setFormType] = useState("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: `I'm interested in ${propertyTitle}. Please contact me with more information.`,
          tourDate: "",
          tourTime: "",
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-brown-dark rounded-lg shadow-lg p-6">
      {/* Agent Info */}
      <div className="flex items-center mb-6">
        <img
          src={agent.photo}
          alt={agent.name}
          className="w-16 h-16 rounded-full object-cover mr-4"
        />

        <div className="flex-1">
          <h3 className="font-heading font-bold text-brown-dark dark:text-beige-light">
            {agent.name}
          </h3>
          <p className="text-brown dark:text-beige-medium text-sm mb-2">
            {agent.title || "Real Estate Agent"}
          </p>

          {/* Contact Options */}
          <div className="space-y-1">
            {/* Phone */}
            {agent.phone && (
              <div className="flex items-center text-taupe">
                <PhoneIcon className="h-4 w-4 mr-2" />
                <a href={`tel:${agent.phone}`} className="text-sm hover:underline">
                  {agent.phone}
                </a>
              </div>
            )}

            {/* Email */}
            {agent.email && (
              <div className="flex items-center text-taupe">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                <a href={`mailto:${agent.email}`} className="text-sm hover:underline">
                  {agent.email}
                </a>
              </div>
            )}
          </div>

          {/* WhatsApp Button */}
          {agent.whatsapp_link && (
            <div className="mt-3">
              <a
                href={agent.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Form Type Tabs */}
      <div className="flex mb-6 border-b border-beige-medium dark:border-brown">
        <button
          onClick={() => setFormType("contact")}
          className={`flex-1 py-2 font-medium text-center ${
            formType === "contact"
              ? "text-taupe border-b-2 border-taupe"
              : "text-brown dark:text-beige-medium"
          }`}
        >
          Contact Agent
        </button>
        <button
          onClick={() => setFormType("tour")}
          className={`flex-1 py-2 font-medium text-center ${
            formType === "tour"
              ? "text-taupe border-b-2 border-taupe"
              : "text-brown dark:text-beige-medium"
          }`}
        >
          Schedule Tour
        </button>
      </div>

      {/* Form */}
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6"
        >
          <div className="text-taupe mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-heading font-bold text-brown-dark dark:text-beige-light mb-2">
            {formType === "contact" ? "Message Sent!" : "Tour Scheduled!"}
          </h3>
          <p className="text-brown dark:text-beige-medium">
            {formType === "contact"
              ? `Thank you for your interest. ${agent.name} will contact you shortly.`
              : `Your tour has been scheduled. ${agent.name} will confirm the details soon.`}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
              >
                Your Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
              >
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            {formType === "tour" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="tourDate"
                    className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
                  >
                    Preferred Date*
                  </label>
                  <input
                    type="date"
                    id="tourDate"
                    name="tourDate"
                    value={formData.tourDate}
                    onChange={handleInputChange}
                    className="input"
                    required={formType === "tour"}
                  />
                </div>
                <div>
                  <label
                    htmlFor="tourTime"
                    className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
                  >
                    Preferred Time*
                  </label>
                  <select
                    id="tourTime"
                    name="tourTime"
                    value={formData.tourTime}
                    onChange={handleInputChange}
                    className="input"
                    required={formType === "tour"}
                  >
                    <option value="">Select a time</option>
                    <option value="Morning (9AM-12PM)">
                      Morning (9AM-12PM)
                    </option>
                    <option value="Afternoon (12PM-4PM)">
                      Afternoon (12PM-4PM)
                    </option>
                    <option value="Evening (4PM-7PM)">Evening (4PM-7PM)</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className="input"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary w-full flex items-center justify-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : formType === "tour" ? (
                <CalendarDaysIcon className="h-5 w-5 mr-2" />
              ) : (
                <></>
              )}
              {formType === "contact" ? "Send Message" : "Schedule Tour"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PropertyContactForm;
