import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

if (!supabaseServiceKey) {
  console.warn('Missing Supabase Service Role Key. Admin operations will not work. Make sure to set VITE_SUPABASE_SERVICE_ROLE_KEY in your .env file.');
}

// Regular client with anonymous key for normal operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role key for bypassing RLS
// IMPORTANT: This should only be used in secure server-side contexts or for admin operations
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

console.log("Supabase clients initialized:", {
  regularClient: !!supabase,
  adminClient: !!supabaseAdmin,
  serviceKeyAvailable: !!supabaseServiceKey
});

// Helper functions for authentication
export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email, password, checkAdmin = false) => {
  try {
    // First, sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { data, error };

    // If we need to check for admin role (for admin login page)
    if (checkAdmin && data?.user) {
      console.log("Checking admin status for user:", data.user.id);

      try {
        // Try with admin client first if available (bypasses RLS)
        if (supabaseAdmin) {
          console.log("Checking admin status with admin client");
          const { data: adminProfileData, error: adminProfileError } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (adminProfileError) {
            console.error("Error with admin client:", adminProfileError);
            // If there's an error with the admin client, try with direct SQL query
            const { data: sqlData, error: sqlError } = await supabaseAdmin.rpc('is_user_admin', {
              user_id: data.user.id
            });

            if (sqlError) {
              console.error("Error with SQL function:", sqlError);
              await supabase.auth.signOut();
              return {
                data: null,
                error: { message: 'Failed to verify admin status. Please try again later.' }
              };
            }

            if (!sqlData) {
              console.log("User is not an admin (via SQL function)");
              await supabase.auth.signOut();
              return {
                data: null,
                error: { message: 'Unauthorized: Admin access only' }
              };
            }

            console.log("Admin login successful (via SQL function)");
            return { data, error: null };
          }

          if (adminProfileData?.role !== 'admin') {
            console.log("User is not an admin. Role:", adminProfileData?.role);
            await supabase.auth.signOut();
            return {
              data: null,
              error: { message: 'Unauthorized: Admin access only' }
            };
          }

          console.log("Admin login successful (via admin client)");
          return { data, error: null };
        }

        // Fallback to regular client if admin client is not available
        console.log("Trying with regular client");
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error("Error with regular client:", profileError);
          await supabase.auth.signOut();
          return {
            data: null,
            error: { message: 'Failed to verify admin status: ' + profileError.message }
          };
        }

        if (profileData?.role !== 'admin') {
          console.log("User is not an admin. Role:", profileData?.role);
          await supabase.auth.signOut();
          return {
            data: null,
            error: { message: 'Unauthorized: Admin access only' }
          };
        }

        console.log("Admin login successful (via regular client)");
      } catch (profileErr) {
        console.error("Unexpected error checking profile:", profileErr);
        await supabase.auth.signOut();
        return {
          data: null,
          error: { message: 'Failed to verify admin status: ' + profileErr.message }
        };
      }
    }

    return { data, error };
  } catch (err) {
    console.error("Unexpected error in signIn:", err);
    return {
      data: null,
      error: { message: 'An unexpected error occurred: ' + err.message }
    };
  }
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getUserProfile = async (userId) => {
  try {
    console.log("Fetching profile for user ID:", userId);

    // First try with regular client
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile with regular client:", error);

      // Try with admin client if available
      if (supabaseAdmin) {
        console.log("Trying to fetch profile with admin client");
        const { data: adminData, error: adminError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (adminError) {
          console.error("Error fetching user profile with admin client:", adminError);

          // Check if the profile doesn't exist
          if (adminError.code === 'PGRST116') {
            console.log("Profile not found, attempting to create default profile");

            try {
              // Create a default profile for the user
              const { data: userData } = await supabase.auth.getUser();

              if (userData?.user) {
                const defaultProfile = {
                  id: userId,
                  first_name: '',
                  last_name: '',
                  role: 'client', // Default role
                  created_at: new Date(),
                  updated_at: new Date()
                };

                const { data: newProfile, error: createError } = await supabaseAdmin
                  .from('profiles')
                  .insert([defaultProfile])
                  .select()
                  .single();

                if (createError) {
                  console.error("Failed to create default profile:", createError);
                  return { data: null, error: createError };
                }

                console.log("Created default profile:", newProfile);
                return { data: newProfile, error: null };
              }
            } catch (createErr) {
              console.error("Error creating default profile:", createErr);
              return { data: null, error: createErr };
            }
          }

          return { data: null, error: adminError };
        }

        console.log("Profile data retrieved with admin client:", adminData);
        return { data: adminData, error: null };
      }

      // If no admin client or profile doesn't exist
      if (error.code === 'PGRST116') {
        console.log("Profile not found, attempting to create default profile");

        try {
          // Create a default profile for the user
          const { data: userData } = await supabase.auth.getUser();

          if (userData?.user) {
            const defaultProfile = {
              id: userId,
              first_name: '',
              last_name: '',
              role: 'client', // Default role
              created_at: new Date(),
              updated_at: new Date()
            };

            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([defaultProfile])
              .select()
              .single();

            if (createError) {
              console.error("Failed to create default profile:", createError);
              return { data: null, error: createError };
            }

            console.log("Created default profile:", newProfile);
            return { data: newProfile, error: null };
          }
        } catch (createErr) {
          console.error("Error creating default profile:", createErr);
          return { data: null, error: createErr };
        }
      }

      return { data: null, error };
    }

    console.log("Profile data retrieved with regular client:", data);
    return { data, error };
  } catch (err) {
    console.error("Unexpected error in getUserProfile:", err);
    return { data: null, error: err };
  }
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
};

