import { supabase } from './supabase';

/**
 * Service for handling property-related database operations
 */
export const propertyService = {
  /**
   * Fetch properties with optional filtering using the filter_properties RPC function
   * @param {Object} filters - Optional filters for the query
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getProperties(filters = {}) {
    // Map frontend filter names to backend parameter names
    const params = {
      location: filters.location || null,
      min_price: filters.minPrice || null,
      max_price: filters.maxPrice || null,
      min_bedrooms: filters.minBedrooms || null,
      max_bedrooms: filters.maxBedrooms || null,
      min_bathrooms: filters.minBathrooms || null,
      max_bathrooms: filters.maxBathrooms || null,
      property_type_ids: filters.propertyType ? [filters.propertyType] : null,
      feature_ids: filters.features || null,
      sale_type_id: filters.saleType || null,
      limit_val: filters.limit || 20,
      offset_val: filters.offset || 0,
      sort_by: filters.sortBy || 'newest'
    };

    // Call the filter_properties RPC function
    const { data, error } = await supabase.rpc('filter_properties', params);

    if (error) {
      console.error('Error fetching properties:', error);
      return { data: null, error };
    }

    return { 
      data: data.properties, 
      totalCount: data.total_count,
      limit: data.limit,
      offset: data.offset,
      error: null 
    };
  },

  /**
   * Fetch a single property by ID using the get_property_details RPC function
   * @param {string} id - Property ID
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async getPropertyById(id) {
    const { data, error } = await supabase.rpc('get_property_details', {
      p_property_id: id
    });

    if (error) {
      console.error('Error fetching property details:', error);
      return { data: null, error };
    }

    // Check if the response contains an error message
    if (data && data.error) {
      return { data: null, error: { message: data.error } };
    }

    return { data, error: null };
  },

  /**
   * Get all filter options (property types, sale types, features)
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async getFilterOptions() {
    const { data, error } = await supabase.rpc('get_filter_options');

    if (error) {
      console.error('Error fetching filter options:', error);
      return { data: null, error };
    }

    return { data, error: null };
  },

  /**
   * Create a new property using the RPC function
   * @param {Object} property - Property data
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async createProperty(property) {
    // Call the create_property RPC function
    const { data, error } = await supabase.rpc('create_property', {
      p_title: property.title,
      p_location: property.location,
      p_price: property.price,
      p_bedrooms: property.bedrooms,
      p_bathrooms: property.bathrooms,
      p_square_feet: property.squareFeet,
      p_property_type_id: property.propertyTypeId,
      p_sale_type_id: property.saleTypeId,
      p_description: property.description,
      p_floor_plan_url: property.floorPlanUrl,
      p_neighborhood: property.neighborhood,
      p_feature_ids: property.features || []
    });

    if (error) return { data: null, error };

    // Handle images if provided
    if (property.images && property.images.length > 0) {
      const propertyId = data.id;
      const imagePromises = property.images.map((image, index) => {
        return supabase.rpc('add_property_image', {
          p_property_id: propertyId,
          p_image_url: image.url,
          p_image_order: index
        });
      });

      const imageResults = await Promise.all(imagePromises);
      const imageErrors = imageResults.filter(result => result.error);

      if (imageErrors.length > 0) {
        return { data, error: imageErrors[0].error };
      }
    }

    return { data, error: null };
  },

  /**
   * Update an existing property using the RPC function
   * @param {string} id - Property ID
   * @param {Object} property - Updated property data
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async updateProperty(id, property) {
    // Prepare fields to update
    const fieldsToUpdate = {
      title: property.title,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      square_feet: property.squareFeet,
      description: property.description,
      floor_plan_url: property.floorPlanUrl,
      neighborhood: property.neighborhood,
      property_type_id: property.propertyTypeId,
      sale_type_id: property.saleTypeId,
      updated_at: new Date()
    };

    // Call the update_property RPC function
    const { data, error } = await supabase.rpc('update_property', {
      property_id: id,
      fields_to_update: fieldsToUpdate,
      feature_ids: property.features || null
    });

    if (error) return { data: null, error };

    // Handle images if provided
    if (property.images) {
      // First delete existing images
      const { data: existingImages } = await supabase
        .from('property_images')
        .select('id')
        .eq('property_id', id);

      if (existingImages && existingImages.length > 0) {
        const deletePromises = existingImages.map(img => {
          return supabase.rpc('delete_property_image', {
            image_id: img.id
          });
        });

        await Promise.all(deletePromises);
      }

      // Then add new images
      if (property.images.length > 0) {
        const imagePromises = property.images.map((image, index) => {
          return supabase.rpc('add_property_image', {
            p_property_id: id,
            p_image_url: image.url,
            p_image_order: index
          });
        });

        const imageResults = await Promise.all(imagePromises);
        const imageErrors = imageResults.filter(result => result.error);

        if (imageErrors.length > 0) {
          return { data, error: imageErrors[0].error };
        }
      }
    }

    return { data, error: null };
  },

  /**
   * Delete a property using the RPC function
   * @param {string} id - Property ID
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async deleteProperty(id) {
    return await supabase.rpc('delete_property', {
      property_id: id
    });
  },

  /**
   * Fetch all property types
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getPropertyTypes() {
    const { data, error } = await supabase.rpc('get_filter_options');
    if (error) return { data: null, error };
    return { data: data.property_types, error: null };
  },

  /**
   * Fetch all sale types
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getSaleTypes() {
    const { data, error } = await supabase.rpc('get_filter_options');
    if (error) return { data: null, error };
    return { data: data.sale_types, error: null };
  },

  /**
   * Fetch all features
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getFeatures() {
    const { data, error } = await supabase.rpc('get_filter_options');
    if (error) return { data: null, error };
    return { data: data.features, error: null };
  },
};