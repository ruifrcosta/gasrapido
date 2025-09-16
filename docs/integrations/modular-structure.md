# Estrutura Modular para Integrações Futuras

## Visão Geral

Este documento descreve a arquitetura modular do GasRápido projetada para facilitar a integração futura de seguros e marketplace de produtos relacionados, mantendo a separação de responsabilidades e permitindo expansão escalável.

## Princípios Arquiteturais

### Separação de Responsabilidades
- Cada módulo tem uma única responsabilidade bem definida
- Baixo acoplamento entre módulos
- Alta coesão dentro de cada módulo

### Extensibilidade
- Interfaces bem definidas para integrações
- Sistema de plugins para funcionalidades adicionais
- Configuração baseada em feature flags

### Reutilização
- Componentes compartilhados entre módulos
- Serviços genéricos para operações comuns
- Design system unificado

## Estrutura de Diretórios

```
gasrapido/
├── apps/
│   ├── mobile/
│   ├── web/
│   └── admin/
├── packages/
│   ├── shared/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   ├── ui/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── themes/
│   ├── insurance/
│   │   ├── services/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── marketplace/
│   │   ├── services/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   └── core/
│       ├── auth/
│       ├── orders/
│       ├── payments/
│       └── notifications/
├── modules/
│   ├── insurance-module/
│   └── marketplace-module/
└── supabase/
    ├── functions/
    ├── migrations/
    └── seeds/
```

## Módulo de Seguros

### Visão Geral
O módulo de seguros permite oferecer proteção adicional para entregas, cobrindo danos, perdas ou atrasos.

### Estrutura Interna

```typescript
// packages/insurance/types/index.ts

export interface InsurancePolicy {
  id: string;
  name: string;
  description: string;
  coverage: CoverageDetails;
  premium: number;
  terms: string;
  isActive: boolean;
}

export interface CoverageDetails {
  damageProtection: boolean;
  lossProtection: boolean;
  delayProtection: boolean;
  maxCoverageAmount: number;
  deductible: number;
}

export interface InsuranceQuote {
  policyId: string;
  orderId: string;
  premium: number;
  coverageDetails: CoverageDetails;
  validityPeriod: {
    start: string;
    end: string;
  };
}

export interface InsuranceClaim {
  id: string;
  policyId: string;
  orderId: string;
  claimNumber: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  incidentDetails: string;
  supportingDocuments: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Serviços

```typescript
// packages/insurance/services/insuranceService.ts

class InsuranceService {
  // Obter políticas de seguro disponíveis
  async getAvailablePolicies(): Promise<InsurancePolicy[]> { /* ... */ }

  // Gerar cotação de seguro para um pedido
  async generateQuote(
    orderId: string,
    policyId: string
  ): Promise<InsuranceQuote> { /* ... */ }

  // Comprar seguro para um pedido
  async purchaseInsurance(
    orderId: string,
    quoteId: string,
    paymentMethod: string
  ): Promise<{ insuranceId: string; status: 'active' | 'pending' }> { /* ... */ }

  // Registrar sinistro
  async fileClaim(
    insuranceId: string,
    incidentDetails: string,
    documents: File[]
  ): Promise<InsuranceClaim> { /* ... */ }

  // Obter status de sinistro
  async getClaimStatus(claimId: string): Promise<InsuranceClaim> { /* ... */ }
}
```

### Componentes UI

```typescript
// packages/insurance/components/InsuranceSelector.tsx

interface InsuranceSelectorProps {
  orderId: string;
  onSelectInsurance: (quote: InsuranceQuote) => void;
  onSkip: () => void;
}

const InsuranceSelector: React.FC<InsuranceSelectorProps> = ({
  orderId,
  onSelectInsurance,
  onSkip
}) => {
  // Implementação do seletor de seguros
};
```

## Módulo de Marketplace

### Visão Geral
O módulo de marketplace permite a venda de produtos relacionados ao gás, como fogões, reguladores, mangueiras, etc.

### Estrutura Interna

```typescript
// packages/marketplace/types/index.ts

export interface MarketplaceProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  specifications: Record<string, string>;
  inventory: number;
  supplierId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  parentId?: string;
  sortOrder: number;
}

