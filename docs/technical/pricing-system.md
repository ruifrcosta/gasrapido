# Sistema de Precificação Dinâmica

## Visão Geral

O Sistema de Precificação Dinâmica do GasRápido é um componente avançado que calcula preços em tempo real com base em múltiplos fatores ambientais e operacionais. Este sistema permite que a plataforma ajuste automaticamente os preços dos produtos para otimizar a rentabilidade, gerenciar a demanda e garantir a disponibilidade do serviço.

## Arquitetura

```
packages/
├── shared/
│   └── services/
│       └── pricingService.ts
└── ui/
    └── src/
        ├── PricingDashboardComponent.tsx
apps/
└── mobile/
    └── src/
        └── screens/
            └── PricingDashboardScreen.tsx
```

## Componentes Principais

### 1. PricingService

O serviço central que implementa toda a lógica de precificação dinâmica.

#### Interfaces

```typescript
interface PricingFactors {
  scarcity: number;     // 0-1 (0 = abundante, 1 = escasso)
  weather: number;      // 0-1 (0 = bom, 1 = ruim)
  traffic: number;      // 0-1 (0 = leve, 1 = pesado)
  demand: number;       // 0-1 (0 = baixa, 1 = alta)
  timeOfDay: number;    // 0-1 (0 = fora de pico, 1 = pico)
  dayOfWeek: number;    // 0-1 (0 = dia útil, 1 = fim de semana)
}

interface PriceCalculation {
  basePrice: number;
  finalPrice: number;
  factors: PricingFactors;
  multiplier: number;
  timestamp: Date;
}
```

#### Métodos Principais

1. **calculateDynamicPrice(basePrice, factors)**
   - Calcula o preço dinâmico baseado em múltiplos fatores
   - Retorna um objeto PriceCalculation com o preço final e detalhes

2. **calculateScarcity(inventoryLevel, maxInventory)**
   - Calcula o nível de escassez baseado no inventário disponível

3. **calculateDemand(recentOrders, averageOrders)**
   - Calcula o nível de demanda baseado em pedidos recentes

4. **getPrice(productId, basePrice, location)**
   - Obtém preço em cache ou calcula novo com dados em tempo real

5. **applyManualOverride(basePrice, overrideMultiplier)**
   - Aplica override manual para ajustes emergenciais

### 2. PricingDashboardComponent

Componente React para interface administrativa de gestão de precificação.

#### Props

```typescript
interface PricingDashboardComponentProps {
  pricingService: PricingService;
  onPriceUpdate?: (productId: string, price: PriceCalculation) => void;
}
```

#### Funcionalidades

- Visualização em tempo real de fatores de precificação
- Ajuste manual de fatores e multiplicadores
- Histórico de preços
- Override manual de preços
- Salvamento de histórico para análise

### 3. PricingDashboardScreen

Tela de demonstração para o dashboard administrativo.

## Fatores de Precificação

### 1. Escassez (Scarcity)
- **Peso:** 30%
- **Fonte:** Nível de inventário dos fornecedores
- **Impacto:** Maior escassez aumenta o preço

### 2. Clima (Weather)
- **Peso:** 15%
- **Fonte:** APIs de previsão do tempo
- **Impacto:** Condições climáticas adversas aumentam o preço

### 3. Tráfego (Traffic)
- **Peso:** 20%
- **Fonte:** APIs de tráfego em tempo real
- **Impacto:** Maior tráfego aumenta o preço de entrega

### 4. Demanda (Demand)
- **Peso:** 25%
- **Fonte:** Análise de pedidos recentes
- **Impacto:** Alta demanda aumenta o preço

### 5. Hora do Dia (Time of Day)
- **Peso:** 5%
- **Fonte:** Horário atual do sistema
- **Impacto:** Horários de pico aumentam o preço

### 6. Dia da Semana (Day of Week)
- **Peso:** 5%
- **Fonte:** Dia da semana atual
- **Impacto:** Finais de semana aumentam o preço

## Algoritmo de Cálculo

O preço final é calculado pela seguinte fórmula:

```
multiplicador = 1 + (impacto_ponderado * 3 - 0.5)
preco_final = preco_base * multiplicador
```

Onde:
- `impacto_ponderado` é a soma dos fatores multiplicados por seus pesos
- O multiplicador é limitado entre 0.5 e 4.0

## Integrações

### APIs Externas

1. **API de Clima**
   - Fonte: OpenWeatherMap / WeatherAPI
   - Uso: Obter condições climáticas em tempo real

2. **API de Tráfego**
   - Fonte: Google Maps Traffic / HERE Traffic
   - Uso: Obter dados de tráfego para rotas

### Banco de Dados

1. **Tabela price_history**
   - Armazena histórico de preços calculados
   - Utilizado para análise e auditoria

## Segurança e Compliance

- Todos os cálculos de preço são registrados para auditoria
- Apenas usuários autorizados podem ajustar preços manualmente
- Override manual requer justificativa e aprovação
- Histórico de preços é imutável após registro

## Performance

- Cache de preços por 5 minutos para reduzir chamadas de API
- Processamento assíncrono de dados em tempo real
- Interface otimizada para dispositivos móveis e desktop

## Testes

### Testes Unitários

1. Validação de cálculo de preço com diferentes combinações de fatores
2. Testes de limite para multiplicadores
3. Validação de cache e expiração
4. Testes de override manual

### Testes de Integração

1. Integração com APIs de clima e tráfego
2. Persistência de histórico de preços
3. Interface administrativa completa

## Monitoramento

### Métricas

1. Número de cálculos de preço por hora
2. Frequência de overrides manuais
3. Tempo de resposta das APIs externas
4. Taxa de cache hits/misses

### Alertas

1. Preços acima de threshold configurável
2. Falhas em chamadas de API externas
3. Overrides manuais fora do padrão

## Futuras Melhorias

1. **Machine Learning**
   - Modelos preditivos para demanda e escassez
   - Otimização automática de pesos dos fatores

2. **Análise Competitiva**
   - Integração com preços de concorrentes
   - Ajuste automático baseado em competitividade

3. **Precificação Personalizada**
   - Preços diferentes por cliente baseado em histórico
   - Programas de fidelidade integrados

4. **Simulações**
   - Ferramentas de simulação de cenários
   - Análise de impacto antes de mudanças