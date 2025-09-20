import { SupabaseClient } from '@supabase/supabase-js'
import type {
  MarketplaceProduct,
  MarketplaceListing,
  ProductReview,
  ProductSearchFilters,
  MarketplaceSearchResult,
  ProductWithListing,
  CreateMarketplaceOrder,
  ProductReservation,
  CartItem,
  PricingFactor,
  OrderPricingBreakdown,
  MarketplaceCommissionSettings,
  ApiResponse
} from '../types/marketplace'

export class MarketplaceService {
  constructor(private supabase: SupabaseClient) {}

  // ==================== PRODUCT LISTING MANAGEMENT ====================

  /**
   * Search and filter products in the marketplace
   */
  async searchProducts(filters: ProductSearchFilters): Promise<ApiResponse<MarketplaceSearchResult>> {
    try {
      let query = this.supabase
        .from('marketplace_listings')
        .select(`
          *,
          products:product_id (
            *,
            vendors:vendor_id (
              id,
              business_name,
              rating,
              total_reviews,
              is_verified
            )
          )
        `)
        .eq('status', 'active')

      // Apply filters
      if (filters.search) {
        query = query.ilike('products.name', `%${filters.search}%`)
      }

      if (filters.botija_type) {
        query = query.eq('products.botija_type', filters.botija_type)
      }

      if (filters.min_price) {
        query = query.gte('price', filters.min_price)
      }

      if (filters.max_price) {
        query = query.lte('price', filters.max_price)
      }

      if (filters.supplier_id) {
        query = query.eq('supplier_id', filters.supplier_id)
      }

      if (filters.listing_type) {
        query = query.eq('listing_type', filters.listing_type)
      }

      if (filters.delivery_available !== undefined) {
        if (filters.delivery_available) {
          query = query.in('listing_type', ['normal', 'entrega'])
        }
      }

      if (filters.pickup_available !== undefined) {
        query = query.eq('pickup_available', filters.pickup_available)
      }

      if (filters.max_delivery_time) {
        query = query.lte('estimated_delivery_time', filters.max_delivery_time)
      }

      // Apply sorting
      switch (filters.sort_by) {
        case 'price_asc':
          query = query.order('price', { ascending: true })
          break
        case 'price_desc':
          query = query.order('price', { ascending: false })
          break
        case 'rating':
          query = query.order('products.supplier_rating', { ascending: false })
          break
        case 'delivery_time':
          query = query.order('estimated_delivery_time', { ascending: true })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }

      // Apply pagination
      const offset = (filters.page - 1) * filters.limit
      query = query.range(offset, offset + filters.limit - 1)

      const { data, error, count } = await query

      if (error) {
        throw new Error(`Search failed: ${error.message}`)
      }

      // Transform data to include product and listing info
      const products: ProductWithListing[] = data?.map((item: any) => ({
        ...item.products,
        listing: {
          id: item.id,
          product_id: item.product_id,
          supplier_id: item.supplier_id,
          price: item.price,
          delivery_fee: item.delivery_fee,
          listing_type: item.listing_type,
          reserved: item.reserved,
          reserved_until: item.reserved_until,
          reserved_by: item.reserved_by,
          status: item.status,
          delivery_radius_km: item.delivery_radius_km,
          pickup_available: item.pickup_available,
          pickup_address: item.pickup_address,
          estimated_delivery_time: item.estimated_delivery_time,
          priority_listing: item.priority_listing,
          created_at: item.created_at,
          updated_at: item.updated_at,
        },
        supplier_info: item.products.vendors ? {
          id: item.products.vendors.id,
          name: item.products.vendors.business_name,
          rating: item.products.vendors.rating || 0,
          total_reviews: item.products.vendors.total_reviews || 0,
          response_time_avg: null,
          verified: item.products.vendors.is_verified || false,
        } : undefined,
      })) || []

      return {
        success: true,
        data: {
          products,
          listings: [],
          total_count: count || 0,
          page: filters.page,
          has_more: (count || 0) > filters.page * filters.limit,
          filters_applied: filters,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to search products',
      }
    }
  }

  /**
   * Get detailed product information with reviews
   */
  async getProductDetails(productId: string): Promise<ApiResponse<ProductWithListing>> {
    try {
      const { data: product, error: productError } = await this.supabase
        .from('products')
        .select(`
          *,
          vendors:vendor_id (
            id,
            business_name,
            rating,
            total_reviews,
            is_verified
          ),
          marketplace_listings!inner (
            *
          )
        `)
        .eq('id', productId)
        .eq('marketplace_listings.status', 'active')
        .single()

      if (productError) {
        throw new Error(`Product not found: ${productError.message}`)
      }

      // Get product reviews
      const { data: reviews, error: reviewsError } = await this.supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (reviewsError) {
        console.warn('Failed to load reviews:', reviewsError.message)
      }

      const productWithDetails: ProductWithListing = {
        ...product,
        listing: product.marketplace_listings[0],
        reviews: reviews || [],
        supplier_info: product.vendors ? {
          id: product.vendors.id,
          name: product.vendors.business_name,
          rating: product.vendors.rating || 0,
          total_reviews: product.vendors.total_reviews || 0,
          response_time_avg: null,
          verified: product.vendors.is_verified || false,
        } : undefined,
      }

      return {
        success: true,
        data: productWithDetails,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get product details',
      }
    }
  }

  // ==================== CART MANAGEMENT ====================

  /**
   * Add item to cart
   */
  async addToCart(
    customerId: string,
    listingId: string,
    quantity: number,
    deliveryType: 'normal' | 'reserva' | 'entrega' | 'levantamento'
  ): Promise<ApiResponse<CartItem>> {
    try {
      // Get listing details for price snapshot
      const { data: listing, error: listingError } = await this.supabase
        .from('marketplace_listings')
        .select('*, products(*)')
        .eq('id', listingId)
        .eq('status', 'active')
        .single()

      if (listingError || !listing) {
        throw new Error('Listing not found or inactive')
      }

      // Check if item already exists in cart
      const { data: existingItem } = await this.supabase
        .from('cart_items')
        .select('*')
        .eq('customer_id', customerId)
        .eq('listing_id', listingId)
        .single()

      if (existingItem) {
        // Update quantity
        const { data: updatedItem, error: updateError } = await this.supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + quantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingItem.id)
          .select()
          .single()

        if (updateError) {
          throw new Error(`Failed to update cart: ${updateError.message}`)
        }

        return {
          success: true,
          data: updatedItem,
          message: 'Cart updated successfully',
        }
      } else {
        // Add new item
        const { data: newItem, error: insertError } = await this.supabase
          .from('cart_items')
          .insert({
            customer_id: customerId,
            listing_id: listingId,
            product_id: listing.product_id,
            quantity,
            selected_delivery_type: deliveryType,
            price_snapshot: listing.price,
            delivery_fee_snapshot: listing.delivery_fee,
          })
          .select()
          .single()

        if (insertError) {
          throw new Error(`Failed to add to cart: ${insertError.message}`)
        }

        return {
          success: true,
          data: newItem,
          message: 'Item added to cart successfully',
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add to cart',
      }
    }
  }

  /**
   * Get user's cart items
   */
  async getCartItems(customerId: string): Promise<ApiResponse<CartItem[]>> {
    try {
      const { data, error } = await this.supabase
        .from('cart_items')
        .select(`
          *,
          marketplace_listings:listing_id (
            *,
            products:product_id (*)
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to get cart: ${error.message}`)
      }

      return {
        success: true,
        data: data || [],
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get cart items',
      }
    }
  }

