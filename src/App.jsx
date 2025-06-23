
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ErrorBoundary from "./components/UI/ErrorBoundary";

// Pages
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import MapDemoPage from "./pages/MapDemoPage";

// Admin Components
import AdminDashboard from "./components/Admin/Dashboard/AdminDashboard";
import PropertyForm from "./components/Admin/Properties/PropertyForm";

// Client Components
import ClientDashboard from "./components/Client/Dashboard/ClientDashboard";
import PropertyDetail from "./components/Client/Properties/PropertyDetail";
import ChatInterface from "./components/Client/Chat/ChatInterface";

// Auth Components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

// Components
import Layout from "./components/Layout/Layout";
import ChatbotWidget from "./components/UI/ChatbotWidget";

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

function App() {
  return (
    <div className="min-h-screen bg-beige-light dark:bg-brown">
      <AuthProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Layout>
              <main className="min-h-screen">
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
                            <h1 className="text-3xl font-bold mb-6">Chat Support</h1>
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
