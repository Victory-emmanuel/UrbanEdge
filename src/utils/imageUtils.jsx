/**
 * Image Utilities for UrbanEdge Real Estate Application
 *
 * Centralized image handling utilities including fallback images,
 * validation, and error handling for consistent image display
 * across the application.
 */

/**
 * Reliable fallback images from Unsplash
 * These are high-quality, reliable images that won't cause network errors
 */
export const FALLBACK_IMAGES = {
  // Primary fallback - modern house exterior (optimized for 400px)
  PRIMARY:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=75",

  // Secondary fallback - luxury property (optimized for 400px)
  SECONDARY:
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=75",

  // Tertiary fallback - apartment building (optimized for 400px)
  TERTIARY:
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=75",

  // Property form specific fallback (smaller size)
  PROPERTY_FORM:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=75",

  // Small thumbnail fallback (very small size)
  THUMBNAIL:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=70",

  // Gallery fallback (medium size)
  GALLERY:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=75",
};

/**
 * Image size configurations for different use cases
 */
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 300, height: 200 },
  CARD: { width: 400, height: 300 },
  GALLERY: { width: 800, height: 600 },
  HERO: { width: 1200, height: 800 },
  FORM_PREVIEW: { width: 400, height: 300 },
};

/**
 * Validate if a URL is a valid image URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL appears to be a valid image URL
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    return false;
  }

  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
  const hasImageExtension = imageExtensions.test(url);

  // Check for common image hosting domains
  const imageHosts = [
    "unsplash.com",
    "images.unsplash.com",
    "pixabay.com",
    "pexels.com",
    "imgur.com",
    "cloudinary.com",
    "amazonaws.com",
    "googleusercontent.com",
    "supabase.co",
  ];

  const hasImageHost = imageHosts.some((host) => url.includes(host));

  // URL is valid if it has image extension OR is from a known image host
  return hasImageExtension || hasImageHost;
};

/**
 * Get a fallback image URL for different contexts
 * @param {string} context - Context for the fallback image
 * @returns {string} Fallback image URL
 */
export const getFallbackImage = (context = "primary") => {
  const contextMap = {
    primary: FALLBACK_IMAGES.PRIMARY,
    secondary: FALLBACK_IMAGES.SECONDARY,
    tertiary: FALLBACK_IMAGES.TERTIARY,
    form: FALLBACK_IMAGES.PROPERTY_FORM,
    thumbnail: FALLBACK_IMAGES.THUMBNAIL,
    gallery: FALLBACK_IMAGES.GALLERY,
    card: FALLBACK_IMAGES.PRIMARY,
  };

  return contextMap[context.toLowerCase()] || FALLBACK_IMAGES.PRIMARY;
};

/**
 * Handle image error with appropriate fallback
 * @param {Event} event - Image error event
 * @param {string} context - Context for fallback selection
 */
export const handleImageError = (event, context = "primary") => {
  const img = event.target;

  // Prevent infinite error loops
  if (img.dataset.fallbackAttempted) {
    console.warn("Image fallback failed, using default fallback");
    img.src = FALLBACK_IMAGES.PRIMARY;
    return;
  }

  // Mark that we've attempted a fallback
  img.dataset.fallbackAttempted = "true";

  // Set the appropriate fallback image
  img.src = getFallbackImage(context);

  // Log the error for debugging
  console.warn(`Image failed to load, using fallback: ${img.src}`);
};

/**
 * Get the best available image URL from a property object
 * @param {Object} property - Property object with various image fields
 * @param {string} context - Context for fallback selection
 * @returns {string} Best available image URL
 */
