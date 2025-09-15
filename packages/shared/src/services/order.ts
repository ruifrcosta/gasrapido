// Serviço para gerenciar pedidos no GasRápido

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  items: OrderItem[];
  deliveryAddress: string;
  deliveryLocation: {
    lat: number;
    lng: number;
  };
  specialInstructions?: string;
  customerId: string;
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  message?: string;
  error?: string;
}

export class OrderService {
  private supabase: any; // Supabase client

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  /**
   * Cria um novo pedido
   * @param orderData Dados do pedido
   * @returns Promise com o resultado da operação
   */
  async createOrder(orderData: OrderData): Promise<OrderResponse> {
    try {
      // Calcular totais
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const deliveryFee = 1500; // Taxa fixa de entrega
      const totalAmount = subtotal + deliveryFee;

      // Criar pedido no banco de dados
      const { data, error } = await this.supabase
        .from('orders')
        .insert({
          customer_id: orderData.customerId,
          delivery_address: orderData.deliveryAddress,
          delivery_location: `POINT(${orderData.deliveryLocation.lng} ${orderData.deliveryLocation.lat})`,
          special_instructions: orderData.specialInstructions,
          subtotal_amount: subtotal,
          delivery_fee: deliveryFee,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Criar itens do pedido
      const orderItems = orderData.items.map(item => ({
        order_id: data.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await this.supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error(itemsError.message);
      }

      return {
        success: true,
        orderId: data.id,
        message: 'Pedido criado com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Falha ao criar pedido'
      };
    }
  }

  /**
   * Obtém os pedidos de um cliente
   * @param customerId ID do cliente
   * @returns Promise com a lista de pedidos
   */
  async getCustomerOrders(customerId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          vendors(*)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return [];
    }
  }

  /**
   * Cancela um pedido
   * @param orderId ID do pedido
   * @returns Promise com o resultado da operação
   */
  async cancelOrder(orderId: string): Promise<OrderResponse> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        orderId: data.id,
        message: 'Pedido cancelado com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Falha ao cancelar pedido'
      };
    }
  }
}