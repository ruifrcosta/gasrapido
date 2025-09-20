import { SupabaseClient } from '@supabase/supabase-js'

// Enhanced Marketplace Service for comprehensive multi-supplier platform
export class EnhancedMarketplaceService {
  constructor(private supabase: SupabaseClient) {}

  // ==================== PRODUCT RESERVATION SYSTEM ====================

  /**
   * Create a product reservation - allows customers to reserve botijas for pickup or delivery
   */
  async createReservation(data: {
    customer_id: string
    listing_id: string
    quantity: number
    reservation_type: 'pickup' | 'delivery'
    pickup_time?: string
    delivery_address?: string
    notes?: string
  }) {
    try {
      // Check if product is available for reservation
      const { data: listing, error: listingError } = await this.supabase
        .from('marketplace_listings')
        .select('*, products(*)')
        .eq('id', data.listing_id)
        .eq('status', 'active')
        .single()

      if (listingError || !listing) {
        throw new Error('Produto não encontrado ou indisponível')
      }

      // Check stock availability
      if (listing.products.stock_quantity < data.quantity) {
        throw new Error('Estoque insuficiente para reserva')
      }

      // Check if listing type supports the reservation type
      if (data.reservation_type === 'delivery' && !['entrega', 'normal'].includes(listing.listing_type)) {
        throw new Error('Este produto não está disponível para entrega')
      }

      if (data.reservation_type === 'pickup' && !listing.pickup_available) {
        throw new Error('Este produto não está disponível para levantamento')
      }

      // Calculate reservation expiry (2 hours for pickup, 24 hours for delivery)
      const reservationDuration = data.reservation_type === 'pickup' ? 2 : 24
      const reservedUntil = new Date()
      reservedUntil.setHours(reservedUntil.getHours() + reservationDuration)

      // Create reservation
      const { data: reservation, error: reservationError } = await this.supabase
        .from('marketplace_listings')
        .update({
          reserved: true,
          reserved_until: reservedUntil.toISOString(),
          reserved_by: data.customer_id
        })
        .eq('id', data.listing_id)
        .select()
        .single()

      if (reservationError) {
        throw new Error('Falha ao criar reserva')
      }

      // Create order record for the reservation
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .insert({
          customer_id: data.customer_id,
          vendor_id: listing.supplier_id,
          product_id: listing.product_id,
          quantity: data.quantity,
          status: 'reserved',
          order_type: data.reservation_type,
          total_amount: listing.price * data.quantity + (data.reservation_type === 'delivery' ? listing.delivery_fee : 0),
          pickup_address: data.reservation_type === 'pickup' ? listing.pickup_address : undefined,
          delivery_address: data.reservation_type === 'delivery' ? data.delivery_address : undefined,
          scheduled_for: data.pickup_time ? new Date(data.pickup_time) : undefined,
          notes: data.notes
        })
        .select()
        .single()

      if (orderError) {
        // Rollback reservation if order creation fails
        await this.supabase
          .from('marketplace_listings')
          .update({
            reserved: false,
            reserved_until: null,
            reserved_by: null
          })
          .eq('id', data.listing_id)

        throw new Error('Falha ao criar pedido')
      }

      return {
        success: true,
        data: {
          reservation: reservation,
          order: order,
          expires_at: reservedUntil
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Falha ao criar reserva'
      }
    }
  }

  // ==================== DYNAMIC PRICING ENGINE ====================

  /**
   * Calculate dynamic pricing based on various factors
   */
  async calculateDynamicPrice(data: {
    base_price: number
    delivery_fee: number
    supplier_id: string
    customer_location: { lat: number; lng: number }
    delivery_distance_km: number
    order_time?: Date
  }) {
    try {
      // Get active pricing factors
      const { data: factors, error: factorsError } = await this.supabase
        .from('pricing_factors')
        .select('*')
        .eq('is_active', true)

      if (factorsError) {
        throw new Error('Falha ao buscar fatores de preço')
      }

      let totalMultiplier = 1.0
      const appliedFactors: any[] = []

      const orderTime = data.order_time || new Date()
      const currentHour = orderTime.getHours()

      // Apply pricing factors
      for (const factor of factors || []) {
        let shouldApply = false
        let factorMultiplier = factor.multiplier

        switch (factor.factor_type) {
          case 'time_of_day':
            // Peak hours (7-9 AM, 5-8 PM)
            if (factor.factor_name === 'peak_hours') {
              const peakHours = factor.conditions?.hours || [7, 8, 17, 18, 19]
              shouldApply = peakHours.includes(currentHour)
            }
            break

          case 'distance':
            // Long distance delivery
            if (factor.factor_name === 'long_distance') {
              const distanceThreshold = factor.conditions?.distance_km || 15
              shouldApply = data.delivery_distance_km > distanceThreshold
            }
            break

          case 'weather':
            // This would integrate with weather API
            // For now, randomly apply rainy weather factor
            if (factor.factor_name === 'rainy_weather') {
              shouldApply = Math.random() < 0.2 // 20% chance of rain
            }
            break

          case 'traffic':
            // This would integrate with traffic API
            // For now, apply during peak hours
            if (factor.factor_name === 'high_traffic') {
              shouldApply = [7, 8, 17, 18, 19].includes(currentHour)
            }
            break

          case 'demand':
            // High demand periods - would be calculated from order volume
            if (factor.factor_name === 'high_demand') {
              // Simplified: apply during weekends
              const isWeekend = [0, 6].includes(orderTime.getDay())
              shouldApply = isWeekend
            }
            break
        }

        if (shouldApply) {
          totalMultiplier *= factorMultiplier
          appliedFactors.push({
            factor_name: factor.factor_name,
            factor_type: factor.factor_type,
            multiplier: factorMultiplier,
            description: this.getFactorDescription(factor.factor_name)
          })
        }
      }

      // Get supplier commission settings
      const { data: commission, error: commissionError } = await this.supabase
        .from('marketplace_commission_settings')
        .select('*')
        .eq('supplier_id', data.supplier_id)
        .order('effective_from', { ascending: false })
        .limit(1)
        .single()

      const commissionRate = commission?.commission_rate || 0.15
      const deliveryCommissionRate = commission?.delivery_commission || 0.10

      // Calculate final prices
      const adjustedProductPrice = data.base_price * totalMultiplier
      const adjustedDeliveryFee = data.delivery_fee * totalMultiplier
      const subtotal = adjustedProductPrice + adjustedDeliveryFee
      
      const platformCommission = adjustedProductPrice * commissionRate
      const deliveryCommission = adjustedDeliveryFee * deliveryCommissionRate
      const totalCommission = platformCommission + deliveryCommission
      
      const supplierEarning = adjustedProductPrice - platformCommission
      const courierEarning = adjustedDeliveryFee - deliveryCommission

      return {
        success: true,
        data: {
          base_product_price: data.base_price,
          base_delivery_fee: data.delivery_fee,
          adjusted_product_price: Math.round(adjustedProductPrice),
          adjusted_delivery_fee: Math.round(adjustedDeliveryFee),
          subtotal: Math.round(subtotal),
          total_multiplier: Math.round(totalMultiplier * 1000) / 1000,
          applied_factors: appliedFactors,
          commission_breakdown: {
            platform_commission: Math.round(platformCommission),
            delivery_commission: Math.round(deliveryCommission),
            total_commission: Math.round(totalCommission),
            supplier_earning: Math.round(supplierEarning),
            courier_earning: Math.round(courierEarning)
          }
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Falha ao calcular preço dinâmico'
      }
    }
  }

  // ==================== COMMISSION AND PAYMENT SPLIT ====================

  /**
   * Process payment split between platform, supplier, and courier
   */
  async processPaymentSplit(orderId: string, paymentData: {
    total_amount: number
    payment_method: string
    payment_proof_url?: string
  }) {
    try {
      // Get order details
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .select(`
          *,
          order_pricing_breakdown(*)
        `)
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        throw new Error('Pedido não encontrado')
      }

      const pricingBreakdown = order.order_pricing_breakdown[0]
      if (!pricingBreakdown) {
        throw new Error('Breakdown de preços não encontrado')
      }

      // Create payment records for each party
      const paymentRecords = []

      // Platform commission
      if (pricingBreakdown.platform_commission > 0) {
        paymentRecords.push({
          order_id: orderId,
          recipient_type: 'platform',
          recipient_id: null,
          amount: pricingBreakdown.platform_commission,
          payment_method: paymentData.payment_method,
          status: 'completed',
          processed_at: new Date().toISOString()
        })
      }

      // Supplier earning
      if (pricingBreakdown.supplier_earning > 0) {
        paymentRecords.push({
          order_id: orderId,
          recipient_type: 'supplier',
          recipient_id: order.vendor_id,
          amount: pricingBreakdown.supplier_earning,
          payment_method: paymentData.payment_method,
          status: 'pending',
          scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Next day
        })
      }

      // Courier earning (if delivery order)
      if (order.order_type === 'delivery' && pricingBreakdown.delivery_earning > 0) {
        paymentRecords.push({
          order_id: orderId,
          recipient_type: 'courier',
          recipient_id: order.courier_id,
          amount: pricingBreakdown.delivery_earning,
          payment_method: paymentData.payment_method,
          status: 'pending',
          scheduled_for: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // After 48h
        })
      }

      // Insert payment records
      const { error: paymentsError } = await this.supabase
        .from('payment_splits')
        .insert(paymentRecords)

      if (paymentsError) {
        throw new Error('Falha ao processar divisão de pagamento')
      }

      // Update order payment status
      const { error: updateError } = await this.supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_method: paymentData.payment_method,
          payment_proof_url: paymentData.payment_proof_url,
          paid_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (updateError) {
        throw new Error('Falha ao atualizar status de pagamento')
      }

      return {
        success: true,
        data: {
          payment_splits: paymentRecords,
          total_processed: paymentData.total_amount
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Falha ao processar divisão de pagamento'
      }
    }
  }

  // ==================== SUPPLIER PERFORMANCE AND METRICS ====================

  /**
   * Calculate and update supplier performance metrics
   */
  async updateSupplierPerformance(supplierId: string, period: Date = new Date()) {
    try {
      const startOfMonth = new Date(period.getFullYear(), period.getMonth(), 1)
      const endOfMonth = new Date(period.getFullYear(), period.getMonth() + 1, 0)

      // Get supplier orders for the period
      const { data: orders, error: ordersError } = await this.supabase
        .from('orders')
        .select('*')
        .eq('vendor_id', supplierId)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString())

      if (ordersError) {
        throw new Error('Falha ao buscar pedidos do fornecedor')
      }

      // Calculate metrics
      const totalOrders = orders?.length || 0
      const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0
      const cancelledOrders = orders?.filter(o => o.status === 'cancelled').length || 0
      
      const totalRevenue = orders?.reduce((sum, order) => {
        if (order.status === 'delivered') {
          return sum + (order.total_amount || 0)
        }
        return sum
      }, 0) || 0

      // Get supplier reviews
      const { data: reviews, error: reviewsError } = await this.supabase
        .from('product_reviews')
        .select('rating')
        .eq('supplier_id', supplierId)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString())

      const averageRating = reviews?.length 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0

      // Calculate response time (simplified - would need order status change tracking)
      const avgResponseTime = 30 // minutes - placeholder

      // Calculate stock availability rate
      const { data: listings, error: listingsError } = await this.supabase
        .from('marketplace_listings')
        .select('*, products(stock_quantity)')
        .eq('supplier_id', supplierId)
        .eq('status', 'active')

      const stockAvailabilityRate = listings?.length 
        ? listings.filter(l => l.products.stock_quantity > 0).length / listings.length 
        : 1.0

      // Update or insert performance record
      const performanceData = {
        supplier_id: supplierId,
        metric_period: startOfMonth.toISOString().split('T')[0],
        total_orders: totalOrders,
        completed_orders: completedOrders,
        cancelled_orders: cancelledOrders,
        average_rating: Math.round(averageRating * 100) / 100,
        total_revenue: totalRevenue,
        response_time_avg: avgResponseTime,
        stock_availability_rate: Math.round(stockAvailabilityRate * 10000) / 10000
      }

      const { error: upsertError } = await this.supabase
        .from('supplier_performance')
        .upsert(performanceData, {
          onConflict: 'supplier_id,metric_period'
        })

      if (upsertError) {
        throw new Error('Falha ao atualizar métricas de performance')
      }

      return {
        success: true,
        data: performanceData
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Falha ao calcular performance do fornecedor'
      }
    }
  }

