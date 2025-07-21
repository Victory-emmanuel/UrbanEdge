import { useState } from "react";
import { motion } from "framer-motion";
import { handleCommunicationAction } from "../../utils/communicationUtils";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    service: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [communicationError, setCommunicationError] = useState(null);
  const [communicationSuccess, setCommunicationSuccess] = useState(null);

  const serviceOptions = [
    { value: "", label: "Select a service" },
    { value: "buying", label: "Buying" },
    { value: "selling", label: "Selling" },
    { value: "renting", label: "Renting" },
    { value: "property-management", label: "Property Management" },
    { value: "investment", label: "Investment Advisory" },
    { value: "development", label: "Development Services" },
    { value: "other", label: "Other" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (!formData.service) {
      newErrors.service = "Please select a service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCommunication = async (type) => {
    setCommunicationError(null);
    setCommunicationSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Default agent contact info for general inquiries
      const agent = {
        name: "UrbanEdge Support Team",
        email: "contact@urbanedge.com",
        whatsapp_link: "https://wa.me/2348123456789", // Default WhatsApp number
      };

      const userInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      // Create a general property info for contact form
      const propertyInfo = {
        id: "general-inquiry",
        title: `${formData.service} - ${formData.subject}`,
      };

      const result = handleCommunicationAction(type, {
        agent,
        userInfo,
        propertyInfo,
        inquiryType: "contact",
        customMessage: formData.message,
        tourDetails: {},
      });

      if (result.success) {
        setCommunicationSuccess(result.message);
        // Open the communication link
        window.open(result.url, "_blank");

        // Show success state
        setIsSubmitted(true);

        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setCommunicationSuccess(null);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
            service: "",
          });
        }, 5000);
      } else {
        setCommunicationError(result.error);
      }
    } catch (error) {
      setCommunicationError(
        "Failed to generate communication link. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-brown-dark rounded-lg shadow-lg p-6 md:p-8"
    >
      <h2 className="text-2xl font-heading font-bold mb-6 text-brown-dark dark:text-beige-light">
        Send Us a Message
      </h2>

      {isSubmitted ? (
        <div className="text-center py-8">
          <div className="text-taupe mb-4">
            <svg
              className="h-16 w-16 mx-auto"
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
            Message Sent!
          </h3>
          <p className="text-brown dark:text-beige-medium">
            Thank you for contacting us. We'll get back to you as soon as
            possible.
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="md:col-span-1">
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
                className={`input ${errors.name ? "border-destructive" : ""}`}
              />

              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-1">
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
                className={`input ${errors.email ? "border-destructive" : ""}`}
              />

              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="md:col-span-1">
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

            {/* Service */}
            <div className="md:col-span-1">
              <label
                htmlFor="service"
                className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
              >
                Service Interested In*
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className={`input ${
                  errors.service ? "border-destructive" : ""
                }`}
              >
                {serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.service}
                </p>
              )}
            </div>

            {/* Subject */}
            <div className="md:col-span-2">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
              >
                Subject*
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`input ${
                  errors.subject ? "border-destructive" : ""
                }`}
              />

              {errors.subject && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
              >
                Message*
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className={`input ${
                  errors.message ? "border-destructive" : ""
                }`}
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {communicationError && (
              <div className="md:col-span-2">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {communicationError}
                </div>
              </div>
            )}

            {/* Success Message */}
            {communicationSuccess && (
              <div className="md:col-span-2">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                  {communicationSuccess}
                </div>
              </div>
            )}

            {/* Communication Buttons */}
            <div className="md:col-span-2 space-y-3">
              {/* WhatsApp Button (Primary) */}
              <button
                onClick={() => handleCommunication("whatsapp")}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200 ${
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
                ) : (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                )}
                Send WhatsApp Message
              </button>

              {/* Email Button (Secondary) */}
              <button
                onClick={() => handleCommunication("email")}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors duration-200 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Send Email Instead
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ContactForm;
