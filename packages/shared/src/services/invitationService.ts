import { Profile, UserRole } from '../types';

export interface Invite {
  id: string;
  code: string;
  type: 'client' | 'vendor' | 'courier';
  email: string;
  invitedBy: string | null;
  acceptedBy: string | null;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationDocument {
  id: string;
  userId: string;
  documentType: 'id' | 'license' | 'insurance' | 'vehicle_registration';
  filePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  uploadedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface CreateInviteParams {
  type: 'client' | 'vendor' | 'courier';
  email: string;
  invitedById: string;
  expiryDays?: number;
}

export interface AcceptInviteParams {
  code: string;
  userId: string;
}

export class InvitationService {
  private supabase: any;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  /**
   * Create a new invitation
   */
  async createInvite(params: CreateInviteParams): Promise<{ invite: Invite | null; error?: any }> {
    try {
      const { data, error } = await this.supabase.rpc('create_invite', {
        invite_type: params.type,
        invite_email: params.email,
        invited_by_id: params.invitedById,
        expiry_days: params.expiryDays || 7
      });

      if (error) throw error;

      // Convert to Invite type
      const invite: Invite = {
        id: data[0].invite_id,
        code: data[0].invite_code,
        type: data[0].invite_type,
        email: data[0].invite_email,
        invitedBy: data[0].invited_by,
        acceptedBy: null,
        status: data[0].status,
        expiresAt: data[0].expires_at,
        acceptedAt: null,
        createdAt: data[0].created_at,
        updatedAt: data[0].created_at
      };

      return { invite, error: null };
    } catch (error) {
      console.error('Error creating invite:', error);
      return { invite: null, error };
    }
  }

  /**
   * Accept an invitation
   */
  async acceptInvite(params: AcceptInviteParams): Promise<{ success: boolean; message: string; error?: any }> {
    try {
      const { data, error } = await this.supabase.rpc('accept_invite', {
        invite_code: params.code,
        user_id: params.userId
      });

      if (error) throw error;

      return { 
        success: data[0].success, 
        message: data[0].message,
        error: null 
      };
    } catch (error) {
      console.error('Error accepting invite:', error);
      return { success: false, message: 'Erro ao aceitar convite', error };
    }
  }

  /**
   * Get invitation by code
   */
  async getInviteByCode(code: string): Promise<{ invite: Invite | null; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('invites')
        .select('*')
        .eq('code', code)
        .single();

      if (error) throw error;

      const invite: Invite = {
        id: data.id,
        code: data.code,
        type: data.type,
        email: data.email,
        invitedBy: data.invited_by,
        acceptedBy: data.accepted_by,
        status: data.status,
        expiresAt: data.expires_at,
        acceptedAt: data.accepted_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      return { invite, error: null };
    } catch (error) {
      console.error('Error fetching invite:', error);
      return { invite: null, error };
    }
  }

  /**
   * Get all invitations with optional filters
   */
  async getInvites(filters?: { 
    type?: 'client' | 'vendor' | 'courier';
    status?: 'pending' | 'accepted' | 'expired' | 'revoked';
    email?: string;
    invitedById?: string;
  }): Promise<{ invites: Invite[]; error?: any }> {
    try {
      let query = this.supabase
        .from('invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.email) {
        query = query.eq('email', filters.email);
      }

      if (filters?.invitedById) {
        query = query.eq('invited_by', filters.invitedById);
      }

      const { data, error } = await query;

      if (error) throw error;

      const invites: Invite[] = data.map((item: any) => ({
        id: item.id,
        code: item.code,
        type: item.type,
        email: item.email,
        invitedBy: item.invited_by,
        acceptedBy: item.accepted_by,
        status: item.status,
        expiresAt: item.expires_at,
        acceptedAt: item.accepted_at,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      return { invites, error: null };
    } catch (error) {
      console.error('Error fetching invites:', error);
      return { invites: [], error };
    }
  }

  /**
   * Revoke an invitation
   */
  async revokeInvite(inviteId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await this.supabase
        .from('invites')
        .update({ 
          status: 'revoked',
          updated_at: new Date().toISOString()
        })
        .eq('id', inviteId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error revoking invite:', error);
      return { success: false, error };
    }
  }

  /**
   * Upload verification document
   */
  async uploadVerificationDocument(document: Omit<VerificationDocument, 'id' | 'uploadedAt' | 'reviewedAt' | 'reviewedBy'>): Promise<{ document: VerificationDocument | null; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('verification_documents')
        .insert({
          user_id: document.userId,
          document_type: document.documentType,
          file_path: document.filePath,
          file_name: document.fileName,
          mime_type: document.mimeType,
          file_size: document.fileSize,
          status: document.status,
          rejection_reason: document.rejectionReason
        })
        .select()
        .single();

      if (error) throw error;

      const verificationDocument: VerificationDocument = {
        id: data.id,
        userId: data.user_id,
        documentType: data.document_type,
        filePath: data.file_path,
        fileName: data.file_name,
        mimeType: data.mime_type,
        fileSize: data.file_size,
        status: data.status,
        rejectionReason: data.rejection_reason,
        uploadedAt: data.uploaded_at,
        reviewedAt: data.reviewed_at,
        reviewedBy: data.reviewed_by
      };

      return { document: verificationDocument, error: null };
    } catch (error) {
      console.error('Error uploading verification document:', error);
      return { document: null, error };
    }
  }

  /**
   * Get verification documents for a user
   */
  async getUserVerificationDocuments(userId: string): Promise<{ documents: VerificationDocument[]; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('verification_documents')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      const documents: VerificationDocument[] = data.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        documentType: item.document_type,
        filePath: item.file_path,
        fileName: item.file_name,
        mimeType: item.mime_type,
        fileSize: item.file_size,
        status: item.status,
        rejectionReason: item.rejection_reason,
        uploadedAt: item.uploaded_at,
        reviewedAt: item.reviewed_at,
        reviewedBy: item.reviewed_by
      }));

      return { documents, error: null };
    } catch (error) {
      console.error('Error fetching verification documents:', error);
      return { documents: [], error };
    }
  }

