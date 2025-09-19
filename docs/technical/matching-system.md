# Sistema de Matching e Roteamento de Pedidos

## Visão Geral

O sistema de matching e roteamento de pedidos do GasRápido é uma solução avançada que conecta pedidos de clientes com fornecedores e entregadores de forma otimizada. O sistema utiliza algoritmos inteligentes para realizar matching baseado em proximidade, disponibilidade, rating e capacidade, com mecanismos de fallback automático entre células geográficas.

## Arquitetura

```
matching/
├── services/
│   └── matchingService.ts      # Serviço principal de matching e roteamento
├── components/
│   └── MatchingManagementComponent.tsx  # Componente React para UI
└── screens/
    └── MatchingManagementScreen.tsx     # Tela de demonstração
```

## Funcionalidades Principais

### 1. Matching Inteligente
- Algoritmos de matching baseados em múltiplos fatores
- Otimização por proximidade geográfica
- Consideração de rating e reputação
- Análise de capacidade e disponibilidade
- Matching em tempo real

### 2. Roteamento Otimizado
- Geração de rotas eficientes
- Cálculo de tempo e distância estimados
- Consideração de tráfego e condições da estrada
- Otimização de múltiplas paradas

### 3. Fallback Automático
- Mecanismos de fallback entre células geográficas
- Redundância para garantir cobertura completa
- Transição suave entre regiões

### 4. Gestão de Células
- Divisão geográfica em células operacionais
- Gestão de fornecedores e entregadores por célula
- Monitoramento de capacidade e carga

## Estrutura de Dados

### Order
```typescript
interface Order {
  id: string;
  clientId: string;
  supplierId?: string;
  courierId?: string;
  pickupLocation: { lat: number; lng: number };
  deliveryLocation: { lat: number; lng: number };
  status: 'pending' | 'matched' | 'assigned' | 'in_progress' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  estimatedDeliveryTime?: string;
  distance?: number;
  estimatedCost?: number;
}
```

### Supplier
```typescript
interface Supplier {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  availability: boolean;
  rating: number;
  capacity: number;
  currentLoad: number;
  specialties: string[];
  operatingHours: { open: string; close: string };
}
```

### Courier
```typescript
interface Courier {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  availability: boolean;
  rating: number;
  vehicleType: 'bike' | 'motorcycle' | 'car';
  capacity: number;
  currentLoad: number;
  operatingHours: { open: string; close: string };
}
```

### Cell
```typescript
interface Cell {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // em metros
  suppliers: string[]; // IDs dos fornecedores na célula
  couriers: string[]; // IDs dos entregadores na célula
  isActive: boolean;
}
```

### MatchResult
```typescript
interface MatchResult {
  orderId: string;
  supplierId?: string;
  courierId?: string;
  estimatedTime: number; // em minutos
  estimatedCost: number;
  distance: number; // em metros
  confidence: number; // 0-1
  fallbackUsed: boolean;
}
```

### RoutingResult
```typescript
interface RoutingResult {
  orderId: string;
  route: Array<{ lat: number; lng: number }>;
  waypoints: Array<{ 
    type: 'pickup' | 'delivery' | 'intermediate'; 
    location: { lat: number; lng: number };
    estimatedArrival: string;
  }>;
  totalDistance: number; // em metros
  estimatedDuration: number; // em minutos
  optimized: boolean;
}
```

## Algoritmos de Matching

### Fatores de Pontuação para Fornecedores
1. **Distância** (40%) - Proximidade do fornecedor ao ponto de coleta
2. **Rating** (30%) - Reputação e avaliações do fornecedor
3. **Capacidade** (20%) - Espaço disponível para processar o pedido
4. **Especialidades** (10%) - Compatibilidade com os itens do pedido

### Fatores de Pontuação para Entregadores
1. **Distância Total** (40%) - Distância combinada do fornecedor ao entregador e do entregador ao cliente
2. **Rating** (25%) - Reputação e avaliações do entregador
3. **Capacidade** (15%) - Espaço disponível para carregar o pedido
4. **Tipo de Veículo** (10%) - Adequação do veículo para o tamanho do pedido
5. **Tempo Estimado** (10%) - Rapidez na entrega

## API do Serviço

### Encontrar Melhor Fornecedor
```typescript
findBestSupplier(order: Order): Promise<{ supplierId: string; confidence: number } | null>
```

### Encontrar Melhor Entregador
```typescript
findBestCourier(order: Order, supplierLocation: { lat: number; lng: number }): Promise<{ courierId: string; confidence: number } | null>
```

### Realizar Matching Completo
```typescript
matchOrder(orderId: string): Promise<MatchResult | null>
```

### Gerar Rota Otimizada
```typescript
generateRoute(orderId: string): Promise<RoutingResult | null>
```

### Obter Fornecedores Disponíveis
```typescript
getAvailableSuppliers(location: { lat: number; lng: number }): Promise<Supplier[]>
```

### Obter Entregadores Disponíveis
```typescript
getAvailableCouriers(location: { lat: number; lng: number }): Promise<Courier[]>
```

## Componente React

O componente [MatchingManagementComponent](file:///c%3A/Users/rui.rodrigues/Desktop/GasRapido/packages/ui/src/MatchingManagementComponent.tsx#L15-L237) fornece uma interface completa para gestão do sistema de matching:

### Props
- `userId`: ID do usuário administrador
- `onOrderMatched`: Callback para quando um pedido é matched
- `onRouteGenerated`: Callback para quando uma rota é gerada

### Funcionalidades UI
- Visualização de pedidos pendentes
- Ações de matching e geração de rotas
- Monitoramento em tempo real do status
- Design responsivo para mobile e web

## Integrações

### Supabase
- Armazenamento de dados de pedidos, fornecedores e entregadores
- Consultas otimizadas com filtros geográficos
- Realtime updates para interface administrativa

### Sistema de Geolocalização
- Cálculo preciso de distâncias
- Geocodificação e geocodificação reversa
- Gestão de geofences e boundaries

### Sistema de Notificações
- Alertas para novos matchings
- Notificações de status para fornecedores e entregadores
- Lembretes para ações pendentes

## Segurança e Compliance

### Controle de Acesso
- Permissões baseadas em roles para acesso ao sistema
- Logging de todas as ações administrativas
- Auditoria de decisões de matching

### Proteção de Dados
- Encriptação de dados sensíveis em trânsito
- Conformidade com regulamentações de privacidade
- Retenção e exclusão automática de dados

## Futuras Melhorias

### Machine Learning
- Modelos preditivos para demanda e disponibilidade
- Otimização contínua dos algoritmos de matching
- Análise de padrões de entrega para melhorias

### Integração com Tráfego em Tempo Real
- Dados de tráfego em tempo real para otimização de rotas
- Previsão de condições de estrada
- Ajustes dinâmicos de rotas

### Expansão de Células
- Algoritmos para divisão automática de células
- Balanceamento dinâmico de carga entre células
- Otimização de boundaries geográficos

### Analytics Avançados
- Painéis de métricas de performance
- Análise de eficiência de matching
- Relatórios de ROI e otimização