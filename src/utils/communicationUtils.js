/**
 * Communication Utilities for WhatsApp and Email Integration
 * 
 * This module provides utilities for generating WhatsApp URLs and email templates
 * for property inquiries and tour scheduling in the UrbanEdge Real Estate application.
 */

/**
 * Extract phone number from WhatsApp link
 * @param {string} whatsappLink - WhatsApp link (e.g., "https://wa.me/1234567890")
 * @returns {string|null} - Extracted phone number or null if invalid
 */
export const extractPhoneFromWhatsAppLink = (whatsappLink) => {
  if (!whatsappLink || typeof whatsappLink !== 'string') {
    return null;
  }

  // Handle different WhatsApp URL formats
  const patterns = [
    /wa\.me\/(\d+)/,           // https://wa.me/1234567890
    /api\.whatsapp\.com\/send\?phone=(\d+)/, // https://api.whatsapp.com/send?phone=1234567890
    /whatsapp:\/\/send\?phone=(\d+)/, // whatsapp://send?phone=1234567890
  ];

  for (const pattern of patterns) {
    const match = whatsappLink.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Validate and format phone number
 * @param {string} phoneNumber - Phone number to validate
 * @returns {string|null} - Formatted phone number or null if invalid
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return null;
  }

  // Remove all non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid length (7-15 digits as per international standards)
  if (cleanNumber.length < 7 || cleanNumber.length > 15) {
    return null;
  }

  return cleanNumber;
};

/**
 * Get current website URL for property links
 * @returns {string} - Base URL of the current website
 */
export const getWebsiteBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  // Fallback for server-side rendering
  return 'https://urbanedge.com';
};

/**
 * Generate property URL
 * @param {string} propertyId - Property ID
 * @returns {string} - Full property URL
 */
export const generatePropertyUrl = (propertyId) => {
  const baseUrl = getWebsiteBaseUrl();
  return `${baseUrl}/properties/${propertyId}`;
};

/**
 * Create formatted message for property inquiry
 * @param {Object} userInfo - User information
 * @param {Object} propertyInfo - Property information
 * @param {string} inquiryType - Type of inquiry ('contact' or 'tour')
 * @param {string} customMessage - User's custom message
 * @param {Object} tourDetails - Tour details (for tour requests)
 * @returns {string} - Formatted message
 */
export const createPropertyInquiryMessage = (
  userInfo,
  propertyInfo,
  inquiryType = 'contact',
  customMessage = '',
  tourDetails = {}
) => {
  const propertyUrl = generatePropertyUrl(propertyInfo.id);
  const isTouring = inquiryType === 'tour';

  let message = `Hello! I'm ${isTouring ? 'interested in scheduling a tour for' : 'interested in'} the property: ${propertyInfo.title}\n\n`;

  // User details
  message += `My details:\n`;
  message += `- Name: ${userInfo.name}\n`;
  message += `- Email: ${userInfo.email}\n`;
  if (userInfo.phone) {
    message += `- Phone: ${userInfo.phone}\n`;
  }
  message += `\n`;

  // Tour-specific details
  if (isTouring && tourDetails.tourDate) {
    message += `Preferred Tour Details:\n`;
    message += `- Date: ${tourDetails.tourDate}\n`;
    if (tourDetails.tourTime) {
      message += `- Time: ${tourDetails.tourTime}\n`;
    }
    message += `\n`;
  }

  // Custom message
  if (customMessage && customMessage.trim()) {
    message += `${isTouring ? 'Additional Message' : 'Message'}: ${customMessage.trim()}\n\n`;
  }

  // Property link
  message += `Property Link: ${propertyUrl}\n\n`;

  // Closing
  message += isTouring 
    ? `Please confirm the tour details.\n\nThank you!`
    : `Please contact me for more information.\n\nThank you!`;

  return message;
};

/**
 * Generate WhatsApp URL with message
 * @param {string} phoneNumber - Phone number (with or without country code)
 * @param {string} message - Message to send
 * @returns {string} - WhatsApp URL
 */