  /**
   * Create verification request
   */
  async createVerificationRequest(userId: string): Promise<{ request: VerificationRequest | null; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('verification_requests')
        .insert({
          user_id: userId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      const request: VerificationRequest = {
        id: data.id,
        userId: data.user_id,
        status: data.status,
        rejectionReason: data.rejection_reason,
        submittedAt: data.submitted_at,
        reviewedAt: data.reviewed_at,
        reviewedBy: data.reviewed_by
      };

      return { request, error: null };
    } catch (error) {
      console.error('Error creating verification request:', error);
      return { request: null, error };
    }
  }

  /**
   * Get verification request for a user
   */
  async getUserVerificationRequest(userId: string): Promise<{ request: VerificationRequest | null; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      const request: VerificationRequest = {
        id: data.id,
        userId: data.user_id,
        status: data.status,
        rejectionReason: data.rejection_reason,
        submittedAt: data.submitted_at,
        reviewedAt: data.reviewed_at,
        reviewedBy: data.reviewed_by
      };

      return { request, error: null };
    } catch (error) {
      console.error('Error fetching verification request:', error);
      return { request: null, error };
    }
  }

  /**
   * Update verification request status
   */
  async updateVerificationRequestStatus(requestId: string, status: 'approved' | 'rejected', reviewedById: string, rejectionReason?: string): Promise<{ success: boolean; error?: any }> {
    try {
      const updates: any = {
        status,
        reviewed_by: reviewedById,
        reviewed_at: new Date().toISOString()
      };

      if (rejectionReason) {
        updates.rejection_reason = rejectionReason;
      }

      const { error } = await this.supabase
        .from('verification_requests')
        .update(updates)
        .eq('id', requestId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating verification request:', error);
      return { success: false, error };
    }
  }
}