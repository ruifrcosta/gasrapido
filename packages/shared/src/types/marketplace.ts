import { z } from 'zod'

// Enums
export const BotijaType = z.enum(['6kg', '12kg', '45kg', 'outros'])
export type BotijaType = z.infer<typeof BotijaType>

export const AvailabilityStatus = z.enum(['available', 'out_of_stock', 'pending_verification'])
export type AvailabilityStatus = z.infer<typeof AvailabilityStatus>

export const ListingType = z.enum(['normal', 'reserva', 'entrega', 'levantamento'])
export type ListingType = z.infer<typeof ListingType>

export const ListingStatus = z.enum(['active', 'inactive', 'suspended'])
export type ListingStatus = z.infer<typeof ListingStatus>

export const PremiumTier = z.enum(['standard', 'premium', 'gold'])
export type PremiumTier = z.infer<typeof PremiumTier>

export const PricingFactorType = z.enum(['weather', 'traffic', 'demand', 'supply', 'time_of_day', 'distance'])
export type PricingFactorType = z.infer<typeof PricingFactorType>

export const FraudEventType = z.enum(['suspicious_order', 'fake_review', 'price_manipulation', 'stock_manipulation'])
export type FraudEventType = z.infer<typeof FraudEventType>

export const FraudEntityType = z.enum(['supplier', 'customer', 'order', 'review'])
export type FraudEntityType = z.infer<typeof FraudEntityType>

export const FraudStatus = z.enum(['pending', 'investigated', 'resolved', 'dismissed'])
export type FraudStatus = z.infer<typeof FraudStatus>

// Enhanced Product Schema
export const MarketplaceProductSchema = z.object({
  id: z.string().uuid(),
  vendor_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable(),
  price_aoa: z.number().positive(),
  botija_type: BotijaType.nullable(),
  stock_quantity: z.number().int().min(0),
  images: z.array(z.string().url()).default([]),
  certification_photos: z.array(z.string().url()).default([]),
  availability_status: AvailabilityStatus.default('available'),
  certification_expiry: z.string().nullable(),
  safety_verified: z.boolean().default(false),
  supplier_rating: z.number().min(0).max(5).default(0),
  total_reviews: z.number().int().min(0).default(0),
  is_available: z.boolean().default(true),
  image_url: z.string().url().nullable(),
  weight_kg: z.number().positive().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type MarketplaceProduct = z.infer<typeof MarketplaceProductSchema>

// Marketplace Listing Schema
export const MarketplaceListingSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  supplier_id: z.string().uuid(),
  price: z.number().positive(),
  delivery_fee: z.number().min(0).default(0),
  listing_type: ListingType,
  reserved: z.boolean().default(false),
  reserved_until: z.string().nullable(),
  reserved_by: z.string().uuid().nullable(),
  status: ListingStatus.default('active'),
  delivery_radius_km: z.number().int().positive().default(10),
  pickup_available: z.boolean().default(false),
  pickup_address: z.string().nullable(),
  estimated_delivery_time: z.number().int().positive().nullable(),
  priority_listing: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
})
export type MarketplaceListing = z.infer<typeof MarketplaceListingSchema>

// Product Review Schema
export const ProductReviewSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  order_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  supplier_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  review_text: z.string().nullable(),
  delivery_rating: z.number().int().min(1).max(5).nullable(),
  product_quality_rating: z.number().int().min(1).max(5).nullable(),
  verified_purchase: z.boolean().default(true),
  helpful_votes: z.number().int().min(0).default(0),
  created_at: z.string(),
  updated_at: z.string(),
})
export type ProductReview = z.infer<typeof ProductReviewSchema>

// Commission Settings Schema
export const MarketplaceCommissionSettingsSchema = z.object({
  id: z.string().uuid(),
  supplier_id: z.string().uuid(),
  commission_rate: z.number().min(0).max(1),
  delivery_commission: z.number().min(0).max(1),
  premium_tier: PremiumTier.default('standard'),
  reduced_commission_rate: z.number().min(0).max(1).nullable(),
  effective_from: z.string(),
  effective_until: z.string().nullable(),
  created_at: z.string(),
})
export type MarketplaceCommissionSettings = z.infer<typeof MarketplaceCommissionSettingsSchema>

// Pricing Factor Schema
export const PricingFactorSchema = z.object({
  id: z.string().uuid(),
  factor_name: z.string().min(1),
  factor_type: PricingFactorType,
  multiplier: z.number().positive(),
  is_active: z.boolean().default(true),
  conditions: z.record(z.any()).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type PricingFactor = z.infer<typeof PricingFactorSchema>

// Order Pricing Breakdown Schema
export const OrderPricingBreakdownSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  base_product_price: z.number().positive(),
  base_delivery_fee: z.number().min(0),
  applied_factors: z.array(z.record(z.any())).default([]),
  total_multiplier: z.number().positive().default(1),
  platform_commission: z.number().min(0),
  supplier_earning: z.number().min(0),
  delivery_earning: z.number().min(0).nullable(),
  final_customer_price: z.number().positive(),
  created_at: z.string(),
})
export type OrderPricingBreakdown = z.infer<typeof OrderPricingBreakdownSchema>