  // ==================== FRAUD DETECTION ====================

  /**
   * Analyze and log potential fraud activities
   */
  async detectFraud(data: {
    entity_type: 'supplier' | 'customer' | 'order' | 'review'
    entity_id: string
    event_type: 'suspicious_order' | 'fake_review' | 'price_manipulation' | 'stock_manipulation'
    details: any
  }) {
    try {
      let riskScore = 0
      const riskFactors: string[] = []

      // Analyze based on event type
      switch (data.event_type) {
        case 'suspicious_order':
          // Check for unusual order patterns
          const { data: recentOrders } = await this.supabase
            .from('orders')
            .select('*')
            .eq('customer_id', data.entity_id)
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

          if ((recentOrders?.length || 0) > 10) {
            riskScore += 30
            riskFactors.push('Muitos pedidos em 24h')
          }

          if (data.details.amount > 50000) {
            riskScore += 20
            riskFactors.push('Valor alto do pedido')
          }
          break

        case 'fake_review':
          // Check for review patterns
          const { data: userReviews } = await this.supabase
            .from('product_reviews')
            .select('*')
            .eq('customer_id', data.entity_id)
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

          if ((userReviews?.length || 0) > 5) {
            riskScore += 40
            riskFactors.push('Muitas avaliações em 7 dias')
          }

          if (userReviews?.every(r => r.rating === 5)) {
            riskScore += 25
            riskFactors.push('Todas as avaliações são 5 estrelas')
          }
          break

        case 'price_manipulation':
          // Check for unusual price changes
          if (data.details.price_change_percentage > 50) {
            riskScore += 35
            riskFactors.push('Mudança de preço superior a 50%')
          }
          break

        case 'stock_manipulation':
          // Check for stock irregularities
          if (data.details.stock_changes > 5) {
            riskScore += 30
            riskFactors.push('Muitas alterações de estoque')
          }
          break
      }

      // Log fraud detection
      const { error: logError } = await this.supabase
        .from('marketplace_fraud_logs')
        .insert({
          event_type: data.event_type,
          entity_type: data.entity_type,
          entity_id: data.entity_id,
          risk_score: riskScore,
          details: {
            ...data.details,
            risk_factors: riskFactors,
            detected_at: new Date().toISOString()
          },
          status: riskScore > 50 ? 'pending' : 'dismissed'
        })

      if (logError) {
        throw new Error('Falha ao registrar detecção de fraude')
      }

      return {
        success: true,
        data: {
          risk_score: riskScore,
          risk_factors: riskFactors,
          action_required: riskScore > 50
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Falha na detecção de fraude'
      }
    }
  }

  // ==================== HELPER METHODS ====================

  private getFactorDescription(factorName: string): string {
    const descriptions: { [key: string]: string } = {
      'peak_hours': 'Horário de pico (7-9h, 17-20h)',
      'rainy_weather': 'Condições climáticas adversas',
      'high_traffic': 'Trânsito intenso',
      'low_stock': 'Estoque baixo',
      'high_demand': 'Alta demanda',
      'long_distance': 'Entrega a longa distância'
    }
    return descriptions[factorName] || factorName
  }

  /**
   * Get marketplace analytics and KPIs
   */
  async getMarketplaceAnalytics(period: { start: Date; end: Date }) {
    try {
      // Get marketplace metrics for the period
      const { data: metrics, error: metricsError } = await this.supabase
        .from('marketplace_metrics')
        .select('*')
        .gte('metric_date', period.start.toISOString().split('T')[0])
        .lte('metric_date', period.end.toISOString().split('T')[0])
        .order('metric_date', { ascending: true })

      if (metricsError) {
        throw new Error('Falha ao buscar métricas do marketplace')
      }

      // Calculate aggregated KPIs
      const totalOrders = metrics?.reduce((sum, m) => sum + m.total_orders, 0) || 0
      const completedOrders = metrics?.reduce((sum, m) => sum + m.completed_orders, 0) || 0
      const totalRevenue = metrics?.reduce((sum, m) => sum + m.total_revenue, 0) || 0
      const commissionEarned = metrics?.reduce((sum, m) => sum + m.platform_commission_earned, 0) || 0

      const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
      const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0
      const averageDeliveryTime = metrics?.length 
        ? metrics.reduce((sum, m) => sum + (m.average_delivery_time || 0), 0) / metrics.length 
        : 0

      return {
        success: true,
        data: {
          period: period,
          kpis: {
            total_orders: totalOrders,
            completed_orders: completedOrders,
            cancelled_orders: totalOrders - completedOrders,
            conversion_rate: Math.round(conversionRate * 100) / 100,
            total_revenue: totalRevenue,
            commission_earned: commissionEarned,
            average_order_value: Math.round(averageOrderValue),
            average_delivery_time: Math.round(averageDeliveryTime),
            active_suppliers: metrics?.[metrics.length - 1]?.supplier_count || 0,
            active_customers: metrics?.[metrics.length - 1]?.customer_count || 0
          },
          daily_metrics: metrics || []
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Falha ao buscar analytics do marketplace'
      }
    }
  }
}