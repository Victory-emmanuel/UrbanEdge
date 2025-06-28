import { ThemeProvider } from "@material-tailwind/react";

/**
 * Material Tailwind Provider component to wrap the application
 * and provide Material Tailwind theme context
 */
const MaterialTailwindProvider = ({ children }) => {
  // Custom theme configuration
  const theme = {
    colors: {
      blue: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
      },
    },
  };

  return <ThemeProvider value={theme}>{children}</ThemeProvider>;
};

export default MaterialTailwindProvider;