import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";

// Auth Pages
import LoginPage from "./pages/Auth/LoginPage";
import AdminLoginPage from "./pages/Auth/AdminLoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import UnauthorizedPage from "./pages/Auth/UnauthorizedPage";

// Dashboard Pages
import DashboardHomePage from "./pages/Dashboard/DashboardHomePage";
import ProfilePage from "./pages/Dashboard/ProfilePage";
import AdminDashboardPage from "./pages/Dashboard/AdminDashboardPage";

// Admin Components
import UserManagement from "./components/Admin/UserManagement";

// Components
import Layout from "./components/Layout/Layout";
import ChatbotWidget from "./components/UI/ChatbotWidget";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  useEffect(() => {
    // Check for saved theme preference or use system preference
    const isDarkMode =
      localStorage.getItem("darkMode") === "true" ||
      (!("darkMode" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="app min-h-screen bg-beige-light dark:bg-brown text-brown-dark dark:text-beige-light transition-colors duration-500">
      <AuthProvider>
        <BrowserRouter>
          {/* Public Routes */}
          <Routes>
            {/* Main Website Routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/properties" element={<Layout><PropertiesPage /></Layout>} />
            <Route path="/properties/:id" element={<Layout><PropertyDetailPage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
            <Route path="/blog/:id" element={<Layout><BlogPostPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                {({ profile }) =>
                  profile?.role === 'admin' ? <AdminDashboardPage /> : <DashboardHomePage />
                }
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/dashboard/properties" element={
              <ProtectedRoute allowedRoles={['admin', 'agent']}>
                <DashboardHomePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/agents" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardHomePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/clients" element={
              <ProtectedRoute allowedRoles={['admin', 'agent']}>
                <DashboardHomePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/analytics" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardHomePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardHomePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/user-management" element={
              <ProtectedRoute allowedRoles={['admin']}>
                {({ profile }) => <UserManagement currentUser={profile} />}
              </ProtectedRoute>
            } />

            {/* Agent Routes */}
            <Route path="/dashboard/appointments" element={
              <ProtectedRoute allowedRoles={['admin', 'agent', 'client']}>
                <DashboardHomePage />
              </ProtectedRoute>
            } />

            {/* Client Routes */}
            <Route path="/dashboard/saved-properties" element={
              <ProtectedRoute allowedRoles={['client']}>
                <DashboardHomePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/documents" element={
              <ProtectedRoute allowedRoles={['client']}>
                <DashboardHomePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/applications" element={
              <ProtectedRoute allowedRoles={['client']}>
                <DashboardHomePage />
              </ProtectedRoute>
            } />

            {/* Common Routes */}
            <Route path="/dashboard/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/messages" element={
              <ProtectedRoute>
                <DashboardHomePage />
              </ProtectedRoute>
            } />
          </Routes>
          <ChatbotWidget />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
