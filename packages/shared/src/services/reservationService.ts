import { SupabaseClient } from '@supabase/supabase-js';
import { 
  Reservation, 
  CreateReservationRequest, 
  UploadReservationProofRequest,
  VerifyReservationRequest,
  ReservationStatus,
  ReservationPaymentStatus,
  ReservationType
} from '../types';
import CryptoJS from 'crypto-js';

export interface ReservationMetrics {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  expiredReservations: number;
  rejectedReservations: number;
  averageReservationToPaymentTimeHours: number;
  noShowRate: number;
  cancellationRate: number;
}

export class ReservationService {
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
   * Create a new reservation
   */
  async createReservation(request: CreateReservationRequest): Promise<{ data: Reservation | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .insert({
          user_id: this.supabase.auth.getUser().data.user?.id,
          supplier_id: request.supplierId,
          type: request.type,
          pickup_point: request.pickupPoint,
          delivery_address: request.deliveryAddress,
          scheduled_time: request.scheduledTime,
          amount: request.amount,
          payment_method: request.paymentMethod,
          status: 'pending_reservation',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to create reservation: ${error.message}`) };
      }

      return { data: data as Reservation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get reservations for a user
   */
  async getUserReservations(userId: string): Promise<{ data: Reservation[] | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: new Error(`Failed to fetch reservations: ${error.message}`) };
      }

      return { data: data as Reservation[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get reservation by ID
   */
  async getReservationById(id: string): Promise<{ data: Reservation | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to fetch reservation: ${error.message}`) };
      }

      return { data: data as Reservation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get all pending reservations (for finance/admin)
   */
  async getPendingReservations(): Promise<{ data: Reservation[] | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .select('*')
        .in('status', ['pending_reservation', 'payment_pending'])
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: new Error(`Failed to fetch pending reservations: ${error.message}`) };
      }