export const generateWhatsAppUrl = (phoneNumber, message) => {
  const validatedPhone = validatePhoneNumber(phoneNumber);
  
  if (!validatedPhone) {
    throw new Error('Invalid phone number provided');
  }

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${validatedPhone}?text=${encodedMessage}`;
};

/**
 * Create email subject for property inquiry
 * @param {string} propertyTitle - Property title
 * @param {string} inquiryType - Type of inquiry ('contact' or 'tour')
 * @returns {string} - Email subject
 */
export const createEmailSubject = (propertyTitle, inquiryType = 'contact') => {
  const prefix = inquiryType === 'tour' ? 'Tour Request for' : 'Inquiry about';
  return `${prefix} ${propertyTitle}`;
};

/**
 * Create email body for property inquiry
 * @param {Object} userInfo - User information
 * @param {Object} propertyInfo - Property information
 * @param {string} customMessage - User's custom message
 * @param {string} inquiryType - Type of inquiry ('contact' or 'tour')
 * @param {Object} tourDetails - Tour details (for tour requests)
 * @returns {string} - Email body
 */
export const createEmailBody = (
  userInfo,
  propertyInfo,
  customMessage = '',
  inquiryType = 'contact',
  tourDetails = {}
) => {
  const propertyUrl = generatePropertyUrl(propertyInfo.id);
  const isTouring = inquiryType === 'tour';

  let body = `Hello,\n\n`;
  body += `I am ${isTouring ? 'interested in scheduling a tour for' : 'interested in'} the following property:\n\n`;
  
  // Property details
  body += `Property: ${propertyInfo.title}\n`;
  body += `Link: ${propertyUrl}\n\n`;

  // User details
  body += `My contact information:\n`;
  body += `Name: ${userInfo.name}\n`;
  body += `Email: ${userInfo.email}\n`;
  if (userInfo.phone) {
    body += `Phone: ${userInfo.phone}\n`;
  }
  body += `\n`;

  // Tour-specific details
  if (isTouring && tourDetails.tourDate) {
    body += `Preferred Tour Details:\n`;
    body += `Date: ${tourDetails.tourDate}\n`;
    if (tourDetails.tourTime) {
      body += `Time: ${tourDetails.tourTime}\n`;
    }
    body += `\n`;
  }

  // Custom message
  if (customMessage && customMessage.trim()) {
    body += `Message:\n${customMessage.trim()}\n\n`;
  }

  // Closing
  body += isTouring 
    ? `Please confirm the tour details and let me know if you need any additional information.\n\n`
    : `Please contact me for more information about this property.\n\n`;
  
  body += `Thank you for your time.\n\n`;
  body += `Best regards,\n${userInfo.name}`;

  return body;
};

/**
 * Generate mailto URL for email
 * @param {string} recipientEmail - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {string} - Mailto URL
 */
export const generateMailtoUrl = (recipientEmail, subject, body) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  return `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;
};

/**
 * Get agent contact information with fallbacks
 * @param {Object} agent - Agent object
 * @returns {Object} - Processed agent contact info
 */
export const getAgentContactInfo = (agent) => {
  const result = {
    hasWhatsApp: false,
    hasEmail: false,
    whatsappPhone: null,
    email: null,
    name: agent?.name || 'UrbanEdge Agent'
  };

  // Check WhatsApp availability
  if (agent?.whatsapp_link) {
    const phone = extractPhoneFromWhatsAppLink(agent.whatsapp_link);
    if (phone) {
      result.hasWhatsApp = true;
      result.whatsappPhone = phone;
    }
  }

  // Check email availability
  if (agent?.email && agent.email.includes('@')) {
    result.hasEmail = true;
    result.email = agent.email;
  }

  return result;
};

/**
 * Handle communication action (WhatsApp or Email)
 * @param {string} type - Communication type ('whatsapp' or 'email')
 * @param {Object} params - Parameters for generating the communication
 * @returns {Object} - Result with success status and URL or error
 */
export const handleCommunicationAction = (type, params) => {
  try {
    const {
      agent,
      userInfo,
      propertyInfo,
      inquiryType,
      customMessage,
      tourDetails
    } = params;

    const agentContact = getAgentContactInfo(agent);

    if (type === 'whatsapp') {
      if (!agentContact.hasWhatsApp) {
        return {
          success: false,
          error: 'WhatsApp contact not available for this agent'
        };
      }

      const message = createPropertyInquiryMessage(
        userInfo,
        propertyInfo,
        inquiryType,
        customMessage,
        tourDetails
      );

      const whatsappUrl = generateWhatsAppUrl(agentContact.whatsappPhone, message);

      return {
        success: true,
        url: whatsappUrl,
        message: 'Opening WhatsApp...'
      };
    }

    if (type === 'email') {
      if (!agentContact.hasEmail) {
        return {
          success: false,
          error: 'Email contact not available for this agent'
        };
      }

      const subject = createEmailSubject(propertyInfo.title, inquiryType);
      const body = createEmailBody(
        userInfo,
        propertyInfo,
        customMessage,
        inquiryType,
        tourDetails
      );

      const emailUrl = generateMailtoUrl(agentContact.email, subject, body);

      return {
        success: true,
        url: emailUrl,
        message: 'Opening email client...'
      };
    }

    return {
      success: false,
      error: 'Invalid communication type'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to generate communication link'
    };
  }
};
