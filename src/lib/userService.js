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
    
    // Check if user has admin flag in metadata
    return user.user_metadata?.is_admin === true;
  },
  
  /**
   * Get all users (admin only)
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getAllUsers() {
    // This requires admin privileges and should be protected by RLS
    const { data, error } = await supabase
      .from('auth.users')
      .select('*');
      
    return { data, error };
  },
  
  /**
   * Set a user's admin status (admin only)
   * @param {string} userId - The user ID
   * @param {boolean} isAdmin - Whether the user should be an admin
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async setUserAdminStatus(userId, isAdmin) {
    // This requires admin privileges and should be protected by RLS
    // In a real application, this would typically be done through a server function
    // as it requires higher privileges than the client should have
    
    // For demonstration purposes, we'll show how it might be structured
    const { data, error } = await supabase
      .rpc('set_user_admin_status', { 
        user_id: userId,
        is_admin: isAdmin 
      });
      
    return { data, error };
  }
};