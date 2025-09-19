import { z } from 'zod';

// User Role Enum
export const UserRole = z.enum(['admin', 'vendor', 'courier', 'client']);
export type UserRole = z.infer<typeof UserRole>;

// Order Status Enum  
export const OrderStatus = z.enum(['pending', 'confirmed', 'preparing', 'in_transit', 'delivered', 'cancelled']);
export type OrderStatus = z.infer<typeof OrderStatus>;

// Payment Status Enum
export const PaymentStatus = z.enum(['pending', 'processing', 'completed', 'failed', 'refunded']);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

// Payment Method Enum
export const PaymentMethod = z.enum(['cash', 'multicaixa', 'card', 'wallet']);
export type PaymentMethod = z.infer<typeof PaymentMethod>;

// Reservation Type Enum
export const ReservationType = z.enum(['entrega', 'levantamento']);
export type ReservationType = z.infer<typeof ReservationType>;

// Reservation Payment Status Enum
export const ReservationPaymentStatus = z.enum(['pending', 'paid', 'proof_uploaded', 'failed', 'rejected']);
export type ReservationPaymentStatus = z.infer<typeof ReservationPaymentStatus>;

// Reservation Status Enum
export const ReservationStatus = z.enum(['pending_reservation', 'payment_pending', 'proof_uploaded', 'confirmed', 'cancelled', 'expired', 'rejected']);
export type ReservationStatus = z.infer<typeof ReservationStatus>;

// Base User Profile
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  phone: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  role: UserRole,
  is_active: z.boolean(),
  address: z.string().nullable(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Profile = z.infer<typeof ProfileSchema>;

// Vendor Schema
export const VendorSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  business_name: z.string(),
  license_number: z.string().nullable(),
  tax_id: z.string().nullable(),
  description: z.string().nullable(),
  address: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  operating_hours: z.record(z.string()).nullable(),
  is_verified: z.boolean(),
  is_active: z.boolean(),
  rating: z.number().min(0).max(5),
  total_orders: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Vendor = z.infer<typeof VendorSchema>;

// Courier Schema
export const CourierSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  vehicle_type: z.string().nullable(),
  license_plate: z.string().nullable(),
  driver_license: z.string().nullable(),
  vehicle_registration: z.string().nullable(),
  is_verified: z.boolean(),
  is_available: z.boolean(),
  current_location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).nullable(),
  rating: z.number().min(0).max(5),
  total_deliveries: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Courier = z.infer<typeof CourierSchema>;

// Product Schema
export const ProductSchema = z.object({
  id: z.string().uuid(),
  vendor_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  weight_kg: z.number().nullable(),
  price_aoa: z.number(),
  stock_quantity: z.number(),
  is_available: z.boolean(),
  image_url: z.string().url().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Product = z.infer<typeof ProductSchema>;

// Order Schema
export const OrderSchema = z.object({
  id: z.string().uuid(),
  order_number: z.string(),
  customer_id: z.string().uuid(),
  vendor_id: z.string().uuid(),
  courier_id: z.string().uuid().nullable(),
  product_id: z.string().uuid(),
  quantity: z.number().positive(),
  unit_price: z.number(),
  total_amount: z.number(),
  delivery_fee: z.number(),
  final_amount: z.number(),
  status: OrderStatus,
  delivery_address: z.string(),
  delivery_location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  pickup_address: z.string().nullable(),
  pickup_location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).nullable(),
  estimated_delivery: z.string().nullable(),
  delivered_at: z.string().nullable(),
  special_instructions: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Order = z.infer<typeof OrderSchema>;

// Payment Schema
export const PaymentSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  amount: z.number(),
  method: PaymentMethod,
  status: PaymentStatus,
  transaction_id: z.string().nullable(),
  multicaixa_reference: z.string().nullable(),
  payment_provider: z.string().nullable(),
  provider_response: z.record(z.any()).nullable(),
  processed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Payment = z.infer<typeof PaymentSchema>;

// Notification Schema
export const NotificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  message: z.string(),
  type: z.string().nullable(),
  data: z.record(z.any()).nullable(),
  is_read: z.boolean(),
  sent_at: z.string(),
  read_at: z.string().nullable(),
});
export type Notification = z.infer<typeof NotificationSchema>;

// Review Schema
export const ReviewSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  reviewer_id: z.string().uuid(),
  vendor_id: z.string().uuid().nullable(),
  courier_id: z.string().uuid().nullable(),
  rating: z.number().min(1).max(5),
  comment: z.string().nullable(),
  created_at: z.string(),
});
export type Review = z.infer<typeof ReviewSchema>;

