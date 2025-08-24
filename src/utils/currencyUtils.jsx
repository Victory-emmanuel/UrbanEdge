/**
 * Currency utility functions for the real estate application
 * Handles Nigerian Naira (₦) formatting consistently across the app
 */

/**
 * Format a price value as Nigerian Naira with proper formatting
 * @param {number} price - The price value to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted price string with ₦ symbol
 */
export const formatPrice = (price, options = {}) => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    showSymbol = true,
  } = options;

  if (!price || isNaN(price)) {
    return showSymbol ? "₦0" : "0";
  }

  const formattedNumber = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(price);

  return showSymbol ? `₦${formattedNumber}` : formattedNumber;
};

/**
 * Format a price value as Nigerian Naira using Intl.NumberFormat with currency style
 * @param {number} price - The price value to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted price string with ₦ symbol
 */
export const formatCurrency = (price, options = {}) => {
  const { minimumFractionDigits = 0, maximumFractionDigits = 0 } = options;

  if (!price || isNaN(price)) {
    return "₦0";
  }

  // Use custom formatting since NGN might not be fully supported in all browsers
  // We'll use the ₦ symbol directly for better compatibility
  const formattedNumber = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(price);

  return `₦${formattedNumber}`;
};

/**
 * Format a price value for display in property cards and listings
 * @param {number} price - The price value to format
 * @returns {string} Formatted price string or "N/A" if invalid
 */
export const formatPropertyPrice = (price) => {
  if (!price || isNaN(price)) {
    return "N/A";
  }

  return formatPrice(price);
};

/**
 * Parse a price string and return the numeric value
 * @param {string} priceString - Price string to parse
 * @returns {number} Numeric price value
 */
export const parsePrice = (priceString) => {
  if (!priceString) return 0;

  // Remove currency symbol and commas, then parse
  const cleanString = priceString
    .toString()
    .replace(/[₦,$]/g, "")
    .replace(/,/g, "");
  const parsed = parseFloat(cleanString);

  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Currency symbol constant
 */
export const CURRENCY_SYMBOL = "₦";

/**
 * Currency code constant
 */
export const CURRENCY_CODE = "NGN";

/**
 * Currency name constant
 */
export const CURRENCY_NAME = "Nigerian Naira";