// Helper functions for properties
export const getProperties = async (filters = {}) => {
  let query = supabase.from('properties').select('*');

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query;
  return { data, error };
};

export const getPropertyById = async (id) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*, profiles(*)')
    .eq('id', id)
    .single();
  return { data, error };
};

// Helper functions for saved properties
export const getSavedProperties = async (userId) => {
  const { data, error } = await supabase
    .from('saved_properties')
    .select('*, properties(*)')
    .eq('user_id', userId);
  return { data, error };
};

export const saveProperty = async (userId, propertyId) => {
  const { data, error } = await supabase
    .from('saved_properties')
    .insert([{ user_id: userId, property_id: propertyId }]);
  return { data, error };
};

export const unsaveProperty = async (userId, propertyId) => {
  const { data, error } = await supabase
    .from('saved_properties')
    .delete()
    .match({ user_id: userId, property_id: propertyId });
  return { data, error };
};

// Helper functions for appointments
export const getAppointments = async (userId, role) => {
  let query = supabase
    .from('appointments')
    .select('*, properties(*), profiles!appointments_client_id_fkey(*), profiles!appointments_agent_id_fkey(*)');

  if (role === 'client') {
    query = query.eq('client_id', userId);
  } else if (role === 'agent') {
    query = query.eq('agent_id', userId);
  }

  const { data, error } = await query;
  return { data, error };
};

export const createAppointment = async (appointmentData) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointmentData]);
  return { data, error };
};

export const updateAppointment = async (id, updates) => {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id);
  return { data, error };
};

// Helper functions for documents
export const uploadDocument = async (file, path) => {
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(path, file);
  return { data, error };
};

export const getDocuments = async (userId) => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
};

// Helper functions for applications
export const getApplications = async (userId, role) => {
  let query = supabase
    .from('applications')
    .select('*, properties(*), profiles(*)');

  if (role === 'client') {
    query = query.eq('client_id', userId);
  } else if (role === 'agent') {
    query = query.eq('agent_id', userId);
  }

  const { data, error } = await query;
  return { data, error };
};

export const createApplication = async (applicationData) => {
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData]);
  return { data, error };
};

export const updateApplication = async (id, updates) => {
  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', id);
  return { data, error };
};

// Helper functions for messages
export const getMessages = async (userId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*, profiles!messages_sender_id_fkey(*), profiles!messages_recipient_id_fkey(*)')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const sendMessage = async (messageData) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData]);
  return { data, error };
};

export const markMessageAsRead = async (id) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', id);
  return { data, error };
};