export const getPropertyImageUrl = (property, context = "primary") => {
  if (!property) return getFallbackImage(context);

  // Check various possible image field names
  const imageFields = ["thumbnail_url", "imageUrl", "image_url"];

  // Check direct image fields
  for (const field of imageFields) {
    if (property[field] && isValidImageUrl(property[field])) {
      return property[field];
    }
  }

  // Check images array
  if (
    property.images &&
    Array.isArray(property.images) &&
    property.images.length > 0
  ) {
    const firstImage = property.images[0];
    const imageUrl = firstImage.url || firstImage.image_url;
    if (imageUrl && isValidImageUrl(imageUrl)) {
      return imageUrl;
    }
  }

  // Check property_images array
  if (
    property.property_images &&
    Array.isArray(property.property_images) &&
    property.property_images.length > 0
  ) {
    const firstImage = property.property_images[0];
    const imageUrl = firstImage.image_url || firstImage.url;
    if (imageUrl && isValidImageUrl(imageUrl)) {
      return imageUrl;
    }
  }

  // Return fallback if no valid image found
  return getFallbackImage(context);
};

/**
 * Create an optimized image URL with size parameters
 * @param {string} url - Original image URL
 * @param {Object} options - Size and quality options
 * @returns {string} Optimized image URL
 */
export const optimizeImageUrl = (url, options = {}) => {
  if (!url || !isValidImageUrl(url)) {
    return getFallbackImage(options.context || "primary");
  }

  // For Unsplash images, add size and quality parameters
  if (url.includes("unsplash.com")) {
    const { width = 800, height = 600, quality = 80 } = options;

    // Remove existing parameters and add new ones
    const baseUrl = url.split("?")[0];
    return `${baseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&h=${height}&q=${quality}`;
  }

  // For other URLs, return as-is
  return url;
};

/**
 * Preload an image to check if it's valid
 * @param {string} url - Image URL to preload
 * @returns {Promise<boolean>} Promise that resolves to true if image loads successfully
 */
export const preloadImage = (url) => {
  return new Promise((resolve) => {
    if (!url || !isValidImageUrl(url)) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;

    // Timeout after 10 seconds
    setTimeout(() => resolve(false), 10000);
  });
};

/**
 * Validate and sanitize an image URL for use in the application
 * @param {string} url - URL to validate and sanitize
 * @param {string} context - Context for fallback selection
 * @returns {string} Valid, sanitized image URL
 */
export const sanitizeImageUrl = (url, context = "primary") => {
  if (!url || typeof url !== "string") {
    return getFallbackImage(context);
  }

  // Trim whitespace
  url = url.trim();

  // Check if URL is valid
  if (!isValidImageUrl(url)) {
    console.warn(`Invalid image URL provided: ${url}`);
    return getFallbackImage(context);
  }

  return url;
};

/**
 * Get multiple fallback images for gallery use
 * @param {number} count - Number of fallback images needed
 * @returns {Array<Object>} Array of fallback image objects
 */
export const getFallbackImages = (count = 1) => {
  const fallbacks = [
    { url: FALLBACK_IMAGES.PRIMARY, alt: "Property placeholder image 1" },
    { url: FALLBACK_IMAGES.SECONDARY, alt: "Property placeholder image 2" },
    { url: FALLBACK_IMAGES.TERTIARY, alt: "Property placeholder image 3" },
  ];

  // Repeat fallbacks if more images needed
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(fallbacks[i % fallbacks.length]);
  }

  return result;
};

/**
 * Image loading states for UI components
 */
export const IMAGE_STATES = {
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error",
  FALLBACK: "fallback",
};

/**
 * Create a comprehensive image object with all necessary properties
 * @param {string} url - Image URL
 * @param {Object} options - Additional options
 * @returns {Object} Complete image object
 */
export const createImageObject = (url, options = {}) => {
  const {
    alt = "Property image",
    context = "primary",
    width,
    height,
    quality,
  } = options;

  const sanitizedUrl = sanitizeImageUrl(url, context);
  const optimizedUrl = optimizeImageUrl(sanitizedUrl, {
    width,
    height,
    quality,
    context,
  });

  return {
    url: optimizedUrl,
    originalUrl: url,
    alt,
    context,
    fallbackUrl: getFallbackImage(context),
    isValid: isValidImageUrl(url),
    state: IMAGE_STATES.LOADING,
  };
};
