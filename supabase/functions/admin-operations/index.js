// supabase/functions/admin-operations/index.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Environment variables are securely accessed in Edge Functions
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    
    // Verify the request is authenticated and from an authorized user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    // Extract the token
    const token = authHeader.replace('Bearer ', '')
    
    // Verify the user is authorized to make this request
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    // Additional check: Only allow certain users to perform admin operations
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      
    if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin privileges required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    // Parse the request body
    const { targetUserId, newRole, action } = await req.json()
    
    // Handle different admin actions
    if (action === 'updateRole') {
      // Validate the input
      if (!targetUserId || !newRole || !['admin', 'agent', 'client'].includes(newRole)) {
        return new Response(JSON.stringify({ error: 'Invalid input' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      // Update the user's role
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', targetUserId)
        .select()
      
      if (error) throw error
      
      // Return the updated user
      return new Response(JSON.stringify({ 
        success: true, 
        message: `User role updated to ${newRole}`,
        data 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } 
    else if (action === 'getUserInfo') {
      if (!targetUserId) {
        return new Response(JSON.stringify({ error: 'Target user ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      // Get user info from auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(
        targetUserId
      )
      
      if (authError) throw authError
      
      // Get profile info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single()
        
      if (profileError) throw profileError
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          auth: authUser,
          profile: profileData
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
