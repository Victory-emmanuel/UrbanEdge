import { supabase } from './supabase';

/**
 * Service for handling property-related database operations
 */
export const propertyService = {
  /**
   * Fetch all properties with optional filtering
   * @param {Object} filters - Optional filters for the query
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getProperties(filters = {}) {
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_type:property_types(id, name),
        sale_type:sale_types(id, name),
        property_images(*),
        property_features!property_features_property_id_fkey(feature:features(id, name))
      `);

    // Apply filters if provided
    if (filters.propertyType) {
      query = query.eq('property_type_id', filters.propertyType);
    }
    if (filters.saleType) {
      query = query.eq('sale_type_id', filters.saleType);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms);
    }
    if (filters.bathrooms) {
      query = query.eq('bathrooms', filters.bathrooms);
    }

    // Order by created_at by default
    query = query.order('created_at', { ascending: false });

    return await query;
  },

  /**
   * Fetch a single property by ID
   * @param {string} id - Property ID
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async getPropertyById(id) {
    return await supabase
      .from('properties')
      .select(`
        *,
        property_type:property_types(id, name),
        sale_type:sale_types(id, name),
        property_images(*),
        property_features!property_features_property_id_fkey(feature:features(id, name))
      `)
      .eq('id', id)
      .single();
  },

  /**
   * Create a new property
   * @param {Object} property - Property data
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async createProperty(property) {
    // First create the property
    const { data, error } = await supabase
      .from('properties')
      .insert([
        {
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
        },
      ])
      .select();

    if (error || !data) return { data: null, error };

    const propertyId = data[0].id;

    // Then add images if provided
    if (property.images && property.images.length > 0) {
      const imagesToInsert = property.images.map((image, index) => ({
        property_id: propertyId,
        image_url: image.url,
        order: index,
      }));

      const { error: imageError } = await supabase
        .from('property_images')
        .insert(imagesToInsert);

      if (imageError) return { data, error: imageError };
    }

    // Then add features if provided
    if (property.features && property.features.length > 0) {
      const featuresToInsert = property.features.map((featureId) => ({
        property_id: propertyId,
        feature_id: featureId,
      }));

      const { error: featureError } = await supabase
        .from('property_features')
        .insert(featuresToInsert);

      if (featureError) return { data, error: featureError };
    }

    return { data, error: null };
  },

  /**
   * Update an existing property
   * @param {string} id - Property ID
   * @param {Object} property - Updated property data
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async updateProperty(id, property) {
    // First update the property
    const { data, error } = await supabase
      .from('properties')
      .update({
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
        updated_at: new Date(),
      })
      .eq('id', id)
      .select();

    if (error) return { data: null, error };

    // Handle images if provided
    if (property.images) {
      // First delete existing images
      const { error: deleteError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', id);

      if (deleteError) return { data, error: deleteError };

      // Then add new images
      if (property.images.length > 0) {
        const imagesToInsert = property.images.map((image, index) => ({
          property_id: id,
          image_url: image.url,
          order: index,
        }));

        const { error: imageError } = await supabase
          .from('property_images')
          .insert(imagesToInsert);

        if (imageError) return { data, error: imageError };
      }
    }

    // Handle features if provided
    if (property.features) {
      // First delete existing features
      const { error: deleteError } = await supabase
        .from('property_features')
        .delete()
        .eq('property_id', id);

      if (deleteError) return { data, error: deleteError };

      // Then add new features
      if (property.features.length > 0) {
        const featuresToInsert = property.features.map((featureId) => ({
          property_id: id,
          feature_id: featureId,
        }));

        const { error: featureError } = await supabase
          .from('property_features')
          .insert(featuresToInsert);

        if (featureError) return { data, error: featureError };
      }
    }

    return { data, error: null };
  },

  /**
   * Delete a property
   * @param {string} id - Property ID
   * @returns {Promise<{error: Object}>}
   */
  async deleteProperty(id) {
    // Due to cascade delete, we only need to delete the property
    return await supabase.from('properties').delete().eq('id', id);
  },

  /**
   * Fetch all property types
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getPropertyTypes() {
    return await supabase.from('property_types').select('*');
  },

  /**
   * Fetch all sale types
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getSaleTypes() {
    return await supabase.from('sale_types').select('*');
  },

  /**
   * Fetch all features
   * @returns {Promise<{data: Array, error: Object}>}
   */
  async getFeatures() {
    return await supabase.from('features').select('*');
  },
};