  // ==================== RESERVATION SYSTEM ====================

  /**
   * Create a product reservation
   */
  async createReservation(
    customerId: string,
    listingId: string,
    quantity: number,
    pickupAddress: string,
    scheduledPickupTime?: string
  ): Promise<ApiResponse<ProductReservation>> {
    try {
      // Check if listing supports reservations
      const { data: listing, error: listingError } = await this.supabase
        .from('marketplace_listings')
        .select('*')
        .eq('id', listingId)
        .eq('status', 'active')
        .in('listing_type', ['reserva', 'levantamento'])
        .single()

      if (listingError || !listing) {
        throw new Error('Listing not available for reservation')
      }

      // Check if already reserved
      if (listing.reserved) {
        throw new Error('Product is already reserved')
      }

      // Calculate reservation expiry (24 hours from now)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      // Create reservation
      const { data: reservation, error: reservationError } = await this.supabase
        .from('product_reservations')
        .insert({
          listing_id: listingId,
          customer_id: customerId,
          quantity,
          reservation_expires_at: expiresAt.toISOString(),
          pickup_scheduled_for: scheduledPickupTime,
          pickup_address: pickupAddress,
          reservation_fee: listing.price * 0.1, // 10% reservation fee
        })
        .select()
        .single()

      if (reservationError) {
        throw new Error(`Failed to create reservation: ${reservationError.message}`)
      }

      // Mark listing as reserved
      await this.supabase
        .from('marketplace_listings')
        .update({
          reserved: true,
          reserved_until: expiresAt.toISOString(),
          reserved_by: customerId,
        })
        .eq('id', listingId)

      return {
        success: true,
        data: reservation,
        message: 'Reservation created successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create reservation',
      }
    }
  }

