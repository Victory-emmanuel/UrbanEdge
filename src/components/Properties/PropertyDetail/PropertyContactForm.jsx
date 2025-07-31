/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
  Textarea,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Select,
  Option,
  Avatar,
  Alert,
  Spinner,
} from "@material-tailwind/react";
import { handleCommunicationAction } from "../../../utils/communicationUtils";

const PropertyContactForm = ({ agent, propertyTitle, propertyId }) => {
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
  const [communicationError, setCommunicationError] = useState(null);
  const [communicationSuccess, setCommunicationSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setCommunicationError("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      setCommunicationError("Please enter your email address");
      return false;
    }
    if (formType === "tour" && !formData.tourDate) {
      setCommunicationError("Please select a preferred date for the tour");
      return false;
    }
    if (formType === "tour" && !formData.tourTime) {
      setCommunicationError("Please select a preferred time for the tour");
      return false;
    }
    return true;
  };

  const handleCommunication = async (type) => {
    setCommunicationError(null);
    setCommunicationSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      const propertyInfo = {
        id: propertyId,
        title: propertyTitle,
      };

      const tourDetails =
        formType === "tour"
          ? {
              tourDate: formData.tourDate,
              tourTime: formData.tourTime,
            }
          : {};

      const result = handleCommunicationAction(type, {
        agent,
        userInfo,
        propertyInfo,
        inquiryType: formType,
        customMessage: formData.message,
        tourDetails,
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
            message: `I'm interested in ${propertyTitle}. Please contact me with more information.`,
            tourDate: "",
            tourTime: "",
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
    <Card className="shadow-xl border-0">
      <CardHeader
        floated={false}
        className="shadow-none bg-gradient-to-r from-brown-50 to-beige-50 dark:from-brown-800 dark:to-brown-700 m-0 rounded-t-xl"
      >
        {/* Agent Info */}
        <div className="flex items-center p-6">
          <Avatar
            src={agent.photo}
            alt={agent.name}
            size="lg"
            className="border-2 border-white shadow-lg"
          />
          <div className="ml-4 flex-1">
            <Typography
              variant="h5"
              className="text-brown-dark dark:text-beige-light font-heading"
            >
              {agent.name}
            </Typography>
            <Typography
              variant="small"
              className="text-brown dark:text-beige-medium mb-3"
            >
              {agent.title || "Real Estate Agent"}
            </Typography>

            {/* Contact Options */}
            <div className="flex flex-wrap gap-4">
              {agent.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center text-taupe hover:text-brown-dark transition-colors"
                >
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  <Typography variant="small">{agent.phone}</Typography>
                </a>
              )}
              {agent.email && (
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center text-taupe hover:text-brown-dark transition-colors"
                >
                  <EnvelopeIcon className="h-4 w-4 mr-1" />
                  <Typography variant="small">{agent.email}</Typography>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-6">
        {/* Form Type Tabs */}
        <Tabs value={formType} className="mb-6">
          <TabsHeader
            className="rounded-lg bg-brown-50 dark:bg-brown-800 p-1"
            indicatorProps={{
              className: "bg-white dark:bg-brown-700 shadow-md rounded-md",
            }}
          >
            <Tab
              value="contact"
              onClick={() => setFormType("contact")}
              className={`font-medium ${
                formType === "contact"
                  ? "text-brown-dark dark:text-beige-light"
                  : "text-brown dark:text-beige-medium"
              }`}
            >
              Contact Agent
            </Tab>
            <Tab
              value="tour"
              onClick={() => setFormType("tour")}
              className={`font-medium ${
                formType === "tour"
                  ? "text-brown-dark dark:text-beige-light"
                  : "text-brown dark:text-beige-medium"
              }`}
            >
              Schedule Tour
            </Tab>
          </TabsHeader>
        </Tabs>

        {/* Form Content */}
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="mb-6">
              <CheckCircleIcon className="h-16 w-16 mx-auto text-green-500" />
            </div>
            <Typography
              variant="h4"
              className="text-brown-dark dark:text-beige-light mb-3 font-heading"
            >
              {formType === "contact" ? "Message Sent!" : "Tour Scheduled!"}
            </Typography>
            <Typography className="text-brown dark:text-beige-medium">
              {formType === "contact"
                ? `Thank you for your interest. ${agent.name} will contact you shortly.`
                : `Your tour has been scheduled. ${agent.name} will confirm the details soon.`}
            </Typography>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Error/Success Messages */}
            {communicationError && (
              <Alert color="red" className="mb-4">
                {communicationError}
              </Alert>
            )}

            {communicationSuccess && (
              <Alert color="green" className="mb-4">
                {communicationSuccess}
              </Alert>
            )}

            {/* Form Fields */}
            <div className="grid gap-6">
              <Input
                label="Your Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="!border-brown-200 focus:!border-taupe"
                labelProps={{
                  className: "!text-brown-600 dark:!text-beige-medium",
                }}
              />

              <Input
                label="Email Address *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="!border-brown-200 focus:!border-taupe"
                labelProps={{
                  className: "!text-brown-600 dark:!text-beige-medium",
                }}
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="!border-brown-200 focus:!border-taupe"
                labelProps={{
                  className: "!text-brown-600 dark:!text-beige-medium",
                }}
              />

              {formType === "tour" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Preferred Date *"
                    type="date"
                    name="tourDate"
                    value={formData.tourDate}
                    onChange={handleInputChange}
                    required
                    className="!border-brown-200 focus:!border-taupe"
                    labelProps={{
                      className: "!text-brown-600 dark:!text-beige-medium",
                    }}
                  />

                  <Select
                    label="Preferred Time *"
                    value={formData.tourTime}
                    onChange={(value) =>
                      setFormData({ ...formData, tourTime: value })
                    }
                    className="!border-brown-200 focus:!border-taupe"
                    labelProps={{
                      className: "!text-brown-600 dark:!text-beige-medium",
                    }}
                  >
                    <Option value="Morning (9AM-12PM)">
                      Morning (9AM-12PM)
                    </Option>
                    <Option value="Afternoon (12PM-4PM)">
                      Afternoon (12PM-4PM)
                    </Option>
                    <Option value="Evening (4PM-7PM)">Evening (4PM-7PM)</Option>
                  </Select>
                </div>
              )}

              <Textarea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="!border-brown-200 focus:!border-taupe"
                labelProps={{
                  className: "!text-brown-600 dark:!text-beige-medium",
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {/* WhatsApp Button (Primary) */}
              <Button
                onClick={() => handleCommunication("whatsapp")}
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-3 py-3"
                size="lg"
              >
                {isSubmitting ? (
                  <Spinner className="h-5 w-5" />
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                )}
                {formType === "contact"
                  ? "Send WhatsApp Message"
                  : "Schedule Tour via WhatsApp"}
              </Button>

              {/* Email Button (Secondary) */}
              {/* <Button
                onClick={() => handleCommunication("email")}
                disabled={isSubmitting}
                variant="outlined"
                className="w-full border-brown-300 text-brown-700 hover:bg-brown-50 flex items-center justify-center gap-3 py-3"
                size="lg"
              >
                <EnvelopeIcon className="h-5 w-5" />
                {formType === "contact"
                  ? "Send Email Instead"
                  : "Schedule Tour via Email"}
              </Button> */}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PropertyContactForm;
