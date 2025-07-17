import { supabase } from './supabase';

/**
 * Geocoding utility to get coordinates from address
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 * @param {string} address - The address to geocode
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
const geocodeAddress = async (address) => {
  if (!address || address.trim() === '') {
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address.trim());
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon)
      };
    }

    return null;
  } catch (error) {
    console.warn('Geocoding failed:', error);
    return null;
  }
};

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
      property_id: id
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
    // Call the create_property RPC function with agent contact information
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
      p_feature_ids: property.features || [],
      p_latitude: property.latitude ? (isNaN(parseFloat(property.latitude)) ? null : parseFloat(property.latitude)) : null,
      p_longitude: property.longitude ? (isNaN(parseFloat(property.longitude)) ? null : parseFloat(property.longitude)) : null,
      // Agent contact information
      p_agent_name: property.agentName || 'UrbanEdge Agent',
      p_agent_email: property.agentEmail || 'contact@urbanedge.com',
      p_agent_phone: property.agentPhone?.trim() || null,
      p_agent_whatsapp_link: property.agentWhatsappLink?.trim() || null
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
    // Prepare fields to update - only include non-empty values
    const fieldsToUpdate = {};

    if (property.title) fieldsToUpdate.title = property.title;
    if (property.location) fieldsToUpdate.location = property.location;
    if (property.price !== undefined && property.price !== null) fieldsToUpdate.price = property.price;
    if (property.bedrooms !== undefined && property.bedrooms !== null) fieldsToUpdate.bedrooms = property.bedrooms;
    if (property.bathrooms !== undefined && property.bathrooms !== null) fieldsToUpdate.bathrooms = property.bathrooms;
    if (property.squareFeet !== undefined && property.squareFeet !== null) fieldsToUpdate.square_feet = property.squareFeet;
    if (property.description) fieldsToUpdate.description = property.description;
    if (property.floorPlanUrl) fieldsToUpdate.floor_plan_url = property.floorPlanUrl;
    if (property.neighborhood) fieldsToUpdate.neighborhood = property.neighborhood;
    if (property.propertyTypeId && property.propertyTypeId.trim()) fieldsToUpdate.property_type_id = property.propertyTypeId.trim();
    if (property.saleTypeId && property.saleTypeId.trim()) fieldsToUpdate.sale_type_id = property.saleTypeId.trim();
    if (property.latitude !== undefined && property.latitude !== null && property.latitude !== '') {
      const lat = parseFloat(property.latitude);
      if (!isNaN(lat)) {
        fieldsToUpdate.latitude = lat;
      }
    }
    if (property.longitude !== undefined && property.longitude !== null && property.longitude !== '') {
      const lng = parseFloat(property.longitude);
      if (!isNaN(lng)) {
        fieldsToUpdate.longitude = lng;
      }
    }

    // Agent contact information
    if (property.agentName) fieldsToUpdate.agent_name = property.agentName;
    if (property.agentEmail) fieldsToUpdate.agent_email = property.agentEmail;
    if (property.agentPhone !== undefined) fieldsToUpdate.agent_phone = property.agentPhone?.trim() || null;
    if (property.agentWhatsappLink !== undefined) fieldsToUpdate.agent_whatsapp_link = property.agentWhatsappLink?.trim() || null;

    // Always update the timestamp
    fieldsToUpdate.updated_at = new Date().toISOString();

    console.log('PropertyService: Updating property', id, 'with fields:', fieldsToUpdate);
    console.log('PropertyService: Coordinate types:', {
      latitude: typeof fieldsToUpdate.latitude,
      longitude: typeof fieldsToUpdate.longitude,
      latValue: fieldsToUpdate.latitude,
      lngValue: fieldsToUpdate.longitude
    });

    // Call the update_property RPC function
    const { data, error } = await supabase.rpc('update_property', {
      p_property_id: id,
      fields_to_update: fieldsToUpdate,
      feature_ids: property.features || null
    });

    if (error) {
      console.error('PropertyService: Update error:', error);
      return { data: null, error };
    }

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

  /**
   * Geocode an address to get coordinates
   * @param {string} address - The address to geocode
   * @returns {Promise<{latitude: number, longitude: number} | null>}
   */
  async geocodeAddress(address) {
    return await geocodeAddress(address);
  },

  /**
   * Get properties within a specific map bounds
   * @param {Object} bounds - Map bounds {north, south, east, west}
   * @param {Object} filters - Additional filters
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getPropertiesInBounds(bounds, filters = {}) {
    const params = {
      ...filters,
      north_lat: bounds.north,
      south_lat: bounds.south,
      east_lng: bounds.east,
      west_lng: bounds.west,
      limit_val: filters.limit || 100,
      offset_val: filters.offset || 0
    };

    const { data, error } = await supabase.rpc('get_properties_in_bounds', params);

    if (error) {
      console.error('Error fetching properties in bounds:', error);
      return { data: null, error };
    }

    return { data, error: null };
  },

  /**
   * Get the 4 most recent properties for the client dashboard
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getRecentProperties() {
    try {
      const { data, error } = await supabase.rpc('get_recent_properties');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching recent properties:', error);
      return { data: null, error };
    }
  },
};