# Containerização de Microserviços

## Visão Geral

Este documento descreve a estratégia de containerização de microserviços para o GasRápido, utilizando Docker para empacotar, distribuir e executar os serviços de forma consistente e escalável em diferentes ambientes.

## Arquitetura de Microserviços

### Serviços Identificados

1. **User Service**: Gestão de usuários, autenticação e autorização
2. **Order Service**: Gestão de pedidos e fluxo de entrega
3. **Payment Service**: Processamento de pagamentos e reembolsos
4. **Notification Service**: Envio de notificações e mensagens
5. **Geolocation Service**: Serviços de mapas e localização
6. **Inventory Service**: Gestão de estoque de fornecedores
7. **Analytics Service**: Coleta e análise de métricas
8. **Insurance Service**: Gestão de seguros (futuro)
9. **Marketplace Service**: Marketplace de produtos relacionados (futuro)

## Estratégia de Containerização

### Imagens Docker Base

```dockerfile
# docker/base/Dockerfile

# Imagem base otimizada para aplicações Node.js
FROM node:18-alpine AS base

# Instalar dependências do sistema necessárias
RUN apk add --no-cache \
    curl \
    bash \
    tini

# Criar usuário non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Configurar diretório de trabalho
WORKDIR /app

# Utilizar tini como init para lidar melhor com signals
ENTRYPOINT ["/sbin/tini", "--"]

# Labels para metadados
LABEL maintainer="GasRapido Team"
LABEL version="1.0"
```

### Imagem para Serviços Node.js

```dockerfile
# docker/node-service/Dockerfile

# Usar imagem base
FROM gasrapido/base:latest

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências de produção apenas
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY . .

# Mudar ownership para usuário non-root
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expor porta padrão
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Comando de inicialização
CMD ["node", "server.js"]
```

## Docker Compose para Desenvolvimento

```yaml
# docker-compose.yml

version: '3.8'

services:
  # Banco de dados
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: gasrapido_dev
      POSTGRES_USER: gasrapido
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./supabase/migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gasrapido"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis para caching
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  # User Service
  user-service:
    build:
      context: .
      dockerfile: docker/node-service/Dockerfile
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://gasrapido:${POSTGRES_PASSWORD}@postgres:5432/gasrapido_dev
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "3001:3000"
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  # Order Service
  order-service:
    build:
      context: .
      dockerfile: docker/node-service/Dockerfile
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://gasrapido:${POSTGRES_PASSWORD}@postgres:5432/gasrapido_dev
      - REDIS_URL=redis://redis:6379
    ports:
      - "3002:3000"
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  # Payment Service
  payment-service:
    build:
      context: .
      dockerfile: docker/node-service/Dockerfile
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://gasrapido:${POSTGRES_PASSWORD}@postgres:5432/gasrapido_dev
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - MULTICAIXA_API_KEY=${MULTICAIXA_API_KEY}
    ports:
      - "3003:3000"
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  # Notification Service
  notification-service:
    build:
      context: .
      dockerfile: docker/node-service/Dockerfile
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://gasrapido:${POSTGRES_PASSWORD}@postgres:5432/gasrapido_dev
      - FCM_SERVER_KEY=${FCM_SERVER_KEY}
    ports:
      - "3004:3000"
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  # API Gateway
  api-gateway:
    build:
      context: ./api-gateway
      dockerfile: Dockerfile
    depends_on:
      user-service:
        condition: service_started
      order-service:
        condition: service_started
      payment-service:
        condition: service_started
      notification-service:
        condition: service_started
    ports:
      - "8000:8000"
    environment:
      - USER_SERVICE_URL=http://user-service:3000
      - ORDER_SERVICE_URL=http://order-service:3000
      - PAYMENT_SERVICE_URL=http://payment-service:3000
      - NOTIFICATION_SERVICE_URL=http://notification-service:3000

volumes:
  postgres_data:
```

## Dockerfile por Serviço

### User Service

```dockerfile
# services/user/Dockerfile

FROM gasrapido/node-service:latest

# Copiar apenas os arquivos necessários para este serviço
COPY services/user/package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY services/user/ ./

# Expõe a porta específica do serviço
EXPOSE 3001

# Comando específico do serviço
CMD ["node", "dist/index.js"]
```

