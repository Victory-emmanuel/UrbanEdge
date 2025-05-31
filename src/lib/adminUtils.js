import { supabase, supabaseAdmin } from './supabase';

/**
 * Checks if a user has admin privileges
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} - True if the user is an admin, false otherwise
 */
export const checkAdminPrivileges = async (userId) => {
  try {
    if (!userId) {
      console.error("No user ID provided to checkAdminPrivileges");
      return false;
    }

    console.log("Checking admin privileges for user:", userId);

    // Try with SQL function first (most reliable)
    if (supabaseAdmin) {
      try {
        console.log("Checking admin status with SQL function");
        const { data: sqlData, error: sqlError } = await supabaseAdmin.rpc('is_user_admin', {
          user_id: userId
        });

        if (!sqlError) {
          console.log("User admin status (SQL function):", sqlData);
          return sqlData;
        }

        console.error("Error checking admin privileges with SQL function:", sqlError);
      } catch (sqlErr) {
        console.error("Exception with SQL function:", sqlErr);
      }
    }

    // Try with admin client
    if (supabaseAdmin) {
      try {
        console.log("Checking admin status with admin client");
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (!error && data) {
          const isAdmin = data.role === 'admin';
          console.log("User admin status (admin client):", isAdmin);
          return isAdmin;
        }

        console.error("Error checking admin privileges with admin client:", error);
      } catch (adminErr) {
        console.error("Exception with admin client:", adminErr);
      }
    }

    // Fallback to regular client
    try {
      console.log("Checking admin status with regular client");
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const isAdmin = data.role === 'admin';
        console.log("User admin status (regular client):", isAdmin);
        return isAdmin;
      }

      console.error("Error checking admin privileges with regular client:", error);
    } catch (regularErr) {
      console.error("Exception with regular client:", regularErr);
    }

    // If all methods fail
    console.error("All methods to check admin status failed");
    throw new Error("Failed to verify admin status. Please try again later.");
  } catch (err) {
    console.error("Unexpected error in checkAdminPrivileges:", err);
    throw err;
  }
};

/**
 * Redirects non-admin users away from admin pages
 * @param {object} user - The current user object
 * @param {function} navigate - React Router's navigate function
 * @returns {Promise<boolean>} - True if the user is an admin, false otherwise
 */
export const enforceAdminAccess = async (user, navigate) => {
  if (!user) {
    console.log("No user found, redirecting to login");
    navigate('/admin-login');
    return false;
  }

  try {
    const isAdmin = await checkAdminPrivileges(user.id);

    if (!isAdmin) {
      console.log("User is not an admin, redirecting to unauthorized page");
      navigate('/unauthorized');
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in enforceAdminAccess:", error);

    if (error.message && error.message.includes("Service role key not available")) {
      console.error("Service role key issue detected, redirecting to admin login");
      // Sign out the user to force a clean login attempt
      const { supabase } = await import('./supabase');
      await supabase.auth.signOut();
      navigate('/admin-login', {
        state: {
          error: "Admin verification failed: Service role key not available. Please contact the system administrator."
        }
      });
    } else {
      navigate('/unauthorized');
    }

    return false;
  }
};
