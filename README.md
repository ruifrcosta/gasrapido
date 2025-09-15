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

## 🎨 Design System

O GasRápido utiliza um design system customizado para garantir consistência visual e experiência de usuário em todas as plataformas.

### Componentes Disponíveis

- **Button**: Botões com variantes primary, secondary, outline e ghost
- **Input**: Campos de entrada com suporte a labels, mensagens de erro e ajuda
- **Card**: Componente de card com cabeçalho, conteúdo e rodapé
- **Badge**: Indicadores visuais com diferentes variantes
- **Form**: Componentes para construção de formulários estruturados
- **Navbar**: Barra de navegação responsiva
- **Footer**: Rodapé com layout em grid

### Cores Principais

- **Primary**: Azul (#1F3A93)
- **Accent**: Amarelo (#FFB400)
- **Neutras**: Escala de cinzas para textos e backgrounds

### Tipografia

- **Fonte**: Inter (system-ui, sans-serif)
- **Hierarquia**: H1-H3 para cabeçalhos, textos grandes, médios e pequenos

Para visualizar todos os componentes, acesse `/design-system` na aplicação web.

## 🔄 Fluxo de Pedido

O GasRápido implementa um fluxo de pedido completo com validações em cada etapa:

1. **Pedido do Cliente**: Seleção de botija, quantidade e endereço
2. **Confirmação de Disponibilidade**: Checklist do fornecedor com validações
3. **Despacho e Entrega**: Rastreamento GPS e roteamento otimizado
4. **Validação de Conformidade**: Checklist do cliente na entrega
5. **Certificação Final**: Compilação de evidências e geração de certificado

Para detalhes completos, veja [pedido-fluxo.md](docs/pedido-fluxo.md)

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

### Configuração de Variáveis de Ambiente

Antes de executar o projeto, configure as variáveis de ambiente:

1. **Mobile App**:
   - Edite `apps/mobile/app.config.ts` e substitua:
     - `YOUR_SUPABASE_URL` pela URL do seu projeto Supabase
     - `YOUR_SUPABASE_ANON_KEY` pela chave anônima do seu projeto Supabase

2. **Web Dashboard**:
   - Crie `apps/web/.env` com:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Backend Supabase**:
   - Configure `supabase/.env` com suas credenciais

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