# Supabase Edge Functions for UrbanEdge

This directory contains Edge Functions for the UrbanEdge real estate platform.

## Admin Operations Edge Function

The `admin-operations` Edge Function provides secure server-side functionality for performing administrative operations that require elevated privileges, such as updating user roles.

### Deployment Instructions

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Login to your Supabase account:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref andbtpzvxglilqurelac
   ```

4. Set the required secrets:
   ```bash
   supabase secrets set SUPABASE_URL=https://andbtpzvxglilqurelac.supabase.co
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

5. Deploy the function:
   ```bash
   supabase functions deploy admin-operations
   ```

### Security Considerations

- The Edge Function uses the service role key to perform operations with elevated privileges.
- The service role key is stored securely as an environment variable in the Edge Function and is never exposed to the client.
- The function includes multiple layers of authentication and authorization:
  1. It verifies that the request includes a valid JWT token
  2. It checks that the user making the request has admin privileges
  3. It validates all input data before performing any operations

### Available Operations

The Edge Function supports the following operations:

#### Update User Role

Updates a user's role in the profiles table.

**Request:**
```json
{
  "action": "updateRole",
  "targetUserId": "user-uuid",
  "newRole": "admin" // or "agent" or "client"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User role updated to admin",
  "data": {
    "id": "user-uuid",
    "role": "admin",
    "first_name": "John",
    "last_name": "Doe",
    "...": "..."
  }
}
```

#### Get User Information

Retrieves detailed information about a user, including both auth and profile data.

**Request:**
```json
{
  "action": "getUserInfo",
  "targetUserId": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "auth": {
      "user": {
        "id": "user-uuid",
        "email": "user@example.com",
        "...": "..."
      }
    },
    "profile": {
      "id": "user-uuid",
      "first_name": "John",
      "last_name": "Doe",
      "role": "admin",
      "...": "..."
    }
  }
}
```

## Best Practices for Working with Service Role Keys

1. **Never expose service role keys in client-side code**
   - Always use Edge Functions or other server-side code to perform operations that require the service role key

2. **Use proper environment variable naming**
   - Never use the `VITE_` prefix for sensitive keys, as these are exposed to the client
   - Use proper naming like `SUPABASE_SERVICE_ROLE_KEY` without the `VITE_` prefix

3. **Implement multiple layers of authorization**
   - Always verify that the user making the request has the appropriate permissions
   - Validate all input data before performing any operations

4. **Limit the scope of operations**
   - Only perform the specific operations needed
   - Don't grant more permissions than necessary

5. **Log all administrative actions**
   - Keep track of who performed what actions and when
   - This helps with auditing and troubleshooting

6. **Regularly rotate keys**
   - Periodically rotate your service role key
   - Update all deployed functions with the new key

7. **Use RLS policies as an additional layer of security**
   - Even when using the service role key, maintain proper RLS policies
   - This provides defense in depth
