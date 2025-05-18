import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, getUserProfile } from '../lib/supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem('rememberMe') === 'true'
  );

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        console.log("Checking auth session...");
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          console.log("Session found:", session.user.id);
          const { user: currentUser } = await getCurrentUser();
          setUser(currentUser);

          if (currentUser) {
            console.log("Fetching user profile for:", currentUser.id);
            const { data: userProfile, error: profileError } = await getUserProfile(currentUser.id);

            if (profileError) {
              console.error("Error fetching profile:", profileError);
            } else if (userProfile) {
              console.log("Profile loaded:", userProfile.role);
              setProfile(userProfile);
            } else {
              console.warn("No profile found for user:", currentUser.id);
            }
          }
        } else {
          console.log("No active session found");
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);

        if (session) {
          console.log("New session established for:", session.user.id);
          const { user: currentUser } = await getCurrentUser();
          setUser(currentUser);

          if (currentUser) {
            console.log("Fetching updated profile for:", currentUser.id);
            const { data: userProfile, error: profileError } = await getUserProfile(currentUser.id);

            if (profileError) {
              console.error("Error fetching updated profile:", profileError);
            } else if (userProfile) {
              console.log("Updated profile loaded:", userProfile.role);
              setProfile(userProfile);
            } else {
              console.warn("No updated profile found for user:", currentUser.id);
            }
          }
        } else {
          console.log("Session ended, clearing user data");
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Toggle remember me
  const toggleRememberMe = (value) => {
    setRememberMe(value);
    localStorage.setItem('rememberMe', value);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return profile?.role === role;
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Get user's role
  const getRole = () => profile?.role || null;

  const value = {
    user,
    profile,
    loading,
    isAuthenticated,
    rememberMe,
    toggleRememberMe,
    hasRole,
    getRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
