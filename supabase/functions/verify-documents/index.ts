// Import Supabase functions
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
    if (path === '/upload-document') {
      if (method !== 'POST') {
        return createErrorResponse('Method not allowed', 405);
      }
      
      // For document upload, we would typically handle multipart form data
      // This is a simplified version - in practice, you might use a storage solution
      // and store the file path in the database
      
      // Parse request body (assuming JSON for simplicity)
      const body = await request.json();
      const { documentType, filePath, fileName, mimeType, fileSize } = body;
      
      // Validate required fields
      if (!documentType || !filePath || !fileName || !mimeType || !fileSize) {
        return createErrorResponse('Missing required fields', 400);
      }
      
      // Validate document type
      const validTypes = ['id', 'license', 'insurance', 'vehicle_registration'];
      if (validTypes.indexOf(documentType) === -1) {
        return createErrorResponse('Invalid document type', 400);
      }
      
      // Insert document record
      const { data, error } = await supabase
        .from('verification_documents')
        .insert({
          user_id: user.id,
          document_type: documentType,
          file_path: filePath,
          file_name: fileName,
          mime_type: mimeType,
          file_size: fileSize,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error uploading document:', error);
        return createErrorResponse('Failed to upload document', 500);
      }
      
      return createResponse({
        success: true,
        document: data
      });
    }
    
    if (path === '/get-user-documents') {
      if (method !== 'GET') {
        return createErrorResponse('Method not allowed', 405);
      }
      
      // Get user's verification documents
      const { data, error } = await supabase
        .from('verification_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching documents:', error);
        return createErrorResponse('Failed to fetch documents', 500);
      }
      
      return createResponse({
        success: true,
        documents: data
      });
    }
    
    if (path === '/submit-verification-request') {
      if (method !== 'POST') {
        return createErrorResponse('Method not allowed', 405);
      }
      
      // Check if user already has a pending verification request
      const { data: existingRequest, error: fetchError } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error checking existing request:', fetchError);
        return createErrorResponse('Failed to check existing request', 500);
      }
      
      // If there's already a pending request, return it
      if (existingRequest) {
        return createResponse({
          success: true,
          request: existingRequest,
          message: 'Verification request already exists'
        });
      }
      
      // Create new verification request
      const { data, error } = await supabase
        .from('verification_requests')
        .insert({
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating verification request:', error);
        return createErrorResponse('Failed to create verification request', 500);
      }
      
      return createResponse({
        success: true,
        request: data
      });
    }
    
    if (path === '/get-verification-request') {
      if (method !== 'GET') {
        return createErrorResponse('Method not allowed', 405);
      }
      
      // Get user's latest verification request
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching verification request:', error);
        return createErrorResponse('Failed to fetch verification request', 500);
      }
      
      return createResponse({
        success: true,
        request: data
      });
    }
    
    // Admin-only endpoints
    if (path === '/admin/review-document' || path === '/admin/update-verification-request') {
      // Check if user is admin (this would need to be implemented based on your auth system)
      // For now, we'll assume the user has admin privileges if they're accessing this endpoint
      
      if (method !== 'POST') {
        return createErrorResponse('Method not allowed', 405);
      }
      
      // Parse request body
      const body = await request.json();
      
      if (path === '/admin/review-document') {
        const { documentId, status, rejectionReason } = body;
        
        // Validate required fields
        if (!documentId || !status) {
          return createErrorResponse('Missing required fields: documentId and status', 400);
        }
        
        // Validate status
        const validStatuses = ['approved', 'rejected'];
        if (validStatuses.indexOf(status) === -1) {
          return createErrorResponse('Invalid status', 400);
        }
        
        // Update document status
        const updates: any = {
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        };
        
        if (rejectionReason) {
          updates.rejection_reason = rejectionReason;
        }
        
        const { error } = await supabase
          .from('verification_documents')
          .update(updates)
          .eq('id', documentId);
        
        if (error) {
          console.error('Error reviewing document:', error);
          return createErrorResponse('Failed to review document', 500);
        }
        
        return createResponse({
          success: true,
          message: `Document ${status} successfully`
        });
      }
      
      if (path === '/admin/update-verification-request') {
        const { requestId, status, rejectionReason } = body;
        
        // Validate required fields
        if (!requestId || !status) {
          return createErrorResponse('Missing required fields: requestId and status', 400);
        }
        
        // Validate status
        const validStatuses = ['approved', 'rejected'];
        if (validStatuses.indexOf(status) === -1) {
          return createErrorResponse('Invalid status', 400);
        }
        
        // Update verification request status
        const updates: any = {
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        };
        
        if (rejectionReason) {
          updates.rejection_reason = rejectionReason;
        }
        
        const { error } = await supabase
          .from('verification_requests')
          .update(updates)
          .eq('id', requestId);
        
        if (error) {
          console.error('Error updating verification request:', error);
          return createErrorResponse('Failed to update verification request', 500);
        }
        
        // If the request is approved, we might want to update the user's profile status
        if (status === 'approved') {
          // Get the verification request to get the user ID
          const { data: request, error: fetchError } = await supabase
            .from('verification_requests')
            .select('user_id')
            .eq('id', requestId)
            .single();
          
          if (!fetchError && request) {
            // Update user profile status to 'verified' or 'active'
            // This would depend on your specific implementation
            // await supabase
            //   .from('profiles')
            //   .update({ status: 'verified' })
            //   .eq('id', request.user_id);
          }
        }
        
        return createResponse({
          success: true,
          message: `Verification request ${status} successfully`
        });
      }
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