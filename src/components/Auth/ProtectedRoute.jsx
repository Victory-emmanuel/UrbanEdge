import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { checkAdminPrivileges } from '../../lib/adminUtils';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, profile, user } = useAuth();
  const location = useLocation();
  const [roleVerified, setRoleVerified] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);

  // Verify role permissions
  useEffect(() => {
    const verifyRole = async () => {
      // If no roles are required or we're still loading, skip verification
      if (allowedRoles.length === 0 || loading || !isAuthenticated) {
        setRoleVerified(true);
        setHasRequiredRole(true);
        return;
      }

      try {
        // If admin role is required, do a direct database check
        if (allowedRoles.includes('admin')) {
          console.log("Admin role required, performing direct check");
          const isAdmin = await checkAdminPrivileges(user?.id);
          setHasRequiredRole(isAdmin);
        } else {
          // Otherwise use the profile role from context
          setHasRequiredRole(allowedRoles.includes(profile?.role));
        }
      } catch (err) {
        console.error("Error verifying role:", err);
        setHasRequiredRole(false);
      } finally {
        setRoleVerified(true);
      }
    };

    verifyRole();
  }, [allowedRoles, loading, isAuthenticated, profile, user]);

  // Show loading state while checking authentication or role
  if (loading || !roleVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-beige-light dark:bg-brown">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-taupe"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // If trying to access admin routes, redirect to admin login
    if (allowedRoles.includes('admin')) {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user doesn't have the required role, redirect to unauthorized
  if (allowedRoles.length > 0 && !hasRequiredRole) {
    console.log("User does not have required role. Required:", allowedRoles, "User role:", profile?.role);
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and has the required role, render the children
  // Support both function as children (render prop) and regular children
  if (typeof children === 'function') {
    return children({ profile, isAuthenticated });
  }

  return children;
};

export default ProtectedRoute;
