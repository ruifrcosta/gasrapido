# GasRápido 🚀

Marketplace e plataforma logística para entrega segura e rápida de botijas de gás em Luanda, conectando clientes, fornecedores e entregadores.

## 📋 Visão Geral

O GasRápido é uma solução completa que inclui:

- **App Mobile PWA**: Para clientes e entregadores (React Native + Capacitor)
- **Dashboard Web PWA**: Para fornecedores e administradores (Next.js)
- **Backend**: Supabase com PostgreSQL, Auth, Realtime e Storage

## 🏗️ Arquitetura

```
gasrapido/
├── apps/
│   ├── mobile/          # PWA Mobile (React Native + Capacitor)
│   └── web/             # PWA Web (Next.js)
├── packages/
│   ├── shared/          # Tipos, utils e lógica compartilhada
│   └── ui/              # Design system e componentes
└── supabase/            # Database schema e edge functions
```

## 🚀 Stack Tecnológico

### Frontend
- **Mobile**: React Native + Capacitor (PWA Native)
- **Web**: Next.js (PWA)
- **UI**: Design system customizado com cores da marca

### Backend
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (OTP/Phone + Email)
- **Realtime**: WebSockets via Supabase
- **Storage**: Supabase Storage
- **Functions**: Supabase Edge Functions

### Integrações
- **Mapas**: Google Maps / Mapbox
- **Pagamentos**: Multicaixa Express + Stripe
- **Notificações**: FCM (mobile) + WebPush (PWA)

## 👥 Roles e Permissões

- **Admin**: Gestão completa da plataforma
- **Fornecedor**: Gestão de stock e preços
- **Entregador**: Aceitar e executar entregas
- **Cliente**: Fazer pedidos e acompanhar entregas

## 🎨 Design

- **Cores**: Azul primário (#1F3A93), Amarelo accent (#FFB400)
- **Estilo**: Minimalista inspirado no Uber/Glovo
- **Navegação Mobile**: Bottom navbar com 4 tabs
- **Navegação Web**: Sidebar + área principal

## 🚦 Como Executar

### Pré-requisitos
- Node.js 18+
- npm 9+
- Conta Supabase configurada

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar apenas mobile
npm run mobile:dev

# Executar apenas web
npm run web:dev
```

### Build para Produção
```bash
# Build completo
npm run build

# Build mobile
npm run mobile:build

# Build web
npm run web:build
```

## 📱 PWA Features

- **Offline Support**: Cache estratégico para funcionalidade offline
- **Push Notifications**: Notificações em tempo real
- **Install Prompt**: Instalação nativa em dispositivos
- **Background Sync**: Sincronização em background

## 🌍 Fases de Desenvolvimento

1. **Fase 1**: MVP - Pedidos de clientes + entregas por motas
2. **Fase 2**: Dashboard fornecedores + relatórios básicos
3. **Fase 3**: Pagamentos digitais + integração Multicaixa
4. **Fase 4**: Expansão para carros/rotas grandes
5. **Fase 5**: Serviços adicionais (água, carvão, etc.)

## 📊 Ambientes

- **Desenvolvimento**: https://dev.gasrapido.com
- **Staging**: https://staging.gasrapido.com
- **Produção**: https://app.gasrapido.com

## 📄 Licença

Propriedade privada - Todos os direitos reservados.