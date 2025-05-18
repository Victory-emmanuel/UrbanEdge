import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase, updatePassword } from '../../lib/supabase';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hashPresent, setHashPresent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the URL contains a hash, which indicates a valid reset link
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setHashPresent(true);
    } else {
      setError('Invalid or expired password reset link. Please request a new one.');
    }
  }, []);

  const validateForm = () => {
    // Password must be at least 6 characters
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    // Passwords must match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await updatePassword(password);
      
      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.message || 'An error occurred while updating your password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | UrbanEdge Real Estate</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-beige-light dark:bg-brown py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white dark:bg-brown-dark rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-brown-dark dark:text-beige-light">
              Reset Your Password
            </h1>
            <p className="mt-2 text-brown dark:text-beige-medium">
              Enter your new password below
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
                <p>Your password has been successfully reset!</p>
                <p className="mt-2">You will be redirected to the login page shortly.</p>
              </div>
              
              <Link
                to="/login"
                className="mt-4 inline-block text-taupe hover:text-brown dark:hover:text-beige-light transition-colors"
              >
                Go to login
              </Link>
            </div>
          ) : (
            hashPresent && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-brown dark:text-beige-medium" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pl-10 pr-10"
                      placeholder="••••••••"
                      minLength={6}
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
                  <p className="mt-1 text-xs text-brown dark:text-beige-medium">
                    Must be at least 6 characters
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-brown dark:text-beige-medium" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input pl-10"
                      placeholder="••••••••"
                    />
                  </div>
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
                        Updating...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-taupe hover:text-brown dark:hover:text-beige-light transition-colors"
                  >
                    Back to login
                  </Link>
                </div>
              </form>
            )
          )}
          
          {!hashPresent && !success && (
            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                className="btn-outline inline-block"
              >
                Request New Reset Link
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
