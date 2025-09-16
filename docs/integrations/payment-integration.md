# Integração com APIs de Pagamentos

## Visão Geral

Este documento descreve a integração do GasRápido com APIs de pagamentos, especificamente Multicaixa Express e Stripe, para processar pagamentos de clientes de forma segura e eficiente.

## APIs Suportadas

### Multicaixa Express
- **Pagamentos móveis**: Pagamentos via MB Way e outras carteiras móveis
- **Checkout**: Integração com portal de pagamentos Multicaixa
- **Reembolsos**: Processamento de reembolsos automáticos
- **Webhooks**: Notificações em tempo real de status de pagamento

### Stripe
- **Cartões de crédito/débito**: Aceitação de pagamentos internacionais
- **Checkout**: Integração com Stripe Checkout e Elements
- **Reembolsos**: Processamento de reembolsos automáticos
- **Webhooks**: Notificações em tempo real de status de pagamento

## Configuração

### Variáveis de Ambiente

As seguintes variáveis de ambiente devem ser configuradas:

```env
# Multicaixa Express
MULTICAIXA_API_KEY=your-multicaixa-api-key
MULTICAIXA_MERCHANT_ID=your-merchant-id
MULTICAIXA_ENVIRONMENT=production # ou sandbox

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### Instalação de Dependências

```bash
# Para a aplicação mobile
npm install @stripe/stripe-react-native

# Para a aplicação web
npm install @stripe/stripe-js @stripe/react-stripe-js

# Para o backend
npm install stripe multicaixa-sdk
```

## Serviços Implementados

### PaymentService

Serviço responsável por gerenciar todas as operações relacionadas a pagamentos.

```typescript
// packages/shared/services/paymentService.ts

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'mbway' | 'bank_transfer' | 'cash';
  name: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface Payment {
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

class PaymentService {
  // Criar um intent de pagamento
  async createPaymentIntent(amount: number, currency?: string): Promise<PaymentIntent> { /* ... */ }

  // Processar pagamento com cartão
  async processCardPayment(paymentIntentId: string, cardDetails: CardDetails): Promise<Payment> { /* ... */ }

  // Processar pagamento com MB Way
  async processMBWayPayment(paymentIntentId: string, phoneNumber: string): Promise<Payment> { /* ... */ }

  // Processar pagamento em dinheiro
  async processCashPayment(orderId: string, amount: number): Promise<Payment> { /* ... */ }

  // Obter status do pagamento
  async getPaymentStatus(paymentId: string): Promise<Payment | null> { /* ... */ }

  // Reembolsar pagamento
  async refundPayment(paymentId: string, amount?: number): Promise<Payment | null> { /* ... */ }

  // Calcular taxa de processamento
  calculateProcessingFee(amount: number, method: PaymentMethod['type']): number { /* ... */ }
}
```

## Componentes UI

### PaymentMethodSelector

Componente para seleção de método de pagamento.

```typescript
// apps/mobile/src/components/PaymentMethodSelector.tsx (Mobile)
// apps/web/src/components/PaymentMethodSelector.tsx (Web)

interface PaymentMethodSelectorProps {
  onSelectMethod: (method: PaymentMethod) => void;
  selectedMethod?: PaymentMethod;
  availableMethods?: PaymentMethod['type'][];
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'mbway' | 'bank_transfer' | 'cash';
  name: string;
  icon: string;
  lastFour?: string;
}
```

### CardPaymentForm

Componente para coleta de dados de cartão de crédito/débito.

```typescript
// apps/mobile/src/components/CardPaymentForm.tsx (Mobile)
// apps/web/src/components/CardPaymentForm.tsx (Web)

interface CardPaymentFormProps {
  onSubmit: (cardDetails: CardDetails) => void;
  onCancel: () => void;
  amount: number;
  currency?: string;
}

interface CardDetails {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  name: string;
}
```

## Integração com Funcionalidades do GasRápido

### Fluxo de Pagamento

1. Cliente seleciona itens e confirma pedido
2. Sistema cria PaymentIntent com o valor total
3. Cliente seleciona método de pagamento
4. Sistema processa pagamento conforme o método escolhido
5. Atualização em tempo real do status do pedido
6. Notificação ao cliente e fornecedor

### Métodos de Pagamento Suportados

- **Cartões de crédito/débito**: Processados via Stripe
- **MB Way**: Processados via Multicaixa Express
- **Transferência bancária**: Processados via Stripe ou Multicaixa
- **Dinheiro**: Pagamento na entrega (sem processamento online)

## Considerações de Segurança

- Todos os dados de cartão são tokenizados e não armazenados
- Comunicação com APIs de pagamento sempre via HTTPS
- Webhooks são verificados com assinaturas para autenticidade
- PCI DSS compliance para processamento de cartões
- Encriptação de dados sensíveis em trânsito e em repouso

## Monitoramento e Logs

- Registrar todas as transações com detalhes completos
- Monitorar taxas de sucesso/fracasso de pagamentos
- Alertas para transações suspeitas ou falhas recorrentes
- Relatórios de receita e taxas de processamento

## Próximos Passos

1. Implementar suporte a carteiras digitais (Apple Pay, Google Pay)
2. Adicionar suporte a pagamentos recorrentes para assinaturas
3. Implementar sistema de split payments para fornecedores
4. Adicionar múltiplas moedas e conversão automática