### Order Service

```dockerfile
# services/order/Dockerfile

FROM gasrapido/node-service:latest

COPY services/order/package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY services/order/ ./

EXPOSE 3002

CMD ["node", "dist/index.js"]
```

## Multi-stage Builds para Produção

```dockerfile
# services/user/Dockerfile.prod

# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependências
COPY services/user/package*.json ./
COPY package*.json ../

# Instalar todas as dependências
RUN npm ci

# Copiar código fonte
COPY services/user/ ./

# Build da aplicação
RUN npm run build

# Stage 2: Runtime
FROM gasrapido/node-service:latest

# Copiar apenas o build necessário
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

## Configuração de Kubernetes

### Deployment para User Service

```yaml
# k8s/user-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: gasrapido/user-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: gasrapido-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: gasrapido-secrets
              key: redis-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: gasrapido-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3001
  type: ClusterIP
```

### Service para Load Balancing

```yaml
# k8s/user-service.yaml

apiVersion: v1
kind: Service
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  selector:
    app: user-service
  ports:
  - name: http
    port: 80
    targetPort: 3001
  type: ClusterIP
```

### Ingress para Exposição Externa

```yaml
# k8s/ingress.yaml

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gasrapido-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  rules:
  - host: api.gasrapido.com
    http:
      paths:
      - path: /users/?(.*)
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 80
      - path: /orders/?(.*)
        pathType: Prefix
        backend:
          service:
            name: order-service
            port:
              number: 80
      - path: /payments/?(.*)
        pathType: Prefix
        backend:
          service:
            name: payment-service
            port:
              number: 80
      - path: /notifications/?(.*)
        pathType: Prefix
        backend:
          service:
            name: notification-service
            port:
              number: 80
```

## Estratégia de Versionamento

### Tags de Imagem

```bash
# Versionamento semântico
gasrapido/user-service:1.2.3

# Tags por ambiente
gasrapido/user-service:latest
gasrapido/user-service:dev
gasrapido/user-service:staging
gasrapido/user-service:prod

# Tags por feature
gasrapido/user-service:feature-insurance-integration
```

### CI/CD para Builds

```yaml
# .github/workflows/build-images.yml

name: Build Docker Images

on:
  push:
    branches: [main, develop]
    paths:
      - 'services/**'
      - 'docker/**'
      - 'package*.json'

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: gasrapido/user-service
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}

    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        file: ./services/user/Dockerfile.prod
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
```

## Monitoramento e Logging

### Configuração de Logging

```dockerfile
# Configuração de logging em Dockerfile
ENV LOG_LEVEL=info
ENV LOG_FORMAT=json

# Usar stdout/stderr para logs
CMD ["node", "dist/index.js"]
```

### Health Checks

```typescript
// services/user/src/health.ts

import { Request, Response } from 'express';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Verificar conexão com banco de dados
    await database.ping();
    
    // Verificar conexão com Redis
    await redis.ping();
    
    // Verificar dependências externas
    await externalService.check();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'user-service',
      version: process.env.SERVICE_VERSION || 'unknown'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'user-service',
      error: error.message
    });
  }
};
```

## Segurança

### Práticas de Segurança

1. **Imagens Minimalistas**
   - Usar alpine ou distroless images
   - Remover pacotes desnecessários
   - Usar usuários non-root

2. **Scanning de Vulnerabilidades**
   ```bash
   # Usar ferramentas como Trivy
   trivy image gasrapido/user-service:latest
   ```

3. **Secrets Management**
   - Não armazenar secrets em imagens
   - Usar Kubernetes secrets ou Vault
   - Injetar secrets via environment variables

4. **Network Security**
   - Usar network policies no Kubernetes
   - Limitar comunicação entre serviços
   - Usar service mesh para segurança adicional

## Próximos Passos

1. Implementar service mesh (Istio/Linkerd) para melhor segurança e observabilidade
2. Adicionar auto-scaling horizontal para serviços
3. Implementar blue-green deployments para zero-downtime updates
4. Adicionar circuit breakers para resiliência
5. Implementar distributed tracing com Jaeger ou OpenTelemetry
6. Adicionar backup e disaster recovery para volumes persistentes