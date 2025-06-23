import { supabase } from './supabase';

/**
 * Service for handling user-related database operations
 */
export const userService = {
  /**
   * Get the current user's profile
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { data: null, error: new Error('No user found') };
    
    // Get additional user data from the profiles table if needed
    // This is where you would fetch any custom user data beyond what auth provides
    
    return { data: user, error: null };
  },
  
  /**
   * Update the current user's profile
   * @param {Object} updates - The profile updates
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async updateProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { data: null, error: new Error('No user found') };
    
    // Update user metadata
    return await supabase.auth.updateUser({
      data: updates
    });
  },
  
  /**
   * Check if the current user is an admin
   * @returns {Promise<boolean>}
   */
  async isAdmin() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    // Check if user has admin flag in metadata - check both locations
    return user.user_metadata?.is_admin === true || user.raw_user_meta_data?.is_admin === true;
  },
  
  /**
   * Get all users (admin only)
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getAllUsers() {
    try {
      // Use the get_all_users RPC function which is protected by admin checks
      const { data, error } = await supabase.rpc('get_all_users');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Set a user's admin status (admin only)
   * @param {string} userId - The user ID
   * @param {boolean} isAdmin - Whether the user should be an admin
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async setUserAdminStatus(userId, isAdmin) {
    try {
      // Use the set_user_admin_status RPC function which is protected by admin checks
      const { data, error } = await supabase.rpc('set_user_admin_status', {
        p_user_id: userId,
        p_is_admin: isAdmin
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error setting user admin status:', error);
      return { data: null, error };
    }
  }
};