# Integração com APIs de Mapas

## Visão Geral

Este documento descreve a integração do GasRápido com APIs de mapas, especificamente Google Maps e Mapbox, para fornecer funcionalidades de geolocalização, roteamento e visualização de mapas na aplicação.

## APIs Suportadas

### Google Maps
- **Geocodificação**: Conversão de endereços em coordenadas e vice-versa
- **Roteamento**: Cálculo de rotas otimizadas entre pontos
- **Visualização**: Mapas interativos com marcadores e polígonos
- **Geofencing**: Definição de áreas geográficas para monitoramento

### Mapbox
- **Geocodificação**: Serviços de busca de lugares e endereços
- **Roteamento**: APIs de direções para diferentes modos de transporte
- **Visualização**: Mapas customizáveis com estilos próprios
- **Navegação**: Instruções de navegação em tempo real

## Configuração

### Variáveis de Ambiente

As seguintes variáveis de ambiente devem ser configuradas:

```env
# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Mapbox
MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
```

### Instalação de Dependências

```bash
# Para a aplicação mobile
npm install @react-native-maps/react-native-maps

# Para a aplicação web
npm install @react-google-maps/api mapbox-gl
```

## Serviços Implementados

### GeolocationService

Serviço responsável por gerenciar todas as operações relacionadas à geolocalização.

```typescript
// packages/shared/services/geolocationService.ts

interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  altitude?: number;
  speed?: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  formatted: string;
}

class GeolocationService {
  // Obter posição atual do usuário
  async getCurrentLocation(): Promise<Location> { /* ... */ }

  // Obter endereço a partir de coordenadas (geocodificação reversa)
  async reverseGeocode(location: Location): Promise<Address> { /* ... */ }

  // Obter coordenadas a partir de um endereço (geocodificação)
  async geocode(address: string): Promise<Location> { /* ... */ }

  // Calcular distância entre dois pontos (em metros)
  calculateDistance(location1: Location, location2: Location): number { /* ... */ }

  // Calcular tempo estimado de chegada (em minutos)
  async calculateETA(origin: Location, destination: Location, speed?: number): Promise<number> { /* ... */ }

  // Obter direções entre dois pontos
  async getDirections(origin: Location, destination: Location): Promise<any> { /* ... */ }
}
```

## Componentes UI

### MapViewComponent

Componente de visualização de mapas reutilizável para ambas as plataformas.

```typescript
// apps/mobile/src/components/MapViewComponent.tsx (Mobile)
// apps/web/src/components/MapViewComponent.tsx (Web)

interface MapViewComponentProps {
  initialLocation?: Location;
  markers?: MapMarker[];
  onLocationSelect?: (location: Location) => void;
  showUserLocation?: boolean;
  interactive?: boolean;
}

interface MapMarker {
  id: string;
  location: Location;
  title?: string;
  description?: string;
  icon?: string;
}
```

## Integração com Funcionalidades do GasRápido

### Rastreamento de Entregas

- Visualização em tempo real da localização do entregador
- Cálculo de ETA para o cliente
- Otimização de rotas para múltiplas entregas

### Geofencing para Áreas de Entrega

- Definição de áreas de cobertura por fornecedor
- Notificações quando o entregador entra/sai de uma área
- Validação de endereços de entrega

### Seleção de Endereço

- Autocompletar endereços durante o pedido
- Validação de endereços dentro da área de cobertura
- Visualização do endereço no mapa

## Considerações de Segurança

- As chaves de API devem ser armazenadas de forma segura
- Implementar rate limiting para evitar abusos
- Validar todas as coordenadas recebidas do cliente
- Não expor chaves de API diretamente no frontend

## Monitoramento e Logs

- Registrar todas as chamadas às APIs de mapas
- Monitorar uso para otimização de custos
- Registrar erros de geocodificação para análise

## Próximos Passos

1. Implementar fallback entre Google Maps e Mapbox
2. Adicionar suporte a mapas offline
3. Implementar clustering de marcadores para melhor performance
4. Adicionar camadas personalizadas para informações de tráfego