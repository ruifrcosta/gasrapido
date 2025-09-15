/// <reference path="../deno.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { productId, quantity, deliveryAddress, deliveryLocation, specialInstructions } = await req.json()
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    // Get user from token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Get product details
    const { data: product, error: productError } = await supabaseClient
      .from('products')
      .select(`
        *,
        vendor:vendors(*)
      `)
      .eq('id', productId)
      .single()

    if (productError || !product) {
      throw new Error('Product not found')
    }

    // Check stock availability
    if (product.stock_quantity < quantity) {
      throw new Error('Insufficient stock')
    }

    // Calculate delivery fee
    const { data: deliveryFee } = await supabaseClient
      .rpc('calculate_delivery_fee', {
        pickup_lat: product.vendor.location.coordinates[1],
        pickup_lon: product.vendor.location.coordinates[0],
        delivery_lat: deliveryLocation.lat,
        delivery_lon: deliveryLocation.lng
      })

    const unitPrice = product.price_aoa
    const totalAmount = unitPrice * quantity
    const finalAmount = totalAmount + (deliveryFee || 0)

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        customer_id: user.id,
        vendor_id: product.vendor.id,
        product_id: productId,
        quantity,
        unit_price: unitPrice,
        total_amount: totalAmount,
        delivery_fee: deliveryFee || 0,
        final_amount: finalAmount,
        delivery_address: deliveryAddress,
        delivery_location: `POINT(${deliveryLocation.lng} ${deliveryLocation.lat})`,
        pickup_address: product.vendor.address,
        pickup_location: product.vendor.location,
        special_instructions: specialInstructions,
        estimated_delivery: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    // Update product stock
    await supabaseClient
      .from('products')
      .update({ 
        stock_quantity: product.stock_quantity - quantity 
      })
      .eq('id', productId)

    // Create notification for vendor
    await supabaseClient
      .rpc('create_notification', {
        user_id: product.vendor.user_id,
        title: `Novo Pedido #${order.order_number}`,
        message: `Você recebeu um novo pedido de ${quantity}x ${product.name}`,
        notification_type: 'new_order',
        data: { order_id: order.id }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        order,
        message: 'Order created successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
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