  // ==================== PRICING AND COMMISSION ====================

  /**
   * Calculate dynamic pricing for a product
   */
  async calculateDynamicPrice(
    listingId: string,
    customerLocation?: { lat: number; lng: number },
    scheduledTime?: string
  ): Promise<ApiResponse<OrderPricingBreakdown>> {
    try {
      // Get listing and base prices
      const { data: listing, error: listingError } = await this.supabase
        .from('marketplace_listings')
        .select('*, products(*)')
        .eq('id', listingId)
        .single()

      if (listingError || !listing) {
        throw new Error('Listing not found')
      }

      // Get active pricing factors
      const { data: factors, error: factorsError } = await this.supabase
        .from('pricing_factors')
        .select('*')
        .eq('is_active', true)

      if (factorsError) {
        console.warn('Failed to load pricing factors:', factorsError.message)
      }

      // Calculate multipliers based on conditions
      let totalMultiplier = 1.0
      const appliedFactors: any[] = []

      const currentTime = scheduledTime ? new Date(scheduledTime) : new Date()
      const currentHour = currentTime.getHours()

      factors?.forEach((factor) => {
        let shouldApply = false

        switch (factor.factor_type) {
          case 'time_of_day':
            if (factor.conditions?.hours?.includes(currentHour)) {
              shouldApply = true
            }
            break
          case 'distance':
            if (customerLocation && factor.conditions?.distance_km) {
              // This would need actual distance calculation
              // For now, assume distance is calculated elsewhere
              shouldApply = false
            }
            break
          case 'supply':
            if (factor.conditions?.stock_threshold && 
                listing.products?.stock_quantity <= factor.conditions.stock_threshold) {
              shouldApply = true
            }
            break
          // Add other factor types as needed
        }

        if (shouldApply) {
          totalMultiplier *= factor.multiplier
          appliedFactors.push({
            name: factor.factor_name,
            type: factor.factor_type,
            multiplier: factor.multiplier,
            conditions: factor.conditions,
          })
        }
      })

      // Get commission settings
      const { data: commission, error: commissionError } = await this.supabase
        .from('marketplace_commission_settings')
        .select('*')
        .eq('supplier_id', listing.supplier_id)
        .lte('effective_from', new Date().toISOString())
        .or('effective_until.is.null,effective_until.gte.' + new Date().toISOString())
        .single()

      if (commissionError) {
        console.warn('Failed to load commission settings:', commissionError.message)
      }

      const commissionRate = commission?.commission_rate || 0.15
      const deliveryCommissionRate = commission?.delivery_commission || 0.10

      // Calculate final prices
      const baseProductPrice = listing.price
      const baseDeliveryFee = listing.delivery_fee
      const adjustedProductPrice = baseProductPrice * totalMultiplier
      const adjustedDeliveryFee = baseDeliveryFee * totalMultiplier

      const finalCustomerPrice = adjustedProductPrice + adjustedDeliveryFee
      const platformCommission = adjustedProductPrice * commissionRate
      const deliveryCommission = adjustedDeliveryFee * deliveryCommissionRate
      const supplierEarning = adjustedProductPrice - platformCommission
      const deliveryEarning = adjustedDeliveryFee - deliveryCommission

      const pricingBreakdown: OrderPricingBreakdown = {
        id: '', // Will be set when order is created
        order_id: '', // Will be set when order is created
        base_product_price: baseProductPrice,
        base_delivery_fee: baseDeliveryFee,
        applied_factors: appliedFactors,
        total_multiplier: totalMultiplier,
        platform_commission: platformCommission + deliveryCommission,
        supplier_earning: supplierEarning,
        delivery_earning: deliveryEarning,
        final_customer_price: finalCustomerPrice,
        created_at: new Date().toISOString(),
      }

      return {
        success: true,
        data: pricingBreakdown,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to calculate pricing',
      }
    }
  }

  // ==================== ORDER MANAGEMENT ====================

