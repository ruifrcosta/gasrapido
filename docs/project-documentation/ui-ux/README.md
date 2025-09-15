# Documentação de Componentes Visuais e Fluxos de Navegação

Documentação dos componentes visuais e fluxos de navegação do projeto GasRápido.

## Índice

1. [Design System](#design-system)
2. [Componentes Reutilizáveis](#componentes-reutilizáveis)
3. [Fluxos de Navegação](#fluxos-de-navegação)
4. [Telas e Páginas](#telas-e-páginas)
5. [Regras de Consistência do Design System](#regras-de-consistência-do-design-system)

## Design System

O GasRápido utiliza um design system customizado para garantir consistência visual e experiência de usuário em todas as plataformas.

### Cores Principais

- **Primary**: Azul (#1F3A93)
- **Accent**: Amarelo (#FFB400)
- **Neutras**: Escala de cinzas para textos e backgrounds

### Tipografia

- **Fonte**: Inter (system-ui, sans-serif)
- **Hierarquia**: H1-H3 para cabeçalhos, textos grandes, médios e pequenos

### Ícones

O sistema utiliza ícones SVG inline para garantir consistência e performance.

## Componentes Reutilizáveis

### Button

Componente de botão reutilizável com múltiplas variantes.

**Variantes:**
- `primary`: Botão principal com fundo azul
- `secondary`: Botão secundário com fundo cinza
- `outline`: Botão com borda apenas
- `ghost`: Botão sem fundo, apenas texto

**Tamanhos:**
- `sm`: Pequeno
- `md`: Médio (padrão)
- `lg`: Grande

**Props:**
- `children`: Conteúdo do botão
- `variant`: Variação visual
- `size`: Tamanho do botão
- `disabled`: Estado desabilitado
- `loading`: Estado de carregamento
- `onClick`: Função de callback ao clicar
- `type`: Tipo do botão (button, submit, reset)
- `className`: Classes CSS adicionais

### Input

Componente de campo de entrada reutilizável.

**Props:**
- `label`: Rótulo do campo
- `error`: Mensagem de erro
- `helperText`: Texto de ajuda
- `leftIcon`: Ícone à esquerda
- `rightIcon`: Ícone à direita
- Todas as props padrão de input HTML

### Card

Componente de card para agrupar conteúdo.

**Props:**
- `children`: Conteúdo do card
- `padding`: Espaçamento interno (sm, md, lg)
- `shadow`: Sombra do card (sm, md, lg, xl)
- `className`: Classes CSS adicionais

**Subcomponentes:**
- `CardHeader`: Cabeçalho do card
- `CardTitle`: Título do card
- `CardContent`: Conteúdo do card

### Alert

Componente de alerta para mensagens importantes.

**Tipos:**
- `success`: Mensagem de sucesso
- `error`: Mensagem de erro
- `warning`: Mensagem de aviso
- `info`: Mensagem informativa

**Props:**
- `children`: Conteúdo do alerta
- `type`: Tipo de alerta
- `title`: Título do alerta
- `onClose`: Função de callback ao fechar
- `className`: Classes CSS adicionais

### Loading

Componentes para indicar estados de carregamento.

**Componentes:**
- `LoadingSpinner`: Spinner de carregamento
- `LoadingOverlay`: Overlay de carregamento sobre conteúdo

**Props do LoadingSpinner:**
- `size`: Tamanho (sm, md, lg)
- `className`: Classes CSS adicionais

**Props do LoadingOverlay:**
- `isLoading`: Estado de carregamento
- `children`: Conteúdo a ser coberto
- `text`: Texto de carregamento

## Fluxos de Navegação

### Aplicação Mobile

#### Navegação Principal
- **Bottom Navigation**: Navegação por abas na parte inferior
  - Home
  - Pedir Gás
  - Meus Pedidos
  - Rastrear
  - Perfil

#### Fluxo de Pedido
1. Home → Pedir Gás
2. Seleção de produto
3. Confirmação de quantidade e endereço
4. Escolha de método de pagamento
5. Confirmação do pedido
6. Redirecionamento para tela de rastreamento

#### Fluxo de Rastreamento
1. Home → Rastrear ou Meus Pedidos → Detalhes do Pedido
2. Visualização em tempo real da localização do entregador
3. Informações do pedido e status atual

#### Fluxo de Perfil
1. Home → Perfil
2. Visualização de informações pessoais
3. Edição de perfil
4. Gestão de endereços
5. Configurações da conta

### Aplicação Web

#### Navegação Principal
- **Header Navigation**: Menu superior com links principais
  - Home
  - Como Funciona
  - Inscrição
  - Contato
  - Login

#### Fluxo de Inscrição
1. Home → Inscrição
2. Escolha do tipo de usuário (Cliente, Fornecedor, Entregador)
3. Preenchimento do formulário específico
4. Validação de dados
5. Confirmação de inscrição

#### Fluxo do Fornecedor
1. Login → Dashboard do Fornecedor
2. Visão geral de pedidos
3. Gestão de produtos
4. Checklist de certificação
5. Relatórios e estatísticas

#### Fluxo do Entregador
1. Login → Dashboard do Entregador
2. Lista de entregas disponíveis
3. Aceite de entregas
4. Rastreamento de entregas em andamento
5. Histórico de entregas

## Telas e Páginas

### Mobile

#### HomeScreen
- Saudação personalizada
- Acesso rápido às funcionalidades principais
- Informações de perfil resumidas

#### OrderGasScreen
- Lista de produtos disponíveis
- Seleção de quantidade
- Confirmação de endereço
- Escolha de método de pagamento
- Resumo do pedido

#### OrdersScreen
- Lista de pedidos passados
- Filtros por status
- Acesso ao rastreamento

#### TrackOrderScreen
- Mapa com localização em tempo real
- Status atual do pedido
- Informações do entregador
- Tempo estimado de chegada

#### ProfileScreen
- Informações pessoais
- Gestão de endereços
- Configurações da conta
- Histórico de atividades

#### WalletScreen
- Saldo atual
- Histórico de transações
- Adição de métodos de pagamento

### Web

#### Landing Page
- Hero section com call-to-action
- Benefícios do serviço
- Como funciona
- Depoimentos
- FAQ
- Formulário de contato

#### Páginas de Inscrição
- Inscrição de Clientes
- Inscrição de Fornecedores
- Inscrição de Entregadores

#### Dashboard do Fornecedor
- Visão geral de pedidos
- Gestão de produtos
- Checklist de certificação
- Relatórios

#### Dashboard do Entregador
- Lista de entregas disponíveis
- Entregas em andamento
- Histórico de entregas
- Estatísticas

#### Página de Contato
- Formulário de contato
- Informações de contato
- Mapa de localização

#### Design System
- Demonstração de todos os componentes
- Cores e tipografia
- Ícones disponíveis

## Regras de Consistência do Design System

### Consistência Visual
- Utilizar sempre as cores definidas no design system
- Manter hierarquia tipográfica consistente
- Usar componentes reutilizáveis em vez de criar novos
- Seguir espaçamentos e alinhamentos padrão

### Consistência de Interação
- Botões primários para ações principais
- Botões secundários para ações alternativas
- Estados de hover e focus consistentes
- Feedback visual para ações do usuário

### Responsividade
- Componentes devem se adaptar a diferentes tamanhos de tela
- Layouts devem ser flexíveis e escaláveis
- Priorizar conteúdo importante em telas menores
- Testar em dispositivos móveis, tablets e desktops

### Acessibilidade
- Contraste adequado entre texto e fundo
- Labels descritivas para elementos interativos
- Navegação por teclado funcional
- Suporte a leitores de tela