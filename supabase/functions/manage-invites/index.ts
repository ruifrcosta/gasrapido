// Import Supabase functions
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Import types
// @ts-ignore
import type { Invite, CreateInviteParams } from '../types/invitation.ts';

// Environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create Supabase client with service role key for full access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to generate response
const createResponse = (data: any, status = 200) => {
  return new Response(
    JSON.stringify(data),
    {
      headers: { "Content-Type": "application/json" },
      status,
    },
  );
};

// Helper function to generate error response
const createErrorResponse = (message: string, status = 400) => {
  return createResponse({ error: message }, status);
};

// Main function to handle requests
const handler = async (request: Request): Promise<Response> => {
  try {
    // Get the request method and URL
    const method = request.method;
    const url = new URL(request.url);
    const path = url.pathname;

    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse('Missing Authorization header', 401);
    }

    // Verify the user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return createErrorResponse('Invalid or expired token', 401);
    }

    // Handle different endpoints
    if (path === '/create-invite') {
      if (method !== 'POST') {
        return createErrorResponse('Method not allowed', 405);
      }
      
      // Parse request body
      const body = await request.json();
      const { type, email, expiryDays } = body;
      
      // Validate required fields
      if (!type || !email) {
        return createErrorResponse('Missing required fields: type and email', 400);
      }
      
      // Validate invitation type
      const validTypes = ['client', 'vendor', 'courier'];
      if (validTypes.indexOf(type) === -1) {
        return createErrorResponse('Invalid invitation type', 400);
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return createErrorResponse('Invalid email format', 400);
      }
      
      // Create invitation using the database function
      const { data, error } = await supabase.rpc('create_invite', {
        invite_type: type,
        invite_email: email,
        invited_by_id: user.id,
        expiry_days: expiryDays || 7
      });
      
      if (error) {
        console.error('Error creating invite:', error);
        return createErrorResponse('Failed to create invitation', 500);
      }
      
      return createResponse({
        success: true,
        invite: data[0]
      });
    }
    
    if (path === '/accept-invite') {
      if (method !== 'POST') {
        return createErrorResponse('Method not allowed', 405);
      }
      
      // Parse request body
      const body = await request.json();
      const { code } = body;
      
      // Validate required fields
      if (!code) {
        return createErrorResponse('Missing required field: code', 400);
      }
      
      // Accept invitation using the database function
      const { data, error } = await supabase.rpc('accept_invite', {
        invite_code: code,
        user_id: user.id
      });
      
      if (error) {
        console.error('Error accepting invite:', error);
        return createErrorResponse('Failed to accept invitation', 500);
      }
      
      const result = data[0];
      if (!result.success) {
        return createErrorResponse(result.message, 400);
      }
      
      return createResponse({
        success: true,
        message: result.message,
        inviteId: result.invite_id
      });
    }
    
    if (path === '/get-invite') {
      if (method !== 'GET') {
        return createErrorResponse('Method not allowed', 405);
      }
      
      // Get code from query parameters
      const code = url.searchParams.get('code');
      
      // Validate required fields
      if (!code) {
        return createErrorResponse('Missing required parameter: code', 400);
      }
      
      // Get invitation by code
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('code', code)
        .single();
      
      if (error) {
        console.error('Error fetching invite:', error);
        return createErrorResponse('Failed to fetch invitation', 500);
      }
      
      if (!data) {
        return createErrorResponse('Invitation not found', 404);
      }
      
      return createResponse({
        success: true,
        invite: data
      });
    }
    
    if (path === '/list-invites') {
      if (method !== 'GET') {
        return createErrorResponse('Method not allowed', 405);
      }
      
      // Get query parameters
      const type = url.searchParams.get('type') as 'client' | 'vendor' | 'courier' | null;
      const status = url.searchParams.get('status') as 'pending' | 'accepted' | 'expired' | 'revoked' | null;
      
      // Build query
      let query = supabase
        .from('invites')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (type) {
        const validTypes = ['client', 'vendor', 'courier'];
        if (validTypes.indexOf(type) !== -1) {
          query = query.eq('type', type);
        }
      }
      
      if (status) {
        const validStatuses = ['pending', 'accepted', 'expired', 'revoked'];
        if (validStatuses.indexOf(status) !== -1) {
          query = query.eq('status', status);
        }
      }
      
      // Execute query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching invites:', error);
        return createErrorResponse('Failed to fetch invitations', 500);
      }
      
      return createResponse({
        success: true,
        invites: data
      });
    }
    
    if (path === '/revoke-invite') {
      if (method !== 'POST') {
        return createErrorResponse('Method not allowed', 405);
      }
      
      // Parse request body
      const body = await request.json();
      const { inviteId } = body;
      
      // Validate required fields
      if (!inviteId) {
        return createErrorResponse('Missing required field: inviteId', 400);
      }
      
      // Update invitation status to revoked
      const { error } = await supabase
        .from('invites')
        .update({ 
          status: 'revoked',
          updated_at: new Date().toISOString()
        })
        .eq('id', inviteId);
      
      if (error) {
        console.error('Error revoking invite:', error);
        return createErrorResponse('Failed to revoke invitation', 500);
      }
      
      return createResponse({
        success: true,
        message: 'Invitation revoked successfully'
      });
    }
    
    // If no route matched
    return createErrorResponse('Endpoint not found', 404);
  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse('Internal server error', 500);
  }
};

// Serve the function
serve(handler);