export interface MarketplaceOrder {
  id: string;
  userId: string;
  items: MarketplaceOrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
```

### Serviços

```typescript
// packages/marketplace/services/marketplaceService.ts

class MarketplaceService {
  // Obter produtos do marketplace
  async getProducts(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<MarketplaceProduct[]> { /* ... */ }

  // Obter categorias do marketplace
  async getCategories(): Promise<MarketplaceCategory[]> { /* ... */ }

  // Adicionar produto ao carrinho
  async addToCart(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<void> { /* ... */ }

  // Criar pedido no marketplace
  async createOrder(
    userId: string,
    items: Omit<MarketplaceOrderItem, 'totalPrice'>[],
    shippingAddress: string
  ): Promise<MarketplaceOrder> { /* ... */ }

  // Processar pagamento do pedido
  async processPayment(
    orderId: string,
    paymentMethod: string
  ): Promise<{ status: 'success' | 'failed'; transactionId?: string }> { /* ... */ }
}
```

### Componentes UI

```typescript
// packages/marketplace/components/ProductCatalog.tsx

interface ProductCatalogProps {
  categoryId?: string;
  onAddToCart: (product: MarketplaceProduct, quantity: number) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  categoryId,
  onAddToCart
}) => {
  // Implementação do catálogo de produtos
};
```

## Integração com Core do GasRápido

### Pontos de Integração

1. **Autenticação**
   - Compartilhamento de contexto de usuário
   - Permissões específicas por módulo

2. **Pagamentos**
   - Reutilização do PaymentService
   - Compartilhamento de métodos de pagamento

3. **Notificações**
   - Envio de notificações relacionadas a seguros e marketplace
   - Reutilização do NotificationService

4. **Pedidos**
   - Associação de seguros com pedidos de gás
   - Sincronização de status entre pedidos

### Configuração Modular

```typescript
// packages/shared/types/modules.ts

export interface ModuleConfig {
  name: string;
  version: string;
  enabled: boolean;
  dependencies: string[];
  config: Record<string, any>;
}

export interface ModuleManager {
  registerModule(config: ModuleConfig): void;
  isModuleEnabled(moduleName: string): boolean;
  getModuleConfig(moduleName: string): ModuleConfig | null;
  loadModule(moduleName: string): Promise<void>;
}
```

## Feature Flags

### Sistema de Feature Flags

```typescript
// packages/shared/services/featureFlagService.ts

interface FeatureFlag {
  name: string;
  enabled: boolean;
  rolloutPercentage: number;
  targeting?: {
    userIds?: string[];
    roles?: string[];
    segments?: string[];
  };
}

class FeatureFlagService {
  private flags: Map<string, FeatureFlag> = new Map();
  
  async loadFlags(): Promise<void> {
    // Carregar flags do backend ou config
  }
  
  isEnabled(
    flagName: string,
    context?: { userId?: string; role?: string }
  ): boolean {
    const flag = this.flags.get(flagName);
    if (!flag) return false;
    
    if (!flag.enabled) return false;
    
    // Verificar targeting específico
    if (flag.targeting) {
      // Implementar lógica de targeting
    }
    
    return true;
  }
}
```

## Extensibilidade com Plugins

### Sistema de Plugins

```typescript
// packages/shared/types/plugins.ts

export interface Plugin {
  name: string;
  version: string;
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  getRoutes?(): RouteConfig[];
  getComponents?(): Record<string, React.ComponentType>;
}

export interface PluginManager {
  registerPlugin(plugin: Plugin): void;
  loadPlugin(pluginName: string): Promise<void>;
  unloadPlugin(pluginName: string): Promise<void>;
  getPlugin(pluginName: string): Plugin | null;
}
```

## Considerações de Segurança

### Isolamento de Módulos
- Cada módulo tem suas próprias permissões
- Controle de acesso baseado em roles
- Validação de dados entre módulos

### Compartilhamento de Dados
- APIs bem definidas para comunicação entre módulos
- Validação de entrada rigorosa
- Logging de acesso entre módulos

## Monitoramento e Métricas

### Métricas por Módulo

```typescript
// packages/shared/utils/moduleMetrics.ts

interface ModuleMetrics {
  moduleName: string;
  usageCount: number;
  errorCount: number;
  responseTime: number;
  lastAccessed: string;
}

class ModuleMetricsCollector {
  private metrics: Map<string, ModuleMetrics> = new Map();
  
  recordUsage(moduleName: string): void {
    const current = this.metrics.get(moduleName) || {
      moduleName,
      usageCount: 0,
      errorCount: 0,
      responseTime: 0,
      lastAccessed: new Date().toISOString()
    };
    
    current.usageCount++;
    current.lastAccessed = new Date().toISOString();
    
    this.metrics.set(moduleName, current);
  }
  
  recordError(moduleName: string): void {
    const current = this.metrics.get(moduleName);
    if (current) {
      current.errorCount++;
      this.metrics.set(moduleName, current);
    }
  }
}
```

## Próximos Passos

1. Implementar sistema de plugins completo
2. Adicionar suporte a temas personalizados por módulo
3. Implementar sistema de migração de dados para módulos
4. Adicionar testes de integração entre módulos
5. Implementar sistema de rollback para atualizações de módulos
6. Adicionar documentação automática para APIs de módulos