// src/lib/adminOperations.js
import { supabase } from './supabase';

/**
 * Updates a user's role using the secure Edge Function
 * @param {string} targetUserId - The ID of the user to update
 * @param {string} newRole - The new role to assign ('admin', 'agent', or 'client')
 * @returns {Promise<Object>} - The result of the operation
 */
export async function updateUserRole(targetUserId, newRole) {
  try {
    // First, get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }
    
    // Call the secure Edge Function with the user's access token
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-operations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'updateRole',
          targetUserId,
          newRole
        })
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update user role');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * Gets detailed information about a user using the secure Edge Function
 * @param {string} targetUserId - The ID of the user to get information about
 * @returns {Promise<Object>} - The user information
 */
export async function getUserInfo(targetUserId) {
  try {
    // First, get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }
    
    // Call the secure Edge Function with the user's access token
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-operations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'getUserInfo',
          targetUserId
        })
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get user information');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user information:', error);
    throw error;
  }
}

/**
 * Checks if the current user has admin privileges
 * @returns {Promise<boolean>} - Whether the user has admin privileges
 */
export async function checkAdminPrivileges() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    return profile?.role === 'admin' || profile?.role === 'superadmin';
  } catch (error) {
    console.error('Error checking admin privileges:', error);
    return false;
  }
}
