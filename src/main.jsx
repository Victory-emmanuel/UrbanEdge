import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import MaterialTailwindProvider from "./components/UI/MaterialTailwindProvider";
import "./utils/bundlePerformanceMonitor.jsx"; // Start performance monitoring

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MaterialTailwindProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MaterialTailwindProvider>
  </StrictMode>
);