      return { data: data as Reservation[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Upload a reservation proof document
   */
  async uploadReservationProof(request: UploadReservationProofRequest): Promise<{ data: Reservation | null; error: Error | null }> {
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
        .from('reservation-proofs')
        .upload(filePath, request.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        return { data: null, error: new Error(`Failed to upload file: ${storageError.message}`) };
      }

      // Then update the reservation record
      const { data, error } = await this.supabase
        .from('reservations')
        .update({
          payment_method: request.paymentMethod,
          payment_status: 'proof_uploaded',
          proof_file_path: filePath,
          proof_uploaded_at: new Date().toISOString()
        })
        .eq('id', request.reservationId)
        .select()
        .single();

      if (error) {
        // If record update fails, try to delete the uploaded file
        await this.supabase.storage.from('reservation-proofs').remove([filePath]);
        return { data: null, error: new Error(`Failed to update reservation record: ${error.message}`) };
      }

      return { data: data as Reservation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Verify a reservation (for finance/admin)
   */
  async verifyReservation(request: VerifyReservationRequest): Promise<{ data: Reservation | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .update({
          status: request.status,
          payment_status: request.paymentStatus,
          verified_by: this.supabase.auth.getUser().data.user?.id,
          verified_at: new Date().toISOString(),
          notes: request.notes
        })
        .eq('id', request.reservationId)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to verify reservation: ${error.message}`) };
      }

      // If the reservation is confirmed, allocate stock
      if (request.status === 'confirmed') {
        await this.allocateStock(request.reservationId);
      }
      
      // If the reservation is rejected or cancelled, release stock
      if (request.status === 'rejected' || request.status === 'cancelled') {
        await this.releaseStock(request.reservationId);
      }

      return { data: data as Reservation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Cancel a reservation (for client) - DEPRECATED: Use cancelReservationWithPolicy instead
   */
  async cancelReservation(id: string): Promise<{ data: Reservation | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .update({
          status: 'cancelled'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to cancel reservation: ${error.message}`) };
      }

      // Release stock for cancelled reservation
      await this.releaseStock(id);

      return { data: data as Reservation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get the public URL for a reservation proof file
   */
  getReservationProofFileUrl(filePath: string): string {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data } = this.supabase.storage
      .from('reservation-proofs')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }

  /**
   * Get pending reservations that have exceeded the timeout threshold
   */
  async getOverdueReservations(hoursThreshold: number = 60): Promise<{ data: Reservation[] | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      // Calculate the cutoff time
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - hoursThreshold);

      const { data, error } = await this.supabase
        .from('reservations')
        .select('*')
        .in('status', ['pending_reservation', 'payment_pending'])
        .lt('created_at', cutoffTime.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        return { data: null, error: new Error(`Failed to fetch overdue reservations: ${error.message}`) };
      }

      return { data: data as Reservation[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Send notifications for overdue reservations
   */
  async sendOverdueReservationNotifications(hoursThreshold: number = 60): Promise<{ notifiedCount: number; error: Error | null }> {
    if (!this.supabase) {
      return { notifiedCount: 0, error: new Error('Supabase client not initialized') };
    }

    try {
      // Get overdue reservations
      const { data: overdueReservations, error: fetchError } = await this.getOverdueReservations(hoursThreshold);
      
      if (fetchError) {
        return { notifiedCount: 0, error: fetchError };
      }
      
      if (!overdueReservations || overdueReservations.length === 0) {
        return { notifiedCount: 0, error: null };
      }
      
      // In a real implementation, this would integrate with a notification service
      // For now, we'll just log the notifications
      console.log(`Sending notifications for ${overdueReservations.length} overdue reservations`);
      
      for (const reservation of overdueReservations) {
        console.log(`Notifying admin about overdue reservation: ${reservation.id}`);
        // In a real implementation, this would send actual notifications
        // e.g., email, SMS, or in-app notifications
      }
      
      return { notifiedCount: overdueReservations.length, error: null };
    } catch (error) {
      return { notifiedCount: 0, error: error as Error };
    }
  }

  /**
   * Get reservation metrics
   */
  async getReservationMetrics(): Promise<{ data: ReservationMetrics | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      // Get total counts by status
      const { data: statusCounts, error: countError } = await this.supabase
        .from('reservations')
        .select('status, payment_status')
        .returns<{ status: ReservationStatus, payment_status: ReservationPaymentStatus }[]>();

      if (countError) {
        return { data: null, error: new Error(`Failed to fetch reservation counts: ${countError.message}`) };
      }

      // Calculate status counts
      const totalReservations = statusCounts.length;
      const statusMap: Record<ReservationStatus, number> = {
        'pending_reservation': 0,
        'payment_pending': 0,
        'proof_uploaded': 0,
        'confirmed': 0,
        'cancelled': 0,
        'expired': 0,
        'rejected': 0
      };

      statusCounts.forEach((item: { status: ReservationStatus }) => {
        statusMap[item.status] = (statusMap[item.status] || 0) + 1;
      });

      // Calculate rates
      const cancellationRate = totalReservations > 0 ? (statusMap['cancelled'] / totalReservations) * 100 : 0;
      const noShowRate = totalReservations > 0 ? (statusMap['expired'] / totalReservations) * 100 : 0;

      // Calculate average reservation to payment time (for confirmed reservations)
      const { data: paymentTimes, error: timeError } = await this.supabase
        .from('reservations')
        .select('created_at, verified_at')
        .eq('status', 'confirmed')
        .not('verified_at', 'is', null)
        .limit(1000); // Limit to avoid performance issues

      let averageReservationToPaymentTimeHours = 0;
      if (!timeError && paymentTimes && paymentTimes.length > 0) {
        let totalHours = 0;
        paymentTimes.forEach((item: { created_at: string, verified_at: string }) => {
          const created = new Date(item.created_at);
          const verified = new Date(item.verified_at);
          const diffHours = (verified.getTime() - created.getTime()) / (1000 * 60 * 60);
          totalHours += diffHours;
        });
        averageReservationToPaymentTimeHours = totalHours / paymentTimes.length;
      }

      // Create metrics object
      const metrics: ReservationMetrics = {
        totalReservations,
        pendingReservations: statusMap['pending_reservation'],
        confirmedReservations: statusMap['confirmed'],
        cancelledReservations: statusMap['cancelled'],
        expiredReservations: statusMap['expired'],
        rejectedReservations: statusMap['rejected'],
        averageReservationToPaymentTimeHours,
        noShowRate,
        cancellationRate
      };

      return { data: metrics, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Process overdue reservations and expire them according to business rules
   */
  async processOverdueReservations(): Promise<{ processedCount: number; error: Error | null }> {
    if (!this.supabase) {
      return { processedCount: 0, error: new Error('Supabase client not initialized') };
    }

    try {
      // Get reservations that are overdue for payment confirmation
      const { data: overdueForPayment, error: paymentError } = await this.getOverdueReservations(60);
      
      if (paymentError) {
        return { processedCount: 0, error: paymentError };
      }

      let processedCount = 0;

      // Expire reservations that are overdue for payment
      if (overdueForPayment && overdueForPayment.length > 0) {
        for (const reservation of overdueForPayment) {
          const { error: expireError } = await this.expireReservation(reservation.id);
          if (!expireError) {
            processedCount++;
            // Release stock for expired reservation
            await this.releaseStock(reservation.id);
          }
        }
      }

      // Get reservations that are overdue for pickup
      const { data: allReservations, error: allError } = await this.supabase
        .from('reservations')
        .select('*')
        .eq('type', 'levantamento')
        .eq('status', 'confirmed');

      if (allError) {
        return { processedCount, error: allError };
      }

      // Check each pickup reservation for overdue status
      if (allReservations && allReservations.length > 0) {
        for (const reservation of allReservations) {
          const { isOverdue } = await this.isPickupOverdue(reservation.id);
          if (isOverdue) {
            const { error: expireError } = await this.handleOverduePickup(reservation.id);
            if (!expireError) {
              processedCount++;
              // Release stock for expired reservation
              await this.releaseStock(reservation.id);
            }
          }
        }
      }

      return { processedCount, error: null };
    } catch (error) {
      return { processedCount: 0, error: error as Error };
    }
  }

  /**
   * Expire a reservation that has passed its scheduled time
   */
  async expireReservation(id: string): Promise<{ data: Reservation | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .update({
          status: 'expired'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to expire reservation: ${error.message}`) };
      }

      return { data: data as Reservation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Check if a reservation can be cancelled based on business rules
   */
  async canCancelReservation(id: string, userId: string): Promise<{ canCancel: boolean; reason?: string }> {
    if (!this.supabase) {
      return { canCancel: false, reason: 'Supabase client not initialized' };
    }

    try {
      const { data: reservation, error } = await this.supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !reservation) {
        return { canCancel: false, reason: 'Reservation not found or access denied' };
      }

      // Check if reservation is already in a terminal state
      const terminalStates: ReservationStatus[] = ['cancelled', 'expired', 'confirmed', 'rejected'];
      if (terminalStates.includes(reservation.status as ReservationStatus)) {
        return { canCancel: false, reason: 'Reservation is already in a terminal state' };
      }

      // Check if reservation is past the scheduled time
      const scheduledTime = new Date(reservation.scheduled_time);
      const now = new Date();
      
      if (scheduledTime < now) {
        return { canCancel: false, reason: 'Reservation time has already passed' };
      }

      // For pickup reservations, check if within cancellation window
      if (reservation.type === 'levantamento') {
        const hoursUntilPickup = (scheduledTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        // Allow cancellation up to 2 hours before pickup
        if (hoursUntilPickup < 2) {
          return { canCancel: false, reason: 'Too close to pickup time to cancel' };
        }
      }

      return { canCancel: true };
    } catch (error) {
      return { canCancel: false, reason: 'Error checking cancellation eligibility' };
    }
  }

  /**
   * Cancel a reservation with business rule validation
   */
  async cancelReservationWithPolicy(id: string, userId: string, reason?: string): Promise<{ data: Reservation | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    // Check if cancellation is allowed
    const { canCancel, reason: cancelReason } = await this.canCancelReservation(id, userId);
    
    if (!canCancel) {
      return { data: null, error: new Error(`Cannot cancel reservation: ${cancelReason}`) };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .update({
          status: 'cancelled',
          notes: reason ? `${reason}${data?.notes ? ` - ${data.notes}` : ''}` : data?.notes
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to cancel reservation: ${error.message}`) };
      }

      return { data: data as Reservation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Check if a reservation has expired based on business rules
   */
  async isReservationExpired(id: string): Promise<{ isExpired: boolean; reason?: string }> {
    if (!this.supabase) {
      return { isExpired: false, reason: 'Supabase client not initialized' };
    }

    try {
      const { data: reservation, error } = await this.supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !reservation) {
        return { isExpired: false, reason: 'Reservation not found' };
      }

      // Already expired reservations
      if (reservation.status === 'expired') {
        return { isExpired: true, reason: 'Reservation already expired' };
      }

      // Check if reservation time has passed
      const scheduledTime = new Date(reservation.scheduled_time);
      const now = new Date();

      if (scheduledTime < now) {
        // For pickup reservations, give a grace period
        if (reservation.type === 'levantamento') {
          const gracePeriodEnd = new Date(scheduledTime.getTime() + 30 * 60 * 1000); // 30 minutes grace
          if (now > gracePeriodEnd) {
            return { isExpired: true, reason: 'Pickup time has passed grace period' };
          }
        } else {
          // For delivery reservations, expire immediately after scheduled time
          return { isExpired: true, reason: 'Delivery time has passed' };
        }
      }

      // Check if pending reservations have timed out for payment
      const pendingStates: ReservationStatus[] = ['pending_reservation', 'payment_pending'];
      if (pendingStates.includes(reservation.status as ReservationStatus)) {
        const createdTime = new Date(reservation.created_at);
        const paymentTimeout = new Date(createdTime.getTime() + 60 * 60 * 1000); // 60 minutes timeout
        
        if (now > paymentTimeout) {
          return { isExpired: true, reason: 'Payment confirmation timeout' };
        }
      }

      return { isExpired: false };
    } catch (error) {
      return { isExpired: false, reason: 'Error checking reservation expiry' };
    }
  }

  /**
   * Check if a reservation is overdue for pickup
   */
  async isPickupOverdue(id: string): Promise<{ isOverdue: boolean; hoursOverdue?: number }> {
    if (!this.supabase) {
      return { isOverdue: false };
    }

    try {
      const { data: reservation, error } = await this.supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !reservation) {
        return { isOverdue: false };
      }

      // Only check for pickup reservations that are confirmed
      if (reservation.type !== 'levantamento' || reservation.status !== 'confirmed') {
        return { isOverdue: false };
      }

      const scheduledTime = new Date(reservation.scheduled_time);
      const now = new Date();
      
      // Add a 30-minute grace period
      const pickupDeadline = new Date(scheduledTime.getTime() + 30 * 60 * 1000);
      
      if (now > pickupDeadline) {
        const hoursOverdue = (now.getTime() - pickupDeadline.getTime()) / (1000 * 60 * 60);
        return { isOverdue: true, hoursOverdue };
      }

      return { isOverdue: false };
    } catch (error) {
      return { isOverdue: false };
    }
  }

  /**
   * Handle overdue pickup by expiring the reservation
   */
  async handleOverduePickup(id: string): Promise<{ data: Reservation | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    const { isOverdue } = await this.isPickupOverdue(id);
    
    if (!isOverdue) {
      return { data: null, error: new Error('Reservation is not overdue for pickup') };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .update({
          status: 'expired',
          notes: data?.notes ? `${data.notes} - Pickup not collected within time window` : 'Pickup not collected within time window'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to expire overdue pickup: ${error.message}`) };
      }

      return { data: data as Reservation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Allocate stock for a confirmed reservation
   * In a real implementation, this would integrate with an inventory system
   */
  async allocateStock(reservationId: string): Promise<{ success: boolean; error?: Error }> {
    if (!this.supabase) {
      return { success: false, error: new Error('Supabase client not initialized') };
    }

    try {
      // In a real implementation, this would:
      // 1. Get the product details from the reservation
      // 2. Reserve stock in the supplier's inventory system
      // 3. Update stock levels
      
      // For now, we'll just log the allocation
      console.log(`Stock allocated for reservation: ${reservationId}`);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Release stock for a cancelled or expired reservation
   * In a real implementation, this would integrate with an inventory system
   */
  async releaseStock(reservationId: string): Promise<{ success: boolean; error?: Error }> {
    if (!this.supabase) {
      return { success: false, error: new Error('Supabase client not initialized') };
    }

    try {
      // In a real implementation, this would:
      // 1. Get the product details from the reservation
      // 2. Release reserved stock in the supplier's inventory system
      // 3. Update stock levels
      
      // For now, we'll just log the release
      console.log(`Stock released for reservation: ${reservationId}`);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

// Export a singleton instance
export default new ReservationService();    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Process overdue reservations and expire them according to business rules
   */
  async processOverdueReservations(): Promise<{ processedCount: number; error: Error | null }> {
    if (!this.supabase) {
      return { processedCount: 0, error: new Error('Supabase client not initialized') };
    }

    try {
      // Get reservations that are overdue for payment confirmation
      const { data: overdueForPayment, error: paymentError } = await this.getOverdueReservations(60);
      
      if (paymentError) {
        return { processedCount: 0, error: paymentError };
      }

      let processedCount = 0;

      // Expire reservations that are overdue for payment
      if (overdueForPayment && overdueForPayment.length > 0) {
        for (const reservation of overdueForPayment) {
          const { error: expireError } = await this.expireReservation(reservation.id);
          if (!expireError) {
            processedCount++;
            // Release stock for expired reservation
            await this.releaseStock(reservation.id);
          }
        }
      }

      // Get reservations that are overdue for pickup
      const { data: allReservations, error: allError } = await this.supabase
        .from('reservations')
        .select('*')
        .eq('type', 'levantamento')
        .eq('status', 'confirmed');

      if (allError) {
        return { processedCount, error: allError };
      }

      // Check each pickup reservation for overdue status
      if (allReservations && allReservations.length > 0) {
        for (const reservation of allReservations) {
          const { isOverdue } = await this.isPickupOverdue(reservation.id);
          if (isOverdue) {
            const { error: expireError } = await this.handleOverduePickup(reservation.id);
            if (!expireError) {
              processedCount++;
              // Release stock for expired reservation
              await this.releaseStock(reservation.id);
            }
          }
        }
      }

      return { processedCount, error: null };
    } catch (error) {
      return { processedCount: 0, error: error as Error };
    }
  }

  /**
   * Expire a reservation that has passed its scheduled time
   */
  async expireReservation(id: string): Promise<{ data: Reservation | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .update({
          status: 'expired'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to expire reservation: ${error.message}`) };
      }

      return { data: data as Reservation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Check if a reservation can be cancelled based on business rules
   */
  async canCancelReservation(id: string, userId: string): Promise<{ canCancel: boolean; reason?: string }> {
    if (!this.supabase) {
      return { canCancel: false, reason: 'Supabase client not initialized' };
    }

    try {
      const { data: reservation, error } = await this.supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !reservation) {
        return { canCancel: false, reason: 'Reservation not found or access denied' };
      }

      // Check if reservation is already in a terminal state
      const terminalStates: ReservationStatus[] = ['cancelled', 'expired', 'confirmed', 'rejected'];
      if (terminalStates.includes(reservation.status as ReservationStatus)) {
        return { canCancel: false, reason: 'Reservation is already in a terminal state' };
      }

      // Check if reservation is past the scheduled time
      const scheduledTime = new Date(reservation.scheduled_time);
      const now = new Date();
      
      if (scheduledTime < now) {
        return { canCancel: false, reason: 'Reservation time has already passed' };
      }

      // For pickup reservations, check if within cancellation window
      if (reservation.type === 'levantamento') {
        const hoursUntilPickup = (scheduledTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        // Allow cancellation up to 2 hours before pickup
        if (hoursUntilPickup < 2) {
          return { canCancel: false, reason: 'Too close to pickup time to cancel' };
        }
      }

      return { canCancel: true };
    } catch (error) {
      return { canCancel: false, reason: 'Error checking cancellation eligibility' };
    }
  }

  /**
   * Cancel a reservation with business rule validation
   */
  async cancelReservationWithPolicy(id: string, userId: string, reason?: string): Promise<{ data: Reservation | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    // Check if cancellation is allowed
    const { canCancel, reason: cancelReason } = await this.canCancelReservation(id, userId);
    
    if (!canCancel) {
      return { data: null, error: new Error(`Cannot cancel reservation: ${cancelReason}`) };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .update({
          status: 'cancelled',
          notes: reason ? `${reason}${data?.notes ? ` - ${data.notes}` : ''}` : data?.notes
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to cancel reservation: ${error.message}`) };
      }

      return { data: data as Reservation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Check if a reservation has expired based on business rules
   */
  async isReservationExpired(id: string): Promise<{ isExpired: boolean; reason?: string }> {
    if (!this.supabase) {
      return { isExpired: false, reason: 'Supabase client not initialized' };
    }

    try {
      const { data: reservation, error } = await this.supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !reservation) {
        return { isExpired: false, reason: 'Reservation not found' };
      }

      // Already expired reservations
      if (reservation.status === 'expired') {
        return { isExpired: true, reason: 'Reservation already expired' };
      }

      // Check if reservation time has passed
      const scheduledTime = new Date(reservation.scheduled_time);
      const now = new Date();

      if (scheduledTime < now) {
        // For pickup reservations, give a grace period
        if (reservation.type === 'levantamento') {
          const gracePeriodEnd = new Date(scheduledTime.getTime() + 30 * 60 * 1000); // 30 minutes grace
          if (now > gracePeriodEnd) {
            return { isExpired: true, reason: 'Pickup time has passed grace period' };
          }
        } else {
          // For delivery reservations, expire immediately after scheduled time
          return { isExpired: true, reason: 'Delivery time has passed' };
        }
      }

      // Check if pending reservations have timed out for payment
      const pendingStates: ReservationStatus[] = ['pending_reservation', 'payment_pending'];
      if (pendingStates.includes(reservation.status as ReservationStatus)) {
        const createdTime = new Date(reservation.created_at);
        const paymentTimeout = new Date(createdTime.getTime() + 60 * 60 * 1000); // 60 minutes timeout
        
        if (now > paymentTimeout) {
          return { isExpired: true, reason: 'Payment confirmation timeout' };
        }
      }

      return { isExpired: false };
    } catch (error) {
      return { isExpired: false, reason: 'Error checking reservation expiry' };
    }
  }

  /**
   * Check if a reservation is overdue for pickup
   */
  async isPickupOverdue(id: string): Promise<{ isOverdue: boolean; hoursOverdue?: number }> {
    if (!this.supabase) {
      return { isOverdue: false };
    }

    try {
      const { data: reservation, error } = await this.supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !reservation) {
        return { isOverdue: false };
      }

      // Only check for pickup reservations that are confirmed
      if (reservation.type !== 'levantamento' || reservation.status !== 'confirmed') {
        return { isOverdue: false };
      }

      const scheduledTime = new Date(reservation.scheduled_time);
      const now = new Date();
      
      // Add a 30-minute grace period
      const pickupDeadline = new Date(scheduledTime.getTime() + 30 * 60 * 1000);
      
      if (now > pickupDeadline) {
        const hoursOverdue = (now.getTime() - pickupDeadline.getTime()) / (1000 * 60 * 60);
        return { isOverdue: true, hoursOverdue };
      }

      return { isOverdue: false };
    } catch (error) {
      return { isOverdue: false };
    }
  }

  /**
   * Handle overdue pickup by expiring the reservation
   */
  async handleOverduePickup(id: string): Promise<{ data: Reservation | null; error: Error | null }> {
    if (!this.supabase) {
      return { data: null, error: new Error('Supabase client not initialized') };
    }

    const { isOverdue } = await this.isPickupOverdue(id);
    
    if (!isOverdue) {
      return { data: null, error: new Error('Reservation is not overdue for pickup') };
    }

    try {
      const { data, error } = await this.supabase
        .from('reservations')
        .update({
          status: 'expired',
          notes: data?.notes ? `${data.notes} - Pickup not collected within time window` : 'Pickup not collected within time window'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(`Failed to expire overdue pickup: ${error.message}`) };
      }

      return { data: data as Reservation, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Allocate stock for a confirmed reservation
   * In a real implementation, this would integrate with an inventory system
   */
  async allocateStock(reservationId: string): Promise<{ success: boolean; error?: Error }> {
    if (!this.supabase) {
      return { success: false, error: new Error('Supabase client not initialized') };
    }

    try {
      // In a real implementation, this would:
      // 1. Get the product details from the reservation
      // 2. Reserve stock in the supplier's inventory system
      // 3. Update stock levels
      
      // For now, we'll just log the allocation
      console.log(`Stock allocated for reservation: ${reservationId}`);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Release stock for a cancelled or expired reservation
   * In a real implementation, this would integrate with an inventory system
   */
  async releaseStock(reservationId: string): Promise<{ success: boolean; error?: Error }> {
    if (!this.supabase) {
      return { success: false, error: new Error('Supabase client not initialized') };
    }

    try {
      // In a real implementation, this would:
      // 1. Get the product details from the reservation
      // 2. Release reserved stock in the supplier's inventory system
      // 3. Update stock levels
      
      // For now, we'll just log the release
      console.log(`Stock released for reservation: ${reservationId}`);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

// Export a singleton instance
export default new ReservationService();