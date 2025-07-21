import { useEffect, useState } from "react";

/**
 * JotForm AI Chatbot Widget Component
 *
 * This component integrates the JotForm AI chatbot into the UrbanEdge real estate application.
 * The chatbot provides AI-powered assistance for real estate inquiries and property searches.
 *
 * Features:
 * - Loads JotForm AI chatbot script dynamically
 * - Configured to skip welcome message for better UX
 * - Maximizable interface for enhanced user interaction
 * - Error handling for script loading failures
 * - Responsive design that works across all screen sizes
 */
const ChatbotWidget = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    // Check if script is already loaded to prevent duplicate loading
    const existingScript = document.querySelector(
      'script[src*="cdn.jotfor.ms/agent/embedjs"]'
    );

    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    // Create and configure the JotForm script element
    const script = document.createElement("script");
    script.src =
      "https://cdn.jotfor.ms/agent/embedjs/01977ef6126a721ca60420e562e7a5468ca6/embed.js?skipWelcome=1&maximizable=1";
    script.async = true;

    // Handle successful script loading
    script.onload = () => {
      setScriptLoaded(true);
      setScriptError(false);
      console.log("✅ JotForm AI Chatbot loaded successfully");
    };

    // Handle script loading errors
    script.onerror = () => {
      setScriptError(true);
      setScriptLoaded(false);
      console.error("❌ Failed to load JotForm AI Chatbot script");
    };

    // Add script to document head
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      const scriptToRemove = document.querySelector(
        'script[src*="cdn.jotfor.ms/agent/embedjs"]'
      );
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, []);

  // Don't render anything while script is loading or if there's an error
  // The JotForm script will handle rendering the chatbot widget
  if (scriptError) {
    // Optional: You could render a fallback UI here
    console.warn(
      "JotForm AI Chatbot failed to load. Consider implementing a fallback."
    );
    return null;
  }

  // The JotForm script automatically renders the chatbot widget
  // No additional JSX needed as the script handles the UI
  return null;
};

export default ChatbotWidget;