// Create Order Request
export const CreateOrderRequestSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().positive(),
  deliveryAddress: z.string(),
  deliveryLocation: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  specialInstructions: z.string().optional(),
});
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;

// Process Payment Request
export const ProcessPaymentRequestSchema = z.object({
  orderId: z.string().uuid(),
  paymentMethod: PaymentMethod,
  multicaixaReference: z.string().optional(),
});
export type ProcessPaymentRequest = z.infer<typeof ProcessPaymentRequestSchema>;

// Payment Method With Proof Enum
export const PaymentMethodWithProof = z.enum([
  'multicaixa_express',
  'kwik',
  'unitel_money',
  'paypay',
  'bank_transfer'
]);
export type PaymentMethodWithProof = z.infer<typeof PaymentMethodWithProof>;

// Payment Proof Status Enum
export const PaymentProofStatus = z.enum([
  'pending_proof',
  'pending_verification',
  'approved',
  'rejected',
  'proof_failure'
]);
export type PaymentProofStatus = z.infer<typeof PaymentProofStatus>;

// Payment Proof Schema
export const PaymentProofSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  order_id: z.string().uuid(),
  payment_method: PaymentMethodWithProof,
  amount: z.number(),
  currency: z.string().default('AOA'),
  status: PaymentProofStatus,
  uploaded_at: z.string(),
  verified_by: z.string().uuid().nullable(),
  verified_at: z.string().nullable(),
  rejection_reason: z.string().nullable(),
  file_path: z.string(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type PaymentProof = z.infer<typeof PaymentProofSchema>;

// Upload Payment Proof Request
export const UploadPaymentProofRequestSchema = z.object({
  orderId: z.string().uuid(),
  paymentMethod: PaymentMethodWithProof,
  amount: z.number(),
  file: z.instanceof(File),
  notes: z.string().optional(),
});
export type UploadPaymentProofRequest = z.infer<typeof UploadPaymentProofRequestSchema>;

// Verify Payment Proof Request
export const VerifyPaymentProofRequestSchema = z.object({
  paymentProofId: z.string().uuid(),
  status: PaymentProofStatus,
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
});
export type VerifyPaymentProofRequest = z.infer<typeof VerifyPaymentProofRequestSchema>;

// Reservation Schema
export const ReservationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  supplier_id: z.string().uuid().nullable(),
  type: ReservationType,
  requested_at: z.string(),
  pickup_point: z.string().nullable(),
  delivery_address: z.record(z.any()).nullable(),
  scheduled_time: z.string(),
  amount: z.number(),
  currency: z.string().default('AOA'),
  payment_method: z.string().nullable(),
  payment_status: ReservationPaymentStatus,
  proof_file_path: z.string().nullable(),
  proof_uploaded_at: z.string().nullable(),
  verified_by: z.string().uuid().nullable(),
  verified_at: z.string().nullable(),
  status: ReservationStatus,
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Reservation = z.infer<typeof ReservationSchema>;

// Create Reservation Request
export const CreateReservationRequestSchema = z.object({
  supplierId: z.string().uuid().nullable(),
  type: ReservationType,
  pickupPoint: z.string().optional(),
  deliveryAddress: z.record(z.any()).optional(),
  scheduledTime: z.string(),
  amount: z.number(),
  paymentMethod: z.string(),
});
export type CreateReservationRequest = z.infer<typeof CreateReservationRequestSchema>;

// Upload Reservation Proof Request
export const UploadReservationProofRequestSchema = z.object({
  reservationId: z.string().uuid(),
  paymentMethod: z.string(),
  amount: z.number(),
  file: z.instanceof(File),
  notes: z.string().optional(),
});
export type UploadReservationProofRequest = z.infer<typeof UploadReservationProofRequestSchema>;

// Verify Reservation Request
export const VerifyReservationRequestSchema = z.object({
  reservationId: z.string().uuid(),
  status: ReservationStatus,
  paymentStatus: ReservationPaymentStatus,
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
});
export type VerifyReservationRequest = z.infer<typeof VerifyReservationRequestSchema>;