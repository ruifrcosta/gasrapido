# Sistema de Carregamento Assíncrono

## Visão Geral

Este documento descreve a implementação do sistema de carregamento assíncrono para mapas, imagens e dados em tempo real no GasRápido, visando melhorar a performance e a experiência do usuário ao lidar com conteúdo pesado ou dados que mudam frequentemente.

## Objetivos

1. **Melhorar Performance**: Reduzir tempo de carregamento inicial
2. **Experiência do Usuário**: Mostrar conteúdo progressivamente
3. **Eficiência de Rede**: Carregar apenas o necessário
4. **Resiliência**: Tratar falhas de carregamento gracefulmente

## Componentes com Carregamento Assíncrono

### Mapas
- Visualização de mapas em telas de entrega
- Carregamento de marcadores e rotas
- Imagens de satélite e terreno

### Imagens
- Fotos de perfil de usuários
- Imagens de produtos dos fornecedores
- Fotos de evidências de entrega
- Ilustrações e ícones

### Dados em Tempo Real
- Posição de entregadores
- Status de pedidos
- Métricas de desempenho
- Notificações

## Estratégias de Carregamento

### Lazy Loading
Carregamento sob demanda quando o conteúdo entra na viewport ou é solicitado.

```typescript
// apps/mobile/src/components/LazyImage.tsx
// apps/web/src/components/LazyImage.tsx

interface LazyImageProps {
  source: string;
  placeholder?: string;
  alt: string;
  width: number;
  height: number;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  source, 
  placeholder, 
  alt, 
  width, 
  height,
  onLoad,
  onError
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    img.src = source;
    
    img.onload = () => {
      setImgSrc(source);
      setLoading(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      setError(true);
      setLoading(false);
      onError?.();
    };
  }, [source]);

  return (
    <div className="lazy-image-container" style={{ width, height }}>
      {loading && <div className="loading-placeholder">Carregando...</div>}
      {error && <div className="error-placeholder">Falha ao carregar imagem</div>}
      <img 
        src={imgSrc} 
        alt={alt} 
        className={loading ? 'loading' : 'loaded'}
        style={{ width, height }}
      />
    </div>
  );
};
```

### Progressive Loading
Carregamento progressivo de qualidade de imagens (Low Quality Image Placeholder - LQIP).

```typescript
// packages/shared/utils/imageUtils.ts

interface ProgressiveImageLoader {
  getLowQualityPlaceholder: (imageUrl: string) => string;
  preloadImage: (imageUrl: string) => Promise<HTMLImageElement>;
  loadImageWithProgressiveFallback: (
    originalUrl: string,
    placeholderUrl: string
  ) => Promise<{ original: HTMLImageElement; placeholder: HTMLImageElement }>;
}

class ImageUtils {
  static async preloadImage(imageUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  static getLowQualityPlaceholder(imageUrl: string): string {
    // Gera URL para versão de baixa qualidade da imagem
    // Pode usar serviços como Cloudinary, Imgix, etc.
    return imageUrl.replace('/upload/', '/upload/q_20,w_50/');
  }

  static async loadImageWithProgressiveFallback(
    originalUrl: string,
    placeholderUrl: string
  ): Promise<{ original: string; placeholder: string }> {
    // Primeiro carrega o placeholder
    const placeholder = await this.preloadImage(placeholderUrl);
    
    // Depois carrega a imagem original em background
    const original = await this.preloadImage(originalUrl);
    
    return { original: originalUrl, placeholder: placeholderUrl };
  }
}
```

### Code Splitting
Divisão de código para carregar apenas os componentes necessários.

```typescript
// apps/web/src/components/AsyncMapComponent.tsx

import React, { Suspense, lazy } from 'react';

// Lazy loading do componente de mapa
const MapView = lazy(() => 
  import('./MapView').then(module => ({ default: module.MapView }))
);

interface AsyncMapComponentProps {
  center: { lat: number; lng: number };
  markers: any[];
  onMarkerClick?: (marker: any) => void;
}

const AsyncMapComponent: React.FC<AsyncMapComponentProps> = ({
  center,
  markers,
  onMarkerClick
}) => {
  return (
    <Suspense fallback={<div>Carregando mapa...</div>}>
      <MapView 
        center={center}
        markers={markers}
        onMarkerClick={onMarkerClick}
      />
    </Suspense>
  );
};
```

## Implementação em Tempo Real

### WebSocket Service
Serviço para gerenciar conexões em tempo real.

