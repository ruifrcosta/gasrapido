# GasRápido - Sistema de Entrega de Gás em Cilindros

## Visão Geral

O GasRápido é uma plataforma completa para entrega de gás em cilindros que conecta clientes, fornecedores e entregadores em um ecossistema integrado. O sistema utiliza tecnologia de ponta para garantir segurança, eficiência e transparência em todas as etapas do processo de entrega.

## Arquitetura do Sistema

### Monorepo com Workspaces
- **apps/mobile**: Aplicação mobile PWA (React Native + Expo)
- **apps/web**: Aplicação web PWA (Next.js)
- **packages/shared**: Serviços e utilitários compartilhados
- **packages/ui**: Componentes de interface reutilizáveis
- **packages/database**: Schema e migrations do banco de dados

### Backend
- **Supabase**: Auth, Database, Storage e Edge Functions
- **Integrações**: Google Maps, Stripe, Firebase, Twilio

### Infraestrutura
- **Deploy**: Vercel (web) e Expo EAS (mobile)
- **Monitoramento**: Logging e métricas integradas
- **Segurança**: Autenticação multifator e encriptação de dados

## Funcionalidades Principais

### Para Clientes
- Encomenda de gás com poucos cliques
- Rastreamento em tempo real da entrega
- Pagamento seguro e integrado
- Histórico de pedidos e avaliações

### Para Fornecedores
- Dashboard para gestão de pedidos
- Checklist de conformidade de produtos
- Gestão de inventário
- Relatórios e análises

### Para Entregadores
- Interface otimizada para entregas
- Navegação GPS integrada
- Checklist de conformidade na entrega
- Histórico de entregas e ganhos

### Sistema de Certificação Final
- Captura de evidências (fotos, GPS, timestamp)
- Armazenamento seguro com encriptação AES-256
- Assinatura digital em cada etapa
- Auditoria imutável de todas as transações

## Funcionalidades Avançadas

### Motor de Inteligência
- Tomada de decisões automatizada baseada em dados
- Detecção de fraudes em tempo real
- Manutenção preditiva para equipamentos
- Detecção de anomalias no sistema

### Sistema de Precificação Dinâmica
- Algoritmos baseados em escassez, clima, tráfego e demanda
- Transparência total para clientes
- Controles de override manual para emergências
- Dashboards administrativos para monitoramento

### Sistema de Matching e Roteamento
- Algoritmos de otimização de rotas
- Fallback automático entre células geográficas
- Distribuição inteligente de pedidos
- Balanceamento de carga em tempo real

### Sistema de Backup e Segurança
- Backup automático encriptado com redundância multi-região
- Autenticação multifator para todos os usuários
- Logging de segurança com detecção de anomalias
- Gestão segura de secrets e credenciais

### Sistema de Ticketing
- Classificação automática de tickets por IA
- Workflows definidos para diferentes tipos de issues
- SLA configurável e monitoramento
- Integração com canais de comunicação

### Agentes de IA Especializados
- DeepSeek para análise avançada
- Customer Support para atendimento automatizado
- Backoffice para automação de processos
- User Assist para assistência personalizada

## Tecnologias

### Frontend
- React Native (Mobile)
- Next.js (Web)
- TailwindCSS (Estilização)
- React Navigation (Navegação)

### Backend
- Supabase (Auth, Database, Storage)
- Edge Functions (Serverless)
- PostgreSQL (Database)

### DevOps
- GitHub Actions (CI/CD)
- Docker (Containerização)
- Vercel (Deploy Web)
- Expo EAS (Deploy Mobile)

## Estrutura de Diretórios

```
GasRapido/
├── apps/
│   ├── mobile/           # Aplicação mobile
│   └── web/              # Aplicação web
├── packages/
│   ├── shared/           # Serviços compartilhados
│   ├── ui/               # Componentes de interface
│   └── database/         # Schema do banco de dados
├── docs/                 # Documentação do projeto
├── assets/               # Assets visuais
└── tasks.md             # Lista de tarefas e progresso
```

## Como Começar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Contas nas APIs de integração (Google Maps, Stripe, etc.)

### Instalação
```bash
# Clonar o repositório
git clone [url-do-repositório]

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves de API

# Iniciar ambiente de desenvolvimento
npm run dev
```

### Scripts Disponíveis
- `npm run dev`: Inicia todos os apps em modo desenvolvimento
- `npm run build`: Build de produção para todos os apps
- `npm run test`: Executa testes em todos os packages
- `npm run lint`: Verifica linting em todo o projeto

## Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## Documentação

- [Fluxo de Pedido Completo](./docs/order-flow.md)
- [Sistema de Design](./docs/design-system.md)
- [Assets Visuais](./docs/assets.md)
- [Motor de Inteligência](./docs/intelligence-engine-system.md)
- [Sistema de Precificação](./docs/pricing-system.md)
- [Sistema de Matching](./docs/matching-system.md)
- [Sistema de Backup](./docs/backup-system.md)
- [Sistema de Ticketing](./docs/ticketing-system.md)
- [Agentes de IA](./docs/ai-agents-system.md)

## Licença

Este projeto é privado e pertence à organização GasRápido.

## Contato

Para mais informações, entre em contato com a equipe de desenvolvimento.