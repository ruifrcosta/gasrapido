import { InvitationService } from './invitationService';
import { supabase } from './supabase';
import verificationNotificationService from './verificationNotificationService';
import secureStorageService from './secureStorageService';

export interface DocumentUploadResult {
  success: boolean;
  documentId?: string;
  error?: string;
}

export interface VerificationStatus {
  userId: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  documents: VerificationDocumentStatus[];
  lastUpdated: string;
  rejectionReason?: string;
}

export interface VerificationDocumentStatus {
  documentId: string;
  type: 'id' | 'license' | 'insurance' | 'vehicle_registration';
  status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  name: string;
  uploadedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export class VerificationService {
  private invitationService: InvitationService;

  constructor() {
    this.invitationService = new InvitationService(supabase);
  }

  /**
   * Upload a verification document
   */
  async uploadDocument(
    userId: string,
    documentType: 'id' | 'license' | 'insurance' | 'vehicle_registration',
    file: File
  ): Promise<DocumentUploadResult> {
    try {
      // Upload file to storage
      const { path, error: uploadError } = await secureStorageService.uploadVerificationDocument(
        file,
        userId,
        documentType
      );
      
      if (uploadError) {
        throw new Error(uploadError);
      }
      
      // Save document record to database
      const { document, error } = await this.invitationService.uploadVerificationDocument({
        userId,
        documentType,
        filePath: path,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        status: 'pending',
        rejectionReason: null
      });
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        documentId: document?.id
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        error: 'Failed to upload document'
      };
    }
  }

  /**
   * Submit documents for verification
   */
  async submitForVerification(userId: string, userName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Create a verification request
      const { request, error } = await this.invitationService.createVerificationRequest(userId);
      
      if (error) {
        throw error;
      }
      
      if (!request) {
        return {
          success: false,
          error: 'Failed to create verification request'
        };
      }
      
      // Send notification to user
      await verificationNotificationService.sendDocumentsSubmittedNotification(userId, userName);
      
      // In a real implementation, you would also notify admins about the new request
      // await verificationNotificationService.sendNewVerificationRequestNotification(adminUserId, userName);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error submitting for verification:', error);
      return {
        success: false,
        error: 'Failed to submit documents for verification'
      };
    }
  }

  /**
   * Get verification status for a user
   */
  async getVerificationStatus(userId: string): Promise<VerificationStatus | null> {
    try {
      // Get user's verification request
      const { request, error: requestError } = await this.invitationService.getUserVerificationRequest(userId);
      
      if (requestError) {
        throw requestError;
      }
      
      if (!request) {
        return null;
      }
      
      // Get user's verification documents
      const { documents, error: documentsError } = await this.invitationService.getUserVerificationDocuments(userId);
      
      if (documentsError) {
        throw documentsError;
      }
      
      // Map documents to verification document status
      const documentStatuses: VerificationDocumentStatus[] = documents.map(doc => ({
        documentId: doc.id,
        type: doc.documentType,
        status: doc.status,
        name: doc.fileName,
        uploadedAt: doc.uploadedAt,
        reviewedAt: doc.reviewedAt || undefined,
        rejectionReason: doc.rejectionReason || undefined
      }));
      
      const status: VerificationStatus = {
        userId,
        status: request.status as 'pending' | 'in_review' | 'approved' | 'rejected',
        documents: documentStatuses,
        lastUpdated: request.submittedAt,
        rejectionReason: request.rejectionReason || undefined
      };
      
      return status;
    } catch (error) {
      console.error('Error fetching verification status:', error);
      return null;
    }
  }

  /**
   * Get user's verification documents
   */
  async getUserDocuments(userId: string) {
    return await this.invitationService.getUserVerificationDocuments(userId);
  }

  /**
   * Admin: Update verification request status
   */
  async updateVerificationStatus(
    requestId: string,
    status: 'approved' | 'rejected',
    reviewedById: string,
    userName: string,
    rejectionReason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { success, error } = await this.invitationService.updateVerificationRequestStatus(
        requestId,
        status,
        reviewedById,
        rejectionReason
      );
      
      if (error) {
        throw error;
      }
      
      if (success) {
        // Get the verification request to get the user ID
        const { request, error: fetchError } = await this.invitationService.getUserVerificationRequest(requestId);
        
        if (!fetchError && request) {
          // Send notification to user
          if (status === 'approved') {
            await verificationNotificationService.sendDocumentsApprovedNotification(request.userId, userName);
          } else if (status === 'rejected') {
            await verificationNotificationService.sendDocumentsRejectedNotification(request.userId, userName, rejectionReason);
          }
        }
      }
      
      return { success };
    } catch (error) {
      console.error('Error updating verification status:', error);
      return {
        success: false,
        error: 'Failed to update verification status'
      };
    }
  }

  /**
   * Admin: Review a document
   */
  async reviewDocument(
    documentId: string,
    status: 'approved' | 'rejected',
    reviewedById: string,
    rejectionReason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updates: any = {
        status,
        reviewed_by: reviewedById,
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
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error reviewing document:', error);
      return {
        success: false,
        error: 'Failed to review document'
      };
    }
  }
  
  /**
   * Get document URL for viewing
   */
  async getDocumentUrl(filePath: string): Promise<string | null> {
    return await secureStorageService.getDocumentUrl(filePath);
  }
}

export default new VerificationService();