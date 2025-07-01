/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "./src/components/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // UrbanEdge color palette
        beige: {
          light: "#F6F3EC",
          medium: "#ECE4DA",
        },
        taupe: "#B9A590",
        brown: {
          DEFAULT: "#574C3F",
          dark: "#36302A",
        },
        white: "#FFFFFF",

        // UI semantic colors
        background: "#F6F3EC", // Light beige background
        foreground: "#36302A", // Dark brown text
        card: "#ECE4DA", // Medium beige for cards
        "card-foreground": "#36302A", // Dark brown text on cards
        popover: "#ECE4DA", // Medium beige for popovers
        "popover-foreground": "#36302A", // Dark brown text on popovers
        primary: "#B9A590", // Taupe for primary elements
        "primary-foreground": "#F6F3EC", // Light beige text on primary elements
        secondary: "#574C3F", // Brown for secondary elements
        "secondary-foreground": "#F6F3EC", // Light beige text on secondary elements
        muted: "#ECE4DA", // Medium beige for muted areas
        "muted-foreground": "#574C3F", // Brown text on muted areas
        accent: "#36302A", // Dark brown for accent elements
        "accent-foreground": "#F6F3EC", // Light beige text on accent elements
        destructive: "#DC1856", // Red for destructive actions
        "destructive-foreground": "#F6F3EC", // Light beige text on destructive elements
        border: "#B9A590", // Taupe for borders
        input: "#B9A590", // Taupe for input borders
        ring: "#574C3F", // Brown for focus rings
      },
      fontFamily: {
        heading: ["MARCELLUS", "serif"], // Marcellus for headings
        body: ["PT SERIF", "serif"], // PT Serif for body text
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '0.5rem',
          xs: '0.25rem',
          ss: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
        screens: {
          xx:'320px',
          xs: '400px',
          ss: '600px',
          sm: '800px',
          md: '1000px',
          lg: '1200px',
          xl: '1700px',
        },
      },
    },
    screens: {
       xx:'320px',
      xs: "400px",
      ss: "600px",
      sm: "800px",
      md: "1000px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [require("tailwindcss-animate")], // Node.js require function
};
