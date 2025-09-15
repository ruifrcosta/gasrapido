// Serviço para gerenciar pedidos no GasRápido
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  deliveryAddress: string;
  deliveryInstructions: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'dispatched' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  clientId: string;
  clientName: string;
  clientPhone: string;
  deliveryAddress: string;
  deliveryInstructions: string;
  items: Pick<OrderItem, 'productId' | 'productName' | 'quantity' | 'price'>[];
}

export interface OrderStatusUpdate {
  orderId: string;
  status: Order['status'];
  timestamp: string;
  notes?: string;
}

class OrderService {
  // Criar um novo pedido
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    // Em uma implementação real, isso faria uma chamada à API
    const newOrder: Order = {
      id: this.generateOrderId(),
      clientId: orderData.clientId,
      clientName: orderData.clientName,
      clientPhone: orderData.clientPhone,
      deliveryAddress: orderData.deliveryAddress,
      deliveryInstructions: orderData.deliveryInstructions,
      items: orderData.items.map(item => ({
        ...item,
        id: this.generateId()
      })),
      status: 'pending',
      totalPrice: orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Simular chamada à API
    await this.simulateApiCall();
    
    return newOrder;
  }

  // Obter um pedido pelo ID
  async getOrderById(orderId: string): Promise<Order | null> {
    // Em uma implementação real, isso faria uma chamada à API
    await this.simulateApiCall();
    
    // Simular retorno de um pedido
    const mockOrder: Order = {
      id: orderId,
      clientId: 'client-123',
      clientName: 'João Silva',
      clientPhone: '+351 912 345 678',
      deliveryAddress: 'Rua das Flores, 123, Lisboa',
      deliveryInstructions: 'Portão verde',
      items: [
        {
          id: 'item-1',
          productId: 'gas-001',
          productName: 'Botijão de Propano 11kg',
          quantity: 1,
          price: 15.99
        }
      ],
      status: 'in_transit',
      totalPrice: 15.99,
      createdAt: '2023-05-01T10:00:00Z',
      updatedAt: '2023-05-01T10:45:00Z'
    };

    return mockOrder;
  }

  // Atualizar status do pedido
  async updateOrderStatus(statusUpdate: OrderStatusUpdate): Promise<Order> {
    // Em uma implementação real, isso faria uma chamada à API
    await this.simulateApiCall();
    
    // Simular retorno do pedido atualizado
    const updatedOrder: Order = {
      id: statusUpdate.orderId,
      clientId: 'client-123',
      clientName: 'João Silva',
      clientPhone: '+351 912 345 678',
      deliveryAddress: 'Rua das Flores, 123, Lisboa',
      deliveryInstructions: 'Portão verde',
      items: [
        {
          id: 'item-1',
          productId: 'gas-001',
          productName: 'Botijão de Propano 11kg',
          quantity: 1,
          price: 15.99
        }
      ],
      status: statusUpdate.status,
      totalPrice: 15.99,
      createdAt: '2023-05-01T10:00:00Z',
      updatedAt: statusUpdate.timestamp
    };

    return updatedOrder;
  }

  // Obter histórico de status do pedido
  async getOrderStatusHistory(orderId: string): Promise<OrderStatusUpdate[]> {
    // Em uma implementação real, isso faria uma chamada à API
    await this.simulateApiCall();
    
    // Simular histórico de status
    const statusHistory: OrderStatusUpdate[] = [
      {
        orderId,
        status: 'pending',
        timestamp: '2023-05-01T10:00:00Z',
        notes: 'Pedido recebido'
      },
      {
        orderId,
        status: 'confirmed',
        timestamp: '2023-05-01T10:15:00Z',
        notes: 'Pedido confirmado pelo fornecedor'
      },
      {
        orderId,
        status: 'dispatched',
        timestamp: '2023-05-01T10:30:00Z',
        notes: 'Pedido despachado para entrega'
      },
      {
        orderId,
        status: 'in_transit',
        timestamp: '2023-05-01T10:45:00Z',
        notes: 'Entregador a caminho'
      }
    ];

    return statusHistory;
  }

  // Obter pedidos de um cliente
  async getOrdersByClient(clientId: string): Promise<Order[]> {
    // Em uma implementação real, isso faria uma chamada à API
    await this.simulateApiCall();
    
    // Simular lista de pedidos
    const orders: Order[] = [
      {
        id: 'order-001',
        clientId,
        clientName: 'João Silva',
        clientPhone: '+351 912 345 678',
        deliveryAddress: 'Rua das Flores, 123, Lisboa',
        deliveryInstructions: 'Portão verde',
        items: [
          {
            id: 'item-1',
            productId: 'gas-001',
            productName: 'Botijão de Propano 11kg',
            quantity: 1,
            price: 15.99
          }
        ],
        status: 'completed',
        totalPrice: 15.99,
        createdAt: '2023-04-15T14:30:00Z',
        updatedAt: '2023-04-15T15:45:00Z'
      },
      {
        id: 'order-002',
        clientId,
        clientName: 'João Silva',
        clientPhone: '+351 912 345 678',
        deliveryAddress: 'Rua das Flores, 123, Lisboa',
        deliveryInstructions: 'Portão verde',
        items: [
          {
            id: 'item-2',
            productId: 'gas-002',
            productName: 'Botijão de Butano 13kg',
            quantity: 2,
            price: 18.50
          }
        ],
        status: 'in_transit',
        totalPrice: 37.00,
        createdAt: '2023-05-01T10:00:00Z',
        updatedAt: '2023-05-01T10:45:00Z'
      }
    ];

    return orders;
  }

  // Cancelar um pedido
  async cancelOrder(orderId: string): Promise<Order> {
    // Em uma implementação real, isso faria uma chamada à API
    await this.simulateApiCall();
    
    // Simular pedido cancelado
    const cancelledOrder: Order = {
      id: orderId,
      clientId: 'client-123',
      clientName: 'João Silva',
      clientPhone: '+351 912 345 678',
      deliveryAddress: 'Rua das Flores, 123, Lisboa',
      deliveryInstructions: 'Portão verde',
      items: [
        {
          id: 'item-1',
          productId: 'gas-001',
          productName: 'Botijão de Propano 11kg',
          quantity: 1,
          price: 15.99
        }
      ],
      status: 'cancelled',
      totalPrice: 15.99,
      createdAt: '2023-05-01T10:00:00Z',
      updatedAt: new Date().toISOString()
    };

    return cancelledOrder;
  }

  // Métodos auxiliares
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }

  private async simulateApiCall(): Promise<void> {
    // Simular latência de rede
    return new Promise(resolve => setTimeout(resolve, 500));
  }
}

export default new OrderService();