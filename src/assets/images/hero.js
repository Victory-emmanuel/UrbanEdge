// Hero image configuration for optimal LCP
// Using the existing image URL with responsive parameters

const baseUrl = "https://i.postimg.cc/FKNnx6LX/2151694115-min.webp";

export const heroImage = {
  // Modern format sources with different sizes
  sources: [
    {
      media: "(max-width: 768px)",
      srcSet: `${baseUrl} 768w`,
      type: "image/webp",
    },
    {
      media: "(max-width: 1024px)",
      srcSet: `${baseUrl} 1024w`,
      type: "image/webp",
    },
    {
      media: "(min-width: 1025px)",
      srcSet: `${baseUrl} 1600w`,
      type: "image/webp",
    },
  ],

  // Fallback src
  src: baseUrl,

  // Preload configuration
  preload: {
    href: baseUrl,
    as: "image",
    type: "image/webp",
    media: "(min-width: 768px)",
  },

  // Image attributes for performance
  width: 1600,
  height: 900, // 16:9 aspect ratio
  alt: "Luxury home exterior showcasing modern architecture - UrbanEdge Real Estate",

  // Sizes attribute for responsive loading
  sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1600px",
};
