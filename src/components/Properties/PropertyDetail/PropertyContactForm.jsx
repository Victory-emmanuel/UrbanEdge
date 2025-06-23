import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDaysIcon, PhoneIcon } from "@heroicons/react/24/outline";

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

        <div>
          <h3 className="font-heading font-bold text-brown-dark dark:text-beige-light">
            {agent.name}
          </h3>
          <p className="text-brown dark:text-beige-medium text-sm mb-1">
            {agent.title}
          </p>
          <div className="flex items-center text-taupe">
            <PhoneIcon className="h-4 w-4 mr-1" />
            <a href={`tel:${agent.phone}`} className="text-sm hover:underline">
              {agent.phone}
            </a>
          </div>
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
