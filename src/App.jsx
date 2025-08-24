import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ErrorBoundary from "./components/UI/ErrorBoundary";

// Critical components (keep synchronous for fast initial load)
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout/Layout";
import ChatbotWidget from "./components/UI/ChatbotWidget";

// Lazy load pages for code splitting
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PropertiesPage = lazy(() => import("./pages/PropertiesPage"));
const PropertyDetailPage = lazy(() => import("./pages/PropertyDetailPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const MapDemoPage = lazy(() => import("./pages/MapDemoPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const GuidesPage = lazy(() => import("./pages/GuidesPage"));

// Lazy load Admin Components (heavy and rarely used)
const AdminDashboard = lazy(() =>
  import("./components/Admin/Dashboard/AdminDashboard")
);
const PropertyForm = lazy(() =>
  import("./components/Admin/Properties/PropertyForm")
);

// Lazy load Client Components
const ClientDashboard = lazy(() =>
  import("./components/Client/Dashboard/ClientDashboard")
);
const PropertyDetail = lazy(() =>
  import("./components/Client/Properties/PropertyDetail")
);
const ChatInterface = lazy(() =>
  import("./components/Client/Chat/ChatInterface")
);

// Lazy load Auth Components
const Login = lazy(() => import("./components/Auth/Login"));
const Register = lazy(() => import("./components/Auth/Register"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-beige-light dark:bg-brown">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-taupe mx-auto mb-4"></div>
      <p className="text-brown-dark dark:text-beige-light font-medium">
        Loading...
      </p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ element, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return element;
};

// PropTypes validation
ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requireAdmin: PropTypes.bool,
};

function App() {
  return (
    <div className="min-h-screen bg-beige-light dark:bg-brown">
      <AuthProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Layout>
              <main className="min-h-screen">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />

                    <Route path="/properties" element={<PropertiesPage />} />

                    <Route
                      path="/properties/:id"
                      element={<PropertyDetailPage />}
                    />

                    <Route path="/services" element={<ServicesPage />} />

                    <Route path="/about" element={<AboutPage />} />

                    <Route path="/blog" element={<BlogPage />} />

                    <Route path="/blog/:id" element={<BlogPostPage />} />

                    <Route path="/contact" element={<ContactPage />} />

                    <Route path="/map-demo" element={<MapDemoPage />} />

                    <Route path="/faq" element={<FAQPage />} />

                    <Route
                      path="/privacy-policy"
                      element={<PrivacyPolicyPage />}
                    />

                    <Route path="/careers" element={<CareersPage />} />

                    <Route path="/guides" element={<GuidesPage />} />

                    {/* Client Dashboard Routes */}
                    <Route
                      path="/client/dashboard"
                      element={<ClientDashboard />}
                    />

                    <Route
                      path="/client/properties/:id"
                      element={<PropertyDetail />}
                    />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    {/* Admin Routes (Protected) */}
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute
                          element={<AdminDashboard />}
                          requireAdmin={true}
                        />
                      }
                    />

                    <Route
                      path="/admin/properties/new"
                      element={
                        <ProtectedRoute
                          element={<PropertyForm />}
                          requireAdmin={true}
                        />
                      }
                    />

                    <Route
                      path="/admin/properties/edit/:id"
                      element={
                        <ProtectedRoute
                          element={<PropertyForm />}
                          requireAdmin={true}
                        />
                      }
                    />

                    {/* Chat Routes */}
                    <Route
                      path="/client/chat"
                      element={
                        <ProtectedRoute
                          element={
                            <div className="container mx-auto p-6">
                              <h1 className="text-3xl font-bold mb-6">
                                Chat Support
                              </h1>
                              <div className="bg-white dark:bg-brown-dark rounded-lg shadow-sm border border-gray-200 dark:border-brown p-6">
                                <ChatInterface />
                              </div>
                            </div>
                          }
                          requireAdmin={false}
                        />
                      }
                    />
                  </Routes>
                </Suspense>
              </main>
            </Layout>
            <ChatbotWidget />
          </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </div>
  );
}

export default App;
