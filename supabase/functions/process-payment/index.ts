/// <reference path="../deno.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { orderId, paymentMethod, multicaixaReference } = await req.json()
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('customer_id', user.id)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        order_id: orderId,
        amount: order.final_amount,
        method: paymentMethod,
        multicaixa_reference: multicaixaReference,
        status: 'processing'
      })
      .select()
      .single()

    if (paymentError) {
      throw new Error(`Failed to create payment: ${paymentError.message}`)
    }

    let paymentResult: { success: boolean; transactionId: string | null } = { success: false, transactionId: null }

    // Process payment based on method
    switch (paymentMethod) {
      case 'multicaixa':
        paymentResult = await processMulticaixaPayment(payment, multicaixaReference)
        break
      case 'card':
        paymentResult = await processCardPayment(payment)
        break
      case 'cash':
        paymentResult = { success: true, transactionId: `CASH_${Date.now()}` }
        break
      case 'wallet':
        paymentResult = await processWalletPayment(payment, user.id, supabaseClient)
        break
      default:
        throw new Error('Invalid payment method')
    }

    // Update payment status
    const newStatus = paymentResult.success ? 'completed' : 'failed'
    await supabaseClient
      .from('payments')
      .update({
        status: newStatus,
        transaction_id: paymentResult.transactionId,
        processed_at: new Date().toISOString()
      })
      .eq('id', payment.id)

    if (paymentResult.success) {
      // Update order status
      await supabaseClient
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', orderId)

      // Find and assign courier
      await assignCourierToOrder(orderId, order, supabaseClient)
    }

    return new Response(
      JSON.stringify({ 
        success: paymentResult.success, 
        payment,
        transactionId: paymentResult.transactionId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: paymentResult.success ? 200 : 400,
      },
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error?.message || 'An error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function processMulticaixaPayment(payment: any, reference: string) {
  // Simulate Multicaixa Express API call
  // In production, this would integrate with real Multicaixa API
  const isValid = reference && reference.length >= 6
  
  return {
    success: isValid,
    transactionId: isValid ? `MCX_${Date.now()}` : null
  }
}

async function processCardPayment(payment: any) {
  // Simulate Stripe payment processing
  // In production, this would integrate with Stripe API
  return {
    success: true,
    transactionId: `STRIPE_${Date.now()}`
  }
}

async function processWalletPayment(payment: any, userId: string, supabaseClient: any) {
  // Implementation for wallet payment would go here
  // Check user wallet balance and deduct amount
  return {
    success: true,
    transactionId: `WALLET_${Date.now()}`
  }
}

async function assignCourierToOrder(orderId: string, order: any, supabaseClient: any) {
  // Find nearby available couriers
  const { data: couriers } = await supabaseClient
    .rpc('find_nearby_couriers', {
      pickup_lat: order.pickup_location.coordinates[1],
      pickup_lon: order.pickup_location.coordinates[0],
      radius_km: 10
    })

  if (couriers && couriers.length > 0) {
    // Assign the closest courier
    await supabaseClient
      .from('orders')
      .update({ 
        courier_id: couriers[0].courier_id,
        status: 'preparing'
      })
      .eq('id', orderId)

    // Notify courier
    await supabaseClient
      .rpc('create_notification', {
        user_id: couriers[0].user_id,
        title: 'Nova Entrega Disponível',
        message: `Você foi designado para entregar o pedido #${order.order_number}`,
        notification_type: 'delivery_assignment',
        data: { order_id: orderId }
      })
  }
}