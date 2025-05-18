import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const UnauthorizedPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Helmet>
        <title>Unauthorized | UrbanEdge Real Estate</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-beige-light dark:bg-brown py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white dark:bg-brown-dark rounded-lg shadow-lg p-8 text-center"
        >
          <div className="flex justify-center mb-6">
            <ShieldExclamationIcon className="h-20 w-20 text-taupe" />
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-brown-dark dark:text-beige-light mb-4">
            Access Denied
          </h1>
          
          <p className="text-brown dark:text-beige-medium mb-8">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="space-y-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary block"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="btn-primary block"
              >
                Sign In
              </Link>
            )}
            
            <Link
              to="/"
              className="btn-outline block"
            >
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