// Marketplace Metrics Schema
export const MarketplaceMetricsSchema = z.object({
  id: z.string().uuid(),
  metric_date: z.string(),
  total_listings: z.number().int().min(0).default(0),
  active_listings: z.number().int().min(0).default(0),
  total_orders: z.number().int().min(0).default(0),
  completed_orders: z.number().int().min(0).default(0),
  cancelled_orders: z.number().int().min(0).default(0),
  total_revenue: z.number().min(0).default(0),
  platform_commission_earned: z.number().min(0).default(0),
  average_delivery_time: z.number().int().positive().nullable(),
  average_order_value: z.number().min(0).default(0),
  supplier_count: z.number().int().min(0).default(0),
  customer_count: z.number().int().min(0).default(0),
  created_at: z.string(),
})
export type MarketplaceMetrics = z.infer<typeof MarketplaceMetricsSchema>

// Supplier Performance Schema
export const SupplierPerformanceSchema = z.object({
  id: z.string().uuid(),
  supplier_id: z.string().uuid(),
  metric_period: z.string(),
  total_orders: z.number().int().min(0).default(0),
  completed_orders: z.number().int().min(0).default(0),
  cancelled_orders: z.number().int().min(0).default(0),
  average_rating: z.number().min(0).max(5).default(0),
  total_revenue: z.number().min(0).default(0),
  response_time_avg: z.number().int().positive().nullable(),
  stock_availability_rate: z.number().min(0).max(1).default(1),
  created_at: z.string(),
})
export type SupplierPerformance = z.infer<typeof SupplierPerformanceSchema>

// Fraud Detection Schema
export const MarketplaceFraudLogSchema = z.object({
  id: z.string().uuid(),
  event_type: FraudEventType,
  entity_type: FraudEntityType,
  entity_id: z.string().uuid(),
  risk_score: z.number().int().min(0).max(100).nullable(),
  details: z.record(z.any()).nullable(),
  status: FraudStatus.default('pending'),
  investigated_by: z.string().uuid().nullable(),
  resolution_notes: z.string().nullable(),
  created_at: z.string(),
  resolved_at: z.string().nullable(),
})
export type MarketplaceFraudLog = z.infer<typeof MarketplaceFraudLogSchema>

// Search and Filter Types
export const ProductSearchFiltersSchema = z.object({
  search: z.string().optional(),
  botija_type: BotijaType.optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  supplier_id: z.string().uuid().optional(),
  availability_status: AvailabilityStatus.optional(),
  listing_type: ListingType.optional(),
  delivery_available: z.boolean().optional(),
  pickup_available: z.boolean().optional(),
  min_rating: z.number().min(0).max(5).optional(),
  max_delivery_time: z.number().int().positive().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    radius_km: z.number().positive().default(20),
  }).optional(),
  sort_by: z.enum(['price_asc', 'price_desc', 'rating', 'delivery_time', 'distance', 'newest']).default('newest'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(20),
})
export type ProductSearchFilters = z.infer<typeof ProductSearchFiltersSchema>

// Marketplace Response Types
export const MarketplaceSearchResultSchema = z.object({
  products: z.array(MarketplaceProductSchema),
  listings: z.array(MarketplaceListingSchema),
  total_count: z.number().int().min(0),
  page: z.number().int().positive(),
  has_more: z.boolean(),
  filters_applied: ProductSearchFiltersSchema,
})
export type MarketplaceSearchResult = z.infer<typeof MarketplaceSearchResultSchema>

// Enhanced Product with Listing Info
export const ProductWithListingSchema = MarketplaceProductSchema.extend({
  listing: MarketplaceListingSchema.optional(),
  reviews: z.array(ProductReviewSchema).optional(),
  supplier_info: z.object({
    id: z.string().uuid(),
    name: z.string(),
    rating: z.number().min(0).max(5),
    total_reviews: z.number().int().min(0),
    response_time_avg: z.number().int().positive().nullable(),
    verified: z.boolean(),
  }).optional(),
  distance_km: z.number().positive().optional(),
  estimated_delivery: z.string().optional(),
})
export type ProductWithListing = z.infer<typeof ProductWithListingSchema>

// Reservation Schema
export const ProductReservationSchema = z.object({
  id: z.string().uuid(),
  listing_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  reservation_expires_at: z.string(),
  pickup_scheduled_for: z.string().optional(),
  pickup_address: z.string(),
  reservation_fee: z.number().min(0).default(0),
  status: z.enum(['active', 'expired', 'cancelled', 'fulfilled']).default('active'),
  created_at: z.string(),
  updated_at: z.string(),
})
export type ProductReservation = z.infer<typeof ProductReservationSchema>

// Cart Item Schema
export const CartItemSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  listing_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  selected_delivery_type: ListingType,
  notes: z.string().optional(),
  price_snapshot: z.number().positive(), // price at time of adding to cart
  delivery_fee_snapshot: z.number().min(0),
  created_at: z.string(),
  updated_at: z.string(),
})
export type CartItem = z.infer<typeof CartItemSchema>

// Order Creation Request
export const CreateMarketplaceOrderSchema = z.object({
  cart_items: z.array(z.object({
    listing_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    delivery_type: ListingType,
    notes: z.string().optional(),
  })),
  delivery_address: z.string().min(1),
  delivery_location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  pickup_locations: z.array(z.object({
    listing_id: z.string().uuid(),
    pickup_address: z.string(),
    scheduled_time: z.string().optional(),
  })).optional(),
  payment_method: z.string().min(1),
  special_instructions: z.string().optional(),
  preferred_delivery_time: z.string().optional(),
})
export type CreateMarketplaceOrder = z.infer<typeof CreateMarketplaceOrderSchema>

// API Response wrapper
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().min(0),
    has_more: z.boolean(),
  }).optional(),
})

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    has_more: boolean
  }
}