// src/components/Admin/UserManagement.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserRole, getUserInfo, checkAdminPrivileges } from '../../lib/adminOperations';
import { ShieldCheckIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function UserManagement({ currentUser }) {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Check if the current user has admin privileges
  useEffect(() => {
    async function checkAdmin() {
      // If we already have the currentUser prop with role, use that
      if (currentUser?.role === 'admin') {
        setIsAdmin(true);
        return;
      }

      // Otherwise check via the API
      const hasAdminPrivileges = await checkAdminPrivileges();
      setIsAdmin(hasAdminPrivileges);

      if (!hasAdminPrivileges) {
        setError('You do not have permission to access this page');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    }

    checkAdmin();
  }, [navigate, currentUser]);

  // Fetch user information when the component mounts
  useEffect(() => {
    if (isAdmin) {
      fetchUserInfo();
    }
  }, [isAdmin]);

  const fetchUserInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      // The specific user ID you want to get information about
      const targetUserId = 'd26a7dcb-0150-4caa-91af-becb1bae5811';

      const { data } = await getUserInfo(targetUserId);
      setUserInfo(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (role) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // The specific user ID you want to update
      const targetUserId = 'd26a7dcb-0150-4caa-91af-becb1bae5811';

      const result = await updateUserRole(targetUserId, role);
      setSuccess(result.message);

      // Refresh user info
      fetchUserInfo();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6 bg-white dark:bg-brown-dark rounded-lg shadow-md">
        <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
          <ExclamationCircleIcon className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-heading">Access Denied</h2>
        </div>
        <p className="text-brown dark:text-beige-medium">
          You do not have permission to access this page. Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-brown-dark rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ShieldCheckIcon className="h-8 w-8 text-taupe mr-3" />
          <h2 className="text-2xl font-heading text-brown-dark dark:text-beige-light">User Management</h2>
        </div>

        {/* Debug info */}
        <div className="text-xs bg-beige-light dark:bg-brown p-2 rounded">
          <p>Current User: {currentUser?.id}</p>
          <p>Role: {currentUser?.role}</p>
          <p>isAdmin: {isAdmin ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-md mb-6 flex items-start">
          <ExclamationCircleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-md mb-6 flex items-start">
          <CheckCircleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {loading && !userInfo ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-beige-medium dark:bg-brown rounded w-3/4"></div>
          <div className="h-4 bg-beige-medium dark:bg-brown rounded w-1/2"></div>
          <div className="h-4 bg-beige-medium dark:bg-brown rounded w-5/6"></div>
        </div>
      ) : userInfo ? (
        <div className="mb-8">
          <div className="bg-beige-light dark:bg-brown p-4 rounded-md mb-6">
            <h3 className="font-heading text-lg text-brown-dark dark:text-beige-light mb-2">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brown dark:text-beige-medium">User ID:</p>
                <p className="font-mono text-xs bg-white dark:bg-brown-dark p-2 rounded overflow-x-auto">
                  {userInfo.profile.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-brown dark:text-beige-medium">Email:</p>
                <p className="font-medium">{userInfo.auth.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-brown dark:text-beige-medium">Name:</p>
                <p className="font-medium">{userInfo.profile.first_name} {userInfo.profile.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-brown dark:text-beige-medium">Current Role:</p>
                <p className="inline-block px-2 py-1 bg-taupe text-white text-sm rounded-full">
                  {userInfo.profile.role}
                </p>
              </div>
            </div>
          </div>

          <h3 className="font-heading text-lg text-brown-dark dark:text-beige-light mb-4">Change User Role</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handlePromoteUser('admin')}
              disabled={loading || userInfo.profile.role === 'admin'}
              className={`px-4 py-2 rounded-md ${
                userInfo.profile.role === 'admin'
                  ? 'bg-beige-medium dark:bg-brown text-brown-dark dark:text-beige-light cursor-not-allowed'
                  : 'bg-taupe text-white hover:bg-brown-dark'
              }`}
            >
              {userInfo.profile.role === 'admin' ? 'Current Role' : 'Promote to Admin'}
            </button>

            <button
              onClick={() => handlePromoteUser('agent')}
              disabled={loading || userInfo.profile.role === 'agent'}
              className={`px-4 py-2 rounded-md ${
                userInfo.profile.role === 'agent'
                  ? 'bg-beige-medium dark:bg-brown text-brown-dark dark:text-beige-light cursor-not-allowed'
                  : 'bg-taupe text-white hover:bg-brown-dark'
              }`}
            >
              {userInfo.profile.role === 'agent' ? 'Current Role' : 'Set as Agent'}
            </button>

            <button
              onClick={() => handlePromoteUser('client')}
              disabled={loading || userInfo.profile.role === 'client'}
              className={`px-4 py-2 rounded-md ${
                userInfo.profile.role === 'client'
                  ? 'bg-beige-medium dark:bg-brown text-brown-dark dark:text-beige-light cursor-not-allowed'
                  : 'bg-taupe text-white hover:bg-brown-dark'
              }`}
            >
              {userInfo.profile.role === 'client' ? 'Current Role' : 'Set as Client'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-brown dark:text-beige-medium">Failed to load user information.</p>
      )}

      <div className="mt-6 p-4 border border-beige-medium dark:border-brown rounded-md bg-beige-light/50 dark:bg-brown/50">
        <h3 className="font-heading text-lg text-brown-dark dark:text-beige-light mb-2">Security Note</h3>
        <p className="text-brown dark:text-beige-medium text-sm mb-2">
          This admin operation is being performed securely through a Supabase Edge Function. The service role key is never exposed to the client.
        </p>
        <p className="text-brown dark:text-beige-medium text-sm">
          All actions are logged and require proper authentication and authorization.
        </p>
      </div>
    </div>
  );
}
