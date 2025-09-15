// Serviço para gerenciar pagamentos no GasRápido
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'mbway' | 'bank_transfer' | 'cash';
  name: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  method: PaymentMethod['type'];
  createdAt: string;
  completedAt?: string;
  transactionId?: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
}

export interface CardDetails {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  name: string;
}

class PaymentService {
  private paymentMethods: PaymentMethod[] = [];
  private payments: Payment[] = [];

  // Criar um intent de pagamento
  async createPaymentIntent(amount: number, currency: string = 'EUR'): Promise<PaymentIntent> {
    await this.simulateApiCall();
    
    // Simular criação de intent de pagamento
    const paymentIntent: PaymentIntent = {
      id: this.generateId(),
      clientSecret: this.generateToken(),
      amount,
      currency,
      status: 'requires_payment_method'
    };
    
    return paymentIntent;
  }

  // Processar pagamento com cartão
  async processCardPayment(
    paymentIntentId: string,
    cardDetails: CardDetails
  ): Promise<Payment> {
    await this.simulateApiCall();
    
    // Simular processamento de pagamento
    const payment: Payment = {
      id: this.generateId(),
      orderId: `ORDER-${Date.now()}`,
      amount: 50.00,
      currency: 'EUR',
      status: 'completed',
      method: 'credit_card',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      transactionId: this.generateTransactionId()
    };
    
    this.payments.push(payment);
    return payment;
  }

  // Processar pagamento com MB Way
  async processMBWayPayment(
    paymentIntentId: string,
    phoneNumber: string
  ): Promise<Payment> {
    await this.simulateApiCall();
    
    // Simular processamento de pagamento com MB Way
    const payment: Payment = {
      id: this.generateId(),
      orderId: `ORDER-${Date.now()}`,
      amount: 50.00,
      currency: 'EUR',
      status: 'processing',
      method: 'mbway',
      createdAt: new Date().toISOString(),
      transactionId: this.generateTransactionId()
    };
    
    this.payments.push(payment);
    return payment;
  }

  // Processar pagamento em dinheiro
  async processCashPayment(orderId: string, amount: number): Promise<Payment> {
    await this.simulateApiCall();
    
    // Simular processamento de pagamento em dinheiro
    const payment: Payment = {
      id: this.generateId(),
      orderId,
      amount,
      currency: 'EUR',
      status: 'completed',
      method: 'cash',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      transactionId: this.generateTransactionId()
    };
    
    this.payments.push(payment);
    return payment;
  }

  // Obter status do pagamento
  async getPaymentStatus(paymentId: string): Promise<Payment | null> {
    await this.simulateApiCall();
    
    return this.payments.find(p => p.id === paymentId) || null;
  }

  // Obter histórico de pagamentos de um pedido
  async getOrderPayments(orderId: string): Promise<Payment[]> {
    await this.simulateApiCall();
    
    return this.payments.filter(p => p.orderId === orderId);
  }

  // Reembolsar pagamento
  async refundPayment(paymentId: string, amount?: number): Promise<Payment | null> {
    await this.simulateApiCall();
    
    const payment = this.payments.find(p => p.id === paymentId);
    if (payment) {
      payment.status = 'refunded';
      if (amount) {
        payment.amount = amount;
      }
      payment.completedAt = new Date().toISOString();
      return payment;
    }
    
    return null;
  }

  // Adicionar método de pagamento
  async addPaymentMethod(
    type: PaymentMethod['type'],
    details: any
  ): Promise<PaymentMethod> {
    await this.simulateApiCall();
    
    const paymentMethod: PaymentMethod = {
      id: this.generateId(),
      type,
      name: this.getPaymentMethodName(type),
      isDefault: this.paymentMethods.length === 0
    };
    
    // Adicionar detalhes específicos conforme o tipo
    if (type === 'credit_card' || type === 'debit_card') {
      paymentMethod.lastFour = details.number.slice(-4);
      paymentMethod.expiryDate = `${details.expiryMonth}/${details.expiryYear}`;
    }
    
    this.paymentMethods.push(paymentMethod);
    return paymentMethod;
  }

  // Obter métodos de pagamento do usuário
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await this.simulateApiCall();
    return [...this.paymentMethods];
  }

  // Remover método de pagamento
  async removePaymentMethod(paymentMethodId: string): Promise<boolean> {
    await this.simulateApiCall();
    
    const initialLength = this.paymentMethods.length;
    this.paymentMethods = this.paymentMethods.filter(pm => pm.id !== paymentMethodId);
    
    return this.paymentMethods.length < initialLength;
  }

  // Definir método de pagamento como padrão
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<PaymentMethod | null> {
    await this.simulateApiCall();
    
    // Remover status de padrão de todos os métodos
    this.paymentMethods.forEach(pm => {
      pm.isDefault = false;
    });
    
    // Definir o método especificado como padrão
    const paymentMethod = this.paymentMethods.find(pm => pm.id === paymentMethodId);
    if (paymentMethod) {
      paymentMethod.isDefault = true;
      return paymentMethod;
    }
    
    return null;
  }

  // Calcular taxa de processamento
  calculateProcessingFee(amount: number, method: PaymentMethod['type']): number {
    // Taxas simuladas
    const fees = {
      credit_card: 0.029, // 2.9%
      debit_card: 0.015,  // 1.5%
      mbway: 0.01,        // 1%
      bank_transfer: 0.005, // 0.5%
      cash: 0             // 0%
    };
    
    return amount * (fees[method] || 0);
  }

  // Verificar se o pagamento foi bem-sucedido
  isPaymentSuccessful(payment: Payment): boolean {
    return payment.status === 'completed';
  }

  // Obter métodos de pagamento disponíveis
  getAvailablePaymentMethods(): PaymentMethod['type'][] {
    return ['credit_card', 'debit_card', 'mbway', 'bank_transfer', 'cash'];
  }

  // Métodos auxiliares
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateToken(): string {
    return Math.random().toString(36).substr(2, 30);
  }

  private generateTransactionId(): string {
    return `txn_${Math.random().toString(36).substr(2, 15)}`;
  }

  private getPaymentMethodName(type: PaymentMethod['type']): string {
    const names = {
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      mbway: 'MB Way',
      bank_transfer: 'Transferência Bancária',
      cash: 'Dinheiro'
    };
    
    return names[type] || 'Método de Pagamento';
  }

  private async simulateApiCall(): Promise<void> {
    // Simular latência de rede
    return new Promise(resolve => setTimeout(resolve, 400));
  }
}

export default new PaymentService();