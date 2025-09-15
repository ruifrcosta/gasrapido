# Documentação do Backend Supabase

Documentação das edge functions e schema do banco de dados do Supabase.

## Estrutura Principal

```
supabase/
├── config.toml             # Configuração do projeto Supabase
├── functions/              # Edge functions
│   ├── assign-courier/     # Função para atribuição de entregadores
│   ├── create-order/       # Função para criação de pedidos
│   └── process-payment/    # Função para processamento de pagamentos
├── migrations/             # Migrações do banco de dados
└── seed/                   # Dados iniciais do banco de dados
```

## Edge Functions

### create-order

Função responsável pela criação de novos pedidos no sistema.

**Funcionalidades:**
- Validação dos dados do pedido
- Criação do registro no banco de dados
- Geração de ID único para o pedido
- Retorno do pedido criado

**Parâmetros de entrada:**
- `user_id`: ID do usuário que está criando o pedido
- `items`: Itens do pedido
- `delivery_address`: Endereço de entrega
- `payment_method`: Método de pagamento

**Retorno:**
- `order`: Objeto do pedido criado
- `error`: Mensagem de erro, se houver

### assign-courier

Função responsável pela atribuição de entregadores aos pedidos.

**Funcionalidades:**
- Busca por entregadores disponíveis na região
- Atribuição automática com base em critérios de proximidade
- Notificação do entregador sobre o novo pedido
- Atualização do status do pedido

**Parâmetros de entrada:**
- `order_id`: ID do pedido a ser atribuído
- `delivery_location`: Localização de entrega

**Retorno:**
- `courier`: Informações do entregador atribuído
- `error`: Mensagem de erro, se houver

### process-payment

Função responsável pelo processamento de pagamentos.

**Funcionalidades:**
- Integração com gateways de pagamento
- Validação dos dados de pagamento
- Processamento da transação
- Atualização do status do pagamento no pedido

**Parâmetros de entrada:**
- `order_id`: ID do pedido a ser pago
- `payment_data`: Dados do pagamento
- `amount`: Valor a ser pago

**Retorno:**
- `payment`: Informações da transação
- `error`: Mensagem de erro, se houver

## Schema do Banco de Dados

### Tabelas Principais

#### users

Tabela que armazena informações de todos os usuários do sistema.

**Campos:**
- `id`: UUID (chave primária)
- `email`: STRING (email do usuário)
- `phone`: STRING (telefone do usuário)
- `full_name`: STRING (nome completo)
- `role`: USER_ROLE (tipo de usuário)
- `created_at`: TIMESTAMP (data de criação)
- `updated_at`: TIMESTAMP (data de atualização)

#### orders

Tabela que armazena informações dos pedidos.

**Campos:**
- `id`: UUID (chave primária)
- `user_id`: UUID (referência ao usuário)
- `items`: JSONB (itens do pedido)
- `status`: ORDER_STATUS (status do pedido)
- `total_amount`: NUMERIC (valor total)
- `delivery_address`: JSONB (endereço de entrega)
- `courier_id`: UUID (referência ao entregador)
- `created_at`: TIMESTAMP (data de criação)
- `updated_at`: TIMESTAMP (data de atualização)

#### products

Tabela que armazena informações dos produtos disponíveis.

**Campos:**
- `id`: UUID (chave primária)
- `name`: STRING (nome do produto)
- `description`: STRING (descrição do produto)
- `price`: NUMERIC (preço)
- `image_url`: STRING (URL da imagem)
- `available`: BOOLEAN (disponibilidade)
- `created_at`: TIMESTAMP (data de criação)
- `updated_at`: TIMESTAMP (data de atualização)

#### deliveries

Tabela que armazena informações das entregas.

**Campos:**
- `id`: UUID (chave primária)
- `order_id`: UUID (referência ao pedido)
- `courier_id`: UUID (referência ao entregador)
- `status`: DELIVERY_STATUS (status da entrega)
- `pickup_time`: TIMESTAMP (horário de coleta)
- `delivery_time`: TIMESTAMP (horário de entrega)
- `created_at`: TIMESTAMP (data de criação)
- `updated_at`: TIMESTAMP (data de atualização)

#### cells

Tabela que armazena informações das células de distribuição.

**Campos:**
- `id`: UUID (chave primária)
- `name`: STRING (nome da célula)
- `location`: JSONB (coordenadas geográficas)
- `coverage_area`: JSONB (área de cobertura)
- `supervisor_id`: UUID (referência ao supervisor)
- `created_at`: TIMESTAMP (data de criação)
- `updated_at`: TIMESTAMP (data de atualização)

## Políticas RLS (Row Level Security)

### users

- Usuários podem ler seu próprio registro
- Usuários podem atualizar seu próprio registro
- Administradores podem ler e atualizar todos os registros

### orders

- Usuários podem ler seus próprios pedidos
- Usuários podem criar novos pedidos
- Fornecedores podem ler pedidos em sua região
- Entregadores podem ler pedidos atribuídos a eles
- Administradores têm acesso completo

### products

- Fornecedores podem gerenciar seus próprios produtos
- Usuários podem ler produtos disponíveis
- Administradores têm acesso completo

### deliveries

- Entregadores podem gerenciar suas próprias entregas
- Usuários podem ler informações de entrega de seus pedidos
- Administradores têm acesso completo

### cells

- Administradores podem gerenciar células
- Supervisores podem ler informações de sua célula
- Usuários podem ler informações de células para verificar cobertura

## Variáveis de Ambiente

### .env.example

Exemplo de variáveis de ambiente necessárias para as edge functions:

- `STRIPE_SECRET_KEY`: Chave secreta do Stripe para processamento de pagamentos
- `TWILIO_ACCOUNT_SID`: SID da conta Twilio para envio de SMS
- `TWILIO_AUTH_TOKEN`: Token de autenticação do Twilio
- `GOOGLE_MAPS_API_KEY`: Chave da API do Google Maps para geolocalização