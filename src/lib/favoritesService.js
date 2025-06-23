import { supabase } from './supabase';

/**
 * Service for handling user favorites operations
 */
export const favoritesService = {
  /**
   * Add a property to user's favorites
   * @param {string} propertyId - The property ID to add to favorites
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async addToFavorites(propertyId) {
    try {
      console.log('addToFavorites called with propertyId:', propertyId);
      console.log('Property ID type:', typeof propertyId);

      const { data, error } = await supabase.rpc('add_to_favorites', {
        property_id: propertyId
      });

      console.log('add_to_favorites RPC response:', { data, error });

      if (error) {
        console.error('RPC error in addToFavorites:', error);
        throw error;
      }

      // Check if the function returned an error in the data
      if (data && data.success === false) {
        console.error('Function returned error:', data.message);
        return { data: null, error: new Error(data.message) };
      }

      console.log('Successfully added to favorites:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { data: null, error };
    }
  },

  /**
   * Remove a property from user's favorites
   * @param {string} propertyId - The property ID to remove from favorites
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async removeFromFavorites(propertyId) {
    try {
      const { data, error } = await supabase.rpc('remove_from_favorites', {
        property_id: propertyId
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all user's favorite properties
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getUserFavorites() {
    try {
      console.log('Calling get_user_favorites RPC function...');

      // First try the basic test function to see if RPC works at all
      const basicTest = await supabase.rpc('test_rpc_basic');
      console.log('Basic RPC test result:', basicTest);

      // Then try the auth test function
      const testResult = await supabase.rpc('test_favorites_connection');
      console.log('Auth test connection result:', testResult);

      const { data, error } = await supabase.rpc('get_user_favorites');

      console.log('RPC response:', { data, error });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      // Handle the response based on the function structure
      if (data && typeof data === 'object') {
        if (data.success === false) {
          console.log('Function returned error:', data.message);
          return { data: [], error: null }; // Return empty array for unauthenticated users
        }

        // Extract the data array from the response
        const favorites = data?.data || [];
        console.log('Extracted favorites:', favorites);
        return { data: favorites, error: null };
      }

      // If data is null or unexpected format
      console.log('Unexpected data format:', data);
      return { data: [], error: null };
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return { data: [], error };
    }
  },

  /**
   * Check if a property is favorited by the current user
   * @param {string} propertyId - The property ID to check
   * @returns {Promise<{data: boolean, error: Object}>}
   */
  async isPropertyFavorited(propertyId) {
    try {
      const { data, error } = await supabase.rpc('is_property_favorited', {
        property_id: propertyId
      });

      if (error) throw error;

      return { data: data?.is_favorited || false, error: null };
    } catch (error) {
      console.error('Error checking if property is favorited:', error);
      return { data: false, error };
    }
  },

  /**
   * Toggle favorite status for a property
   * @param {string} propertyId - The property ID to toggle
   * @param {boolean} currentStatus - Current favorite status
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async toggleFavorite(propertyId, currentStatus) {
    try {
      console.log('toggleFavorite called with:', { propertyId, currentStatus });

      if (currentStatus) {
        console.log('Removing from favorites...');
        const result = await this.removeFromFavorites(propertyId);
        console.log('Remove result:', result);
        return result;
      } else {
        console.log('Adding to favorites...');
        const result = await this.addToFavorites(propertyId);
        console.log('Add result:', result);
        return result;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { data: null, error };
    }
  },

  /**
   * Get favorite properties count for the current user
   * @returns {Promise<{data: number, error: Object}>}
   */
  async getFavoritesCount() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      console.log('Current user for count:', user?.id);

      if (!user) {
        console.log('No user found, returning 0 count');
        return { data: 0, error: null };
      }

      // Use the get_user_favorites function and count the results
      console.log('Calling get_user_favorites for count...');
      const { data, error } = await supabase.rpc('get_user_favorites');

      console.log('Count RPC response:', { data, error });

      if (error) {
        console.error('Count RPC error:', error);
        throw error;
      }

      // Handle the response based on the function structure
      if (data && typeof data === 'object') {
        if (data.success === false) {
          console.log('Function returned error for count:', data.message);
          return { data: 0, error: null }; // Return 0 for unauthenticated users
        }

        const favorites = data?.data || [];
        console.log('Favorites count:', favorites.length);
        return { data: favorites.length, error: null };
      }

      // If data is null or unexpected format
      console.log('Unexpected data format for count:', data);
      return { data: 0, error: null };
    } catch (error) {
      console.error('Error getting favorites count:', error);
      return { data: 0, error };
    }
  },

  /**
   * Get multiple properties' favorite status for the current user
   * @param {Array<string>} propertyIds - Array of property IDs to check
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async getMultipleFavoriteStatus(propertyIds) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !propertyIds.length) {
        return { data: {}, error: null };
      }

      // Use the get_user_favorites function to get all favorites
      const { data, error } = await supabase.rpc('get_user_favorites');

      if (error) throw error;

      const favorites = data?.data || [];

      // Convert to object with property_id as key and boolean as value
      const favoriteStatus = {};
      propertyIds.forEach(id => {
        favoriteStatus[id] = favorites.some(fav => fav.id === id);
      });

      return { data: favoriteStatus, error: null };
    } catch (error) {
      console.error('Error getting multiple favorite status:', error);
      return { data: {}, error };
    }
  },

  /**
   * Test function to manually test adding a favorite with a known property ID
   * @param {string} propertyId - Optional property ID, uses a default if not provided
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async testAddFavorite(propertyId = 'ca604129-0429-4ec0-956d-4a72a237da87') {
    console.log('=== TESTING ADD FAVORITE ===');
    console.log('Using property ID:', propertyId);

    try {
      // First check current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);

      if (!user) {
        console.log('No user logged in');
        return { data: null, error: new Error('No user logged in') };
      }

      // Test the add function
      const result = await this.addToFavorites(propertyId);
      console.log('Add favorite test result:', result);

      // Check if it was actually added
      const checkResult = await this.isPropertyFavorited(propertyId);
      console.log('Is property favorited check:', checkResult);

      // Get all favorites to see the current state
      const allFavorites = await this.getUserFavorites();
      console.log('All user favorites:', allFavorites);

      return result;
    } catch (error) {
      console.error('Error in test:', error);
      return { data: null, error };
    }
  }
};
