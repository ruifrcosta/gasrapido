export interface Invite {
  id: string;
  code: string;
  type: 'client' | 'vendor' | 'courier';
  email: string;
  invited_by: string | null;
  accepted_by: string | null;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerificationDocument {
  id: string;
  user_id: string;
  document_type: 'id' | 'license' | 'insurance' | 'vehicle_registration';
  file_path: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  uploaded_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
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