  /**
   * Create marketplace order from cart
   */
  async createOrder(orderData: CreateMarketplaceOrder, customerId: string): Promise<ApiResponse<any>> {
    try {
      // Start transaction
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          delivery_address: orderData.delivery_address,
          delivery_location: `POINT(${orderData.delivery_location.lng} ${orderData.delivery_location.lat})`,
          special_instructions: orderData.special_instructions,
          status: 'pending',
        })
        .select()
        .single()

      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`)
      }

      // Process each cart item
      const orderItems = []
      let totalAmount = 0

      for (const item of orderData.cart_items) {
        // Calculate pricing for each item
        const pricingResult = await this.calculateDynamicPrice(
          item.listing_id,
          orderData.delivery_location,
          orderData.preferred_delivery_time
        )

        if (!pricingResult.success || !pricingResult.data) {
          throw new Error('Failed to calculate pricing for item')
        }

        const pricing = pricingResult.data
        const itemTotal = pricing.final_customer_price * item.quantity

        // Create order item
        const { data: orderItem, error: itemError } = await this.supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            listing_id: item.listing_id,
            quantity: item.quantity,
            unit_price: pricing.final_customer_price,
            total_price: itemTotal,
            delivery_type: item.delivery_type,
            notes: item.notes,
          })
          .select()
          .single()

        if (itemError) {
          throw new Error(`Failed to create order item: ${itemError.message}`)
        }

        // Save pricing breakdown
        await this.supabase
          .from('order_pricing_breakdown')
          .insert({
            ...pricing,
            order_id: order.id,
          })

        orderItems.push(orderItem)
        totalAmount += itemTotal
      }

      // Update order with total amount
      const { data: updatedOrder, error: updateError } = await this.supabase
        .from('orders')
        .update({
          total_amount: totalAmount,
          final_amount: totalAmount,
        })
        .eq('id', order.id)
        .select()
        .single()

      if (updateError) {
        throw new Error(`Failed to update order total: ${updateError.message}`)
      }

      // Clear cart items
      await this.supabase
        .from('cart_items')
        .delete()
        .eq('customer_id', customerId)
        .in('listing_id', orderData.cart_items.map(item => item.listing_id))

      return {
        success: true,
        data: {
          order: updatedOrder,
          items: orderItems,
        },
        message: 'Order created successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create order',
      }
    }
  }

  // ==================== REVIEWS ====================

  /**
   * Add product review
   */
  async addReview(
    productId: string,
    orderId: string,
    customerId: string,
    supplierId: string,
    rating: number,
    reviewText?: string,
    deliveryRating?: number,
    productQualityRating?: number
  ): Promise<ApiResponse<ProductReview>> {
    try {
      // Verify customer can review this product
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('customer_id', customerId)
        .eq('status', 'delivered')
        .single()

      if (orderError || !order) {
        throw new Error('You can only review products from delivered orders')
      }

      // Check if review already exists
      const { data: existingReview } = await this.supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('order_id', orderId)
        .eq('customer_id', customerId)
        .single()

      if (existingReview) {
        throw new Error('You have already reviewed this product')
      }

      // Create review
      const { data: review, error: reviewError } = await this.supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          order_id: orderId,
          customer_id: customerId,
          supplier_id: supplierId,
          rating,
          review_text: reviewText,
          delivery_rating: deliveryRating,
          product_quality_rating: productQualityRating,
        })
        .select()
        .single()

      if (reviewError) {
        throw new Error(`Failed to create review: ${reviewError.message}`)
      }

      return {
        success: true,
        data: review,
        message: 'Review added successfully',
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to add review',
      }
    }
  }

  // ==================== SUPPLIER MANAGEMENT ====================

  /**
   * Get supplier listings
   */
  async getSupplierListings(supplierId: string): Promise<ApiResponse<MarketplaceListing[]>> {
    try {
      const { data, error } = await this.supabase
        .from('marketplace_listings')
        .select(`
          *,
          products:product_id (*)
        `)
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to get listings: ${error.message}`)
      }

      return {
        success: true,
        data: data || [],
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get supplier listings',
      }
    }
  }

  /**
   * Create or update product listing
   */
  async createOrUpdateListing(
    listingData: Partial<MarketplaceListing>,
    supplierId: string
  ): Promise<ApiResponse<MarketplaceListing>> {
    try {
      if (listingData.id) {
        // Update existing listing
        const { data, error } = await this.supabase
          .from('marketplace_listings')
          .update({
            ...listingData,
            supplier_id: supplierId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', listingData.id)
          .eq('supplier_id', supplierId)
          .select()
          .single()

        if (error) {
          throw new Error(`Failed to update listing: ${error.message}`)
        }

        return {
          success: true,
          data,
          message: 'Listing updated successfully',
        }
      } else {
        // Create new listing
        const { data, error } = await this.supabase
          .from('marketplace_listings')
          .insert({
            ...listingData,
            supplier_id: supplierId,
          })
          .select()
          .single()

        if (error) {
          throw new Error(`Failed to create listing: ${error.message}`)
        }

        return {
          success: true,
          data,
          message: 'Listing created successfully',
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create/update listing',
      }
    }
  }
}