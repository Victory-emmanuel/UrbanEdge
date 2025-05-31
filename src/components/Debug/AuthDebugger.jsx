import { useState, useEffect } from 'react';
import { supabase, getCurrentUser, getUserProfile } from '../../lib/supabase';

const AuthDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({
    session: null,
    user: null,
    profile: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(`Session error: ${sessionError.message}`);
        }
        
        // Get current user
        let userData = null;
        let profileData = null;
        
        if (sessionData?.session) {
          const { user, error: userError } = await getCurrentUser();
          
          if (userError) {
            throw new Error(`User error: ${userError.message}`);
          }
          
          userData = user;
          
          // Get user profile
          if (user) {
            const { data: profile, error: profileError } = await getUserProfile(user.id);
            
            if (profileError) {
              throw new Error(`Profile error: ${profileError.message}`);
            }
            
            profileData = profile;
          }
        }
        
        setDebugInfo({
          session: sessionData?.session,
          user: userData,
          profile: profileData,
          error: null,
          loading: false
        });
      } catch (error) {
        console.error('Auth debug error:', error);
        setDebugInfo(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }));
      }
    };
    
    checkAuth();
  }, []);

  return (
    <div className="bg-white dark:bg-brown-dark rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-heading font-bold text-brown-dark dark:text-beige-light mb-4">
        Auth Debugger
      </h2>
      
      {debugInfo.loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-beige-medium dark:bg-brown rounded w-3/4"></div>
          <div className="h-4 bg-beige-medium dark:bg-brown rounded w-1/2"></div>
          <div className="h-4 bg-beige-medium dark:bg-brown rounded w-5/6"></div>
        </div>
      ) : debugInfo.error ? (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{debugInfo.error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="font-medium text-brown-dark dark:text-beige-light">Session:</p>
            <pre className="bg-beige-light dark:bg-brown p-2 rounded-md text-xs overflow-auto max-h-40">
              {JSON.stringify(debugInfo.session, null, 2)}
            </pre>
          </div>
          
          <div>
            <p className="font-medium text-brown-dark dark:text-beige-light">User:</p>
            <pre className="bg-beige-light dark:bg-brown p-2 rounded-md text-xs overflow-auto max-h-40">
              {JSON.stringify(debugInfo.user, null, 2)}
            </pre>
          </div>
          
          <div>
            <p className="font-medium text-brown-dark dark:text-beige-light">Profile:</p>
            <pre className="bg-beige-light dark:bg-brown p-2 rounded-md text-xs overflow-auto max-h-40">
              {JSON.stringify(debugInfo.profile, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebugger;
