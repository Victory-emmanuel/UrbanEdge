import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imagetools({
      defaultDirectives: {
        format: ["avif", "webp", "jpeg"],
        quality: [75, 80, 85],
        progressive: true,
        // Generate responsive sizes
        w: [400, 800, 1200, 1600],
        // Enable different formats for different screen sizes
        as: "picture",
      },
      // Additional optimization for specific image types
      overrides: {
        // For hero images, prioritize quality and formats
        hero: {
          format: ["avif", "webp", "jpeg"],
          quality: [80, 85, 90],
          w: [800, 1200, 1600, 2000],
        },
        // For thumbnails, prioritize size reduction
        thumbnail: {
          format: ["avif", "webp", "jpeg"],
          quality: [70, 75],
          w: [200, 400, 600],
        },
        // For gallery images, balance quality and size
        gallery: {
          format: ["avif", "webp", "jpeg"],
          quality: [75, 80],
          w: [600, 1000, 1400],
        },
      },
    }),
    visualizer({
      filename: "./dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          // React vendor chunk
          react_vendor: ["react", "react-dom"],
          // Router chunk
          router_vendor: ["react-router-dom", "react-router-hash-link"],
          // UI library chunks
          ui_vendor: [
            "@material-tailwind/react",
            "@headlessui/react",
            "@heroicons/react",
          ],
          // Animation and motion chunks
          animation_vendor: ["framer-motion", "react-simple-typewriter"],
          // Data fetching and state management
          data_vendor: [
            "@tanstack/react-query",
            "@supabase/supabase-js",
            "axios",
          ],
          // Form and validation
          form_vendor: ["react-hook-form", "@hookform/resolvers", "zod"],
          // Utility libraries
          util_vendor: ["date-fns", "uuid", "clsx", "class-variance-authority"],
          // Maps and visualization
          map_vendor: [
            "leaflet",
            "react-leaflet",
            "react-leaflet-cluster",
            "recharts",
          ],
          // Document and file processing
          doc_vendor: ["docx", "react-markdown", "remark-gfm"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    target: "es2020",
  },
});
