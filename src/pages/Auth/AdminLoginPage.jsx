import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { signIn, supabase } from '../../lib/supabase';
import { checkAdminPrivileges } from '../../lib/adminUtils';
import { useAuth } from '../../contexts/AuthContext';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toggleRememberMe, rememberMe } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in and is an admin
  useEffect(() => {
    // Check for error state from navigation
    if (location.state?.error) {
      console.log("Error state from navigation:", location.state.error);
      setError(location.state.error);
      // Clear the error from location state to prevent it from persisting on refresh
      navigate(location.pathname, { replace: true });
      return;
    }

    const checkAdminStatus = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          console.log("Found existing session, checking if user is admin");

          // Use our utility function to check admin status
          const isAdmin = await checkAdminPrivileges(session.user.id);

          if (isAdmin) {
            console.log("User is already logged in as admin, redirecting to dashboard");
            // Already logged in as admin, redirect to dashboard
            navigate('/dashboard', { replace: true });
          } else {
            console.log("User is logged in but not an admin, signing out");
            // User is logged in but not an admin, sign them out
            await supabase.auth.signOut();
          }
        } else {
          console.log("No active session found, showing admin login form");
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        if (err.message && err.message.includes("Service role key not available")) {
          setError("Admin verification failed: Service role key not available. Please contact the system administrator.");
        }
      }
    };

    checkAdminStatus();
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Attempting admin login for:", email);

      // First sign out any existing session to ensure a clean login
      await supabase.auth.signOut();

      // Pass true as the third parameter to check for admin role
      const { data, error } = await signIn(email, password, true);

      if (error) {
        console.error("Admin login error:", error);
        throw error;
      }

      console.log("Admin login successful, redirecting to dashboard");
      // If we get here, the user is authenticated as an admin
      // Redirect to admin dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error signing in:', error);

      // Handle specific error types
      if (error.message && error.message.includes('infinite recursion')) {
        setError('Failed to verify admin status: Infinite recursion detected in policy for relation "profiles"');
      } else if (error.message && error.message.includes('Failed to verify admin status')) {
        setError(error.message);
      } else if (error.message && error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(error.message || 'An error occurred during sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | UrbanEdge Real Estate</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-beige-light dark:bg-brown py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white dark:bg-brown-dark rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <ShieldCheckIcon className="h-16 w-16 text-taupe" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-brown-dark dark:text-beige-light">
              Admin Portal
            </h1>
            <p className="mt-2 text-brown dark:text-beige-medium">
              Sign in to access the UrbanEdge admin dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
              <p className="font-medium mb-1">Error:</p>
              <p>{error}</p>
              {error.includes('infinite recursion') && (
                <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                  <p className="font-medium">Troubleshooting:</p>
                  <ul className="list-disc list-inside mt-1 text-xs">
                    <li>Database policy error detected</li>
                    <li>Please contact the system administrator</li>
                    <li>Error code: RLS-RECURSION-500</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-brown dark:text-beige-medium" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-brown-dark dark:text-beige-light">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-taupe hover:text-brown dark:hover:text-beige-light transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-brown dark:text-beige-medium" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-brown dark:text-beige-medium" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-brown dark:text-beige-medium" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => toggleRememberMe(e.target.checked)}
                className="h-4 w-4 text-taupe focus:ring-taupe border-taupe rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-brown-dark dark:text-beige-light">
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`btn-primary w-full flex items-center justify-center ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in as Admin"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-taupe hover:text-brown dark:hover:text-beige-light transition-colors">
              Return to regular login
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-beige-medium dark:border-brown">
            <p className="text-center text-xs text-brown dark:text-beige-medium">
              This portal is restricted to authorized administrators only. Unauthorized access attempts may be logged and reported.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLoginPage;