```typescript
// packages/shared/services/realtimeService.ts

interface RealtimeSubscription {
  channel: string;
  callback: (data: any) => void;
  unsubscribe: () => void;
}

class RealtimeService {
  private socket: WebSocket | null = null;
  private subscriptions: Map<string, RealtimeSubscription> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(url);
      
      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        resolve();
      };
      
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };
      
      this.socket.onclose = () => {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.connect(url), 1000 * this.reconnectAttempts);
        }
      };
      
      this.socket.onerror = (error) => {
        reject(error);
      };
    });
  }

  subscribe(
    channel: string,
    callback: (data: any) => void
  ): RealtimeSubscription {
    const subscriptionId = `${channel}-${Date.now()}`;
    
    const subscription: RealtimeSubscription = {
      channel,
      callback,
      unsubscribe: () => {
        this.subscriptions.delete(subscriptionId);
        this.sendMessage({ type: 'unsubscribe', channel });
      }
    };
    
    this.subscriptions.set(subscriptionId, subscription);
    this.sendMessage({ type: 'subscribe', channel });
    
    return subscription;
  }

  private sendMessage(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  private handleMessage(data: any): void {
    this.subscriptions.forEach(subscription => {
      if (subscription.channel === data.channel) {
        subscription.callback(data.payload);
      }
    });
  }
}

export default new RealtimeService();
```

### Componente de Dados em Tempo Real

```typescript
// apps/mobile/src/components/RealtimeDataComponent.tsx
// apps/web/src/components/RealtimeDataComponent.tsx

interface RealtimeDataComponentProps {
  channelId: string;
  renderData: (data: any) => React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

const RealtimeDataComponent: React.FC<RealtimeDataComponentProps> = ({
  channelId,
  renderData,
  loadingFallback = <div>Carregando dados...</div>,
  errorFallback = <div>Erro ao carregar dados</div>
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let subscription: RealtimeSubscription | null = null;
    
    const initializeSubscription = async () => {
      try {
        // Conectar ao serviço em tempo real
        await realtimeService.connect('wss://realtime.gasrapido.com');
        
        // Subscrever ao canal
        subscription = realtimeService.subscribe(channelId, (newData) => {
          setData(newData);
          setLoading(false);
        });
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    initializeSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [channelId]);

  if (loading) return <>{loadingFallback}</>;
  if (error) return <>{errorFallback}</>;
  
  return <>{renderData(data)}</>;
};
```

## Otimizações de Performance

### Caching Estratégico

```typescript
// packages/shared/utils/cacheManager.ts

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  
  set(key: string, data: any, ttl: number = 300000): void { // 5 minutos por padrão
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Verificar se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

export default new CacheManager();
```

### Preloading Inteligente

```typescript
// packages/shared/utils/preloadManager.ts

class PreloadManager {
  private preloadQueue: string[] = [];
  private isPreloading: boolean = false;
  
  addToQueue(urls: string[]): void {
    this.preloadQueue.push(...urls);
    this.processQueue();
  }
  
  private async processQueue(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }
    
    this.isPreloading = true;
    
    while (this.preloadQueue.length > 0) {
      const url = this.preloadQueue.shift();
      if (url) {
        try {
          await this.preloadResource(url);
        } catch (error) {
          console.warn(`Falha ao pre-carregar recurso: ${url}`, error);
        }
      }
      
      // Pequena pausa para não sobrecarregar a rede
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.isPreloading = false;
  }
  
  private async preloadResource(url: string): Promise<void> {
    // Para imagens
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      await ImageUtils.preloadImage(url);
    }
    // Para outros tipos de recursos, pode-se usar fetch
    else {
      await fetch(url, { method: 'HEAD' });
    }
  }
}

export default new PreloadManager();
```

## Monitoramento e Métricas

### Métricas de Performance

```typescript
// packages/shared/utils/performanceMetrics.ts

interface LoadMetrics {
  resourceId: string;
  loadTime: number; // em milissegundos
  size: number; // em bytes
  success: boolean;
  timestamp: number;
}

class PerformanceMetrics {
  private metrics: LoadMetrics[] = [];
  
  recordLoad(
    resourceId: string,
    loadTime: number,
    size: number,
    success: boolean
  ): void {
    this.metrics.push({
      resourceId,
      loadTime,
      size,
      success,
      timestamp: Date.now()
    });
    
    // Enviar para analytics em batch
    if (this.metrics.length >= 10) {
      this.sendMetrics();
    }
  }
  
  private async sendMetrics(): Promise<void> {
    try {
      await fetch('/api/analytics/load-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.metrics)
      });
      
      // Limpar métricas enviadas
      this.metrics = [];
    } catch (error) {
      console.error('Falha ao enviar métricas de performance', error);
    }
  }
}

export default new PerformanceMetrics();
```

## Próximos Passos

1. Implementar sistema de retry inteligente para falhas de carregamento
2. Adicionar suporte a Service Workers para caching offline
3. Implementar compressão de imagens automática
4. Adicionar suporte a WebP e formatos modernos de imagem
5. Implementar sistema de prioridade para carregamento de recursos
6. Adicionar métricas de performance ao dashboard administrativo