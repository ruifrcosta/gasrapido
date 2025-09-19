import { SupabaseClient } from '@supabase/supabase-js';
import { 
  PaymentProof, 
  UploadPaymentProofRequest, 
  VerifyPaymentProofRequest,
  PaymentProofStatus
} from '../types';
import CryptoJS from 'crypto-js';

export interface PaymentProofMetrics {
  totalProofs: number;
  pendingVerification: number;
  approved: number;
  rejected: number;
  proofFailure: number;
  averageVerificationTimeHours: number;
  rejectionRate: number;
  resubmissionRate: number;
  failedUploads: number;
  averageOrderDelayHours: number;
}

export class PaymentProofService {
  private supabase: SupabaseClient<any, "public", any> | null = null;

  constructor(supabase?: SupabaseClient<any, "public", any>) {
    if (supabase) {
      this.supabase = supabase;
    }
  }

  /**
   * Initialize the service with a Supabase client
   */
  initialize(supabase: SupabaseClient<any, "public", any>) {
    this.supabase = supabase;
  }

  /**
   * Generate a hash for file integrity verification
   */
  private async generateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const hash = CryptoJS.SHA256(wordArray).toString();
          resolve(hash);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Upload a payment proof document
   */
  async uploadPaymentProof(request: UploadPaymentProofRequest): Promise<{ data: PaymentProof | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      // Generate file hash for integrity verification
      const fileHash = await this.generateFileHash(request.file);
      
      // First, upload the file to storage
      const fileName = `${Date.now()}_${request.file.name}`;
      const filePath = `${this.supabase.auth.getUser().data.user?.id}/${fileName}`;
      
      const { error: storageError } = await this.supabase.storage
        .from('payment-proofs')
        .upload(filePath, request.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        return { data: null, error: new Error(`Failed to upload file: ${storageError.message}`) };
      }

      // Then create the payment proof record
      const { data, error } = await this.supabase
        .from('payment_proofs')
        .insert({
          user_id: this.supabase.auth.getUser().data.user?.id,
          order_id: request.orderId,
          payment_method: request.paymentMethod,
          amount: request.amount,
          status: 'pending_verification',
          file_path: filePath,
          file_hash: fileHash,
          notes: request.notes
        })
        .select()
        .single();

      if (error) {
        // If record creation fails, try to delete the uploaded file
        await this.supabase.storage.from('payment-proofs').remove([filePath]);
        return { data: null, error: new Error(`Failed to create payment proof record: ${error.message}`) };
      }

      return { data: data as PaymentProof, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get payment proofs for a user
   */
  async getUserPaymentProofs(userId: string): Promise<{ data: PaymentProof[] | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('payment_proofs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: new Error(`Failed to fetch payment proofs: ${error.message}`) };
      }

      return { data: data as PaymentProof[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get payment proofs for an order
   */
  async getOrderPaymentProofs(orderId: string): Promise<{ data: PaymentProof[] | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('payment_proofs')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: new Error(`Failed to fetch payment proofs: ${error.message}`) };
      }

      return { data: data as PaymentProof[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get all pending verification payment proofs (for finance/admin)
   */
  async getPendingVerificationProofs(): Promise<{ data: PaymentProof[] | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('payment_proofs')
        .select('*')
        .eq('status', 'pending_verification')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: new Error(`Failed to fetch pending payment proofs: ${error.message}`) };
      }

      return { data: data as PaymentProof[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Verify a payment proof (for finance/admin)
   */
  async verifyPaymentProof(request: VerifyPaymentProofRequest): Promise<{ data: PaymentProof | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('payment_proofs')
        .update({
          status: request.status,
          verified_by: this.supabase.auth.getUser().data.user?.id,
          verified_at: new Date().toISOString(),
          rejection_reason: request.rejectionReason
        })
        .eq('id', request.paymentProofId)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to verify payment proof: ${error.message}`) };
      }

      return { data: data as PaymentProof, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get a payment proof by ID
   */
  async getPaymentProofById(id: string): Promise<{ data: PaymentProof | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('payment_proofs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to fetch payment proof: ${error.message}`) };
      }

      return { data: data as PaymentProof, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get the public URL for a payment proof file
   */
  getPaymentProofFileUrl(filePath: string): string {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data } = this.supabase.storage
      .from('payment-proofs')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }

  /**
   * Delete a payment proof (only if rejected or pending)
   */
  async deletePaymentProof(id: string): Promise<{ error: Error | null }> {
    if (!this.supabase) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      // First, get the payment proof to check status and get file path
      const { data: paymentProof, error: fetchError } = await this.getPaymentProofById(id);
      
      if (fetchError) {
        return { error: fetchError };
      }
      
      if (!paymentProof) {
        return { error: new Error('Payment proof not found') };
      }
      
      // Check if user can delete (owner and status is rejected or pending)
      const userId = this.supabase.auth.getUser().data.user?.id;
      if (paymentProof.user_id !== userId) {
        return { error: new Error('Unauthorized to delete this payment proof') };
      }
      
      if (!['rejected', 'pending_proof'].includes(paymentProof.status)) {
        return { error: new Error('Cannot delete payment proof in current status') };
      }
      
      // Delete the file from storage
      const { error: storageError } = await this.supabase.storage
        .from('payment-proofs')
        .remove([paymentProof.file_path]);
      
      if (storageError) {
        return { error: new Error(`Failed to delete file: ${storageError.message}`) };
      }
      
      // Delete the record from database
      const { error: deleteError } = await this.supabase
        .from('payment_proofs')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        return { error: new Error(`Failed to delete payment proof record: ${deleteError.message}`) };
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Verify file integrity using stored hash
   */
  async verifyFileIntegrity(paymentProofId: string): Promise<{ isValid: boolean; error: Error | null }> {
    if (!this.supabase) {
      return { isValid: false, error: new Error('Supabase client not initialized') };
    }

    try {
      // Get payment proof record
      const { data: paymentProof, error: fetchError } = await this.getPaymentProofById(paymentProofId);
      
      if (fetchError) {
        return { isValid: false, error: fetchError };
      }
      
      if (!paymentProof) {
        return { isValid: false, error: new Error('Payment proof not found') };
      }
      
      // Download file
      const { data: fileData, error: downloadError } = await this.supabase.storage
        .from('payment-proofs')
        .download(paymentProof.file_path);
      
      if (downloadError) {
        return { isValid: false, error: new Error(`Failed to download file: ${downloadError.message}`) };
      }
      
      // Generate hash of downloaded file
      const arrayBuffer = await fileData.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      const currentHash = CryptoJS.SHA256(wordArray).toString();
      
      // Compare with stored hash
      const isValid = currentHash === paymentProof.file_hash;
      
      return { isValid, error: null };
    } catch (error) {
      return { isValid: false, error: error as Error };
    }
  }

  /**
   * Get pending verification proofs that have exceeded the timeout threshold
   */
  async getOverdueVerificationProofs(hoursThreshold: number = 48): Promise<{ data: PaymentProof[] | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      // Calculate the cutoff time
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - hoursThreshold);

      const { data, error } = await this.supabase
        .from('payment_proofs')
        .select('*')
        .eq('status', 'pending_verification')
        .lt('created_at', cutoffTime.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        return { data: null, error: new Error(`Failed to fetch overdue payment proofs: ${error.message}`) };
      }

      return { data: data as PaymentProof[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Send notifications for overdue payment proofs
   */
  async sendOverdueVerificationNotifications(hoursThreshold: number = 48): Promise<{ notifiedCount: number; error: Error | null }> {
    if (!this.supabase) {
      return { notifiedCount: 0, error: new Error('Supabase client not initialized') };
    }

    try {
      // Get overdue payment proofs
      const { data: overdueProofs, error: fetchError } = await this.getOverdueVerificationProofs(hoursThreshold);
      
      if (fetchError) {
        return { notifiedCount: 0, error: fetchError };
      }
      
      if (!overdueProofs || overdueProofs.length === 0) {
        return { notifiedCount: 0, error: null };
      }
      
      // In a real implementation, this would integrate with a notification service
      // For now, we'll just log the notifications
      console.log(`Sending notifications for ${overdueProofs.length} overdue payment proofs`);
      
      for (const proof of overdueProofs) {
        console.log(`Notifying admin about overdue payment proof: ${proof.id}`);
        // In a real implementation, this would send actual notifications
        // e.g., email, SMS, or in-app notifications
      }
      
      return { notifiedCount: overdueProofs.length, error: null };
    } catch (error) {
      return { notifiedCount: 0, error: error as Error };
    }
  }

  /**
   * Get payment proof metrics
   */
  async getPaymentProofMetrics(): Promise<{ data: PaymentProofMetrics | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      // Get total counts by status
      const { data: statusCounts, error: countError } = await this.supabase
        .from('payment_proofs')
        .select('status')
        .returns<{ status: PaymentProofStatus }[]>();

      if (countError) {
        return { data: null, error: new Error(`Failed to fetch payment proof counts: ${countError.message}`) };
      }

      // Calculate status counts
      const totalProofs = statusCounts.length;
      const statusMap: Record<PaymentProofStatus, number> = {
        'pending_proof': 0,
        'pending_verification': 0,
        'approved': 0,
        'rejected': 0,
        'proof_failure': 0
      };

      statusCounts.forEach(item => {
        statusMap[item.status] = (statusMap[item.status] || 0) + 1;
      });

      // Calculate rejection rate
      const rejectionRate = totalProofs > 0 ? (statusMap['rejected'] / totalProofs) * 100 : 0;

      // Calculate average verification time (for approved and rejected proofs)
      const { data: verificationTimes, error: timeError } = await this.supabase
        .from('payment_proofs')
        .select('created_at, verified_at')
        .not('verified_at', 'is', null)
        .limit(1000); // Limit to avoid performance issues

      let averageVerificationTimeHours = 0;
      if (!timeError && verificationTimes && verificationTimes.length > 0) {
        let totalHours = 0;
        verificationTimes.forEach(item => {
          const created = new Date(item.created_at);
          const verified = new Date(item.verified_at!);
          const diffHours = (verified.getTime() - created.getTime()) / (1000 * 60 * 60);
          totalHours += diffHours;
        });
        averageVerificationTimeHours = totalHours / verificationTimes.length;
      }

      // Create metrics object
      const metrics: PaymentProofMetrics = {
        totalProofs,
        pendingVerification: statusMap['pending_verification'],
        approved: statusMap['approved'],
        rejected: statusMap['rejected'],
        proofFailure: statusMap['proof_failure'],
        averageVerificationTimeHours,
        rejectionRate,
        resubmissionRate: 0, // This would require tracking resubmissions
        failedUploads: 0, // This would require tracking failed uploads
        averageOrderDelayHours: 0 // This would require integration with order data
      };

      return { data: metrics, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

// Export a singleton instance
export default new PaymentProofService();
  /**
   * Get pending verification proofs that have exceeded the timeout threshold
   */
  async getOverdueVerificationProofs(hoursThreshold: number = 48): Promise<{ data: PaymentProof[] | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      // Calculate the cutoff time
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - hoursThreshold);

      const { data, error } = await this.supabase
        .from('payment_proofs')
        .select('*')
        .eq('status', 'pending_verification')
        .lt('created_at', cutoffTime.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        return { data: null, error: new Error(`Failed to fetch overdue payment proofs: ${error.message}`) };
      }

      return { data: data as PaymentProof[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Send notifications for overdue payment proofs
   */
  async sendOverdueVerificationNotifications(hoursThreshold: number = 48): Promise<{ notifiedCount: number; error: Error | null }> {
    if (!this.supabase) {
      return { notifiedCount: 0, error: new Error('Supabase client not initialized') };
    }

    try {
      // Get overdue payment proofs
      const { data: overdueProofs, error: fetchError } = await this.getOverdueVerificationProofs(hoursThreshold);
      
      if (fetchError) {
        return { notifiedCount: 0, error: fetchError };
      }
      
      if (!overdueProofs || overdueProofs.length === 0) {
        return { notifiedCount: 0, error: null };
      }
      
      // In a real implementation, this would integrate with a notification service
      // For now, we'll just log the notifications
      console.log(`Sending notifications for ${overdueProofs.length} overdue payment proofs`);
      
      for (const proof of overdueProofs) {
        console.log(`Notifying admin about overdue payment proof: ${proof.id}`);
        // In a real implementation, this would send actual notifications
        // e.g., email, SMS, or in-app notifications
      }
      
      return { notifiedCount: overdueProofs.length, error: null };
    } catch (error) {
      return { notifiedCount: 0, error: error as Error };
    }
  }

  /**
   * Get payment proof metrics
   */
  async getPaymentProofMetrics(): Promise<{ data: PaymentProofMetrics | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      // Get total counts by status
      const { data: statusCounts, error: countError } = await this.supabase
        .from('payment_proofs')
        .select('status')
        .returns<{ status: PaymentProofStatus }[]>();

      if (countError) {
        return { data: null, error: new Error(`Failed to fetch payment proof counts: ${countError.message}`) };
      }

      // Calculate status counts
      const totalProofs = statusCounts.length;
      const statusMap: Record<PaymentProofStatus, number> = {
        'pending_proof': 0,
        'pending_verification': 0,
        'approved': 0,
        'rejected': 0,
        'proof_failure': 0
      };

      statusCounts.forEach(item => {
        statusMap[item.status] = (statusMap[item.status] || 0) + 1;
      });

      // Calculate rejection rate
      const rejectionRate = totalProofs > 0 ? (statusMap['rejected'] / totalProofs) * 100 : 0;

      // Calculate average verification time (for approved and rejected proofs)
      const { data: verificationTimes, error: timeError } = await this.supabase
        .from('payment_proofs')
        .select('created_at, verified_at')
        .not('verified_at', 'is', null)
        .limit(1000); // Limit to avoid performance issues

      let averageVerificationTimeHours = 0;
      if (!timeError && verificationTimes && verificationTimes.length > 0) {
        let totalHours = 0;
        verificationTimes.forEach(item => {
          const created = new Date(item.created_at);
          const verified = new Date(item.verified_at!);
          const diffHours = (verified.getTime() - created.getTime()) / (1000 * 60 * 60);
          totalHours += diffHours;
        });
        averageVerificationTimeHours = totalHours / verificationTimes.length;
      }

      // Create metrics object
      const metrics: PaymentProofMetrics = {
        totalProofs,
        pendingVerification: statusMap['pending_verification'],
        approved: statusMap['approved'],
        rejected: statusMap['rejected'],
        proofFailure: statusMap['proof_failure'],
        averageVerificationTimeHours,
        rejectionRate,
        resubmissionRate: 0, // This would require tracking resubmissions
        failedUploads: 0, // This would require tracking failed uploads
        averageOrderDelayHours: 0 // This would require integration with order data
      };

      return { data: metrics, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

// Export a singleton instance
export default new PaymentProofService();