# Documentação da Infraestrutura

Documentação da infraestrutura e processos de bootstrap do projeto GasRápido.

## Índice

1. [Ambiente Supabase](#ambiente-supabase)
2. [Banco de Dados](#banco-de-dados)
3. [Autenticação](#autenticação)
4. [Armazenamento](#armazenamento)
5. [Edge Functions](#edge-functions)
6. [CI/CD](#ci-cd)
7. [Variáveis de Ambiente](#variáveis-de-ambiente)

## Ambiente Supabase

O GasRápido utiliza Supabase como plataforma backend completa, incluindo:

- Banco de dados PostgreSQL
- Autenticação e autorização
- Armazenamento de arquivos
- Edge Functions
- Realtime

### Ambientes

- **Desenvolvimento**: https://dev.gasrapido.com
- **Staging**: https://staging.gasrapido.com
- **Produção**: https://app.gasrapido.com

### Configuração Local

O arquivo [supabase/config.toml](file:///c%3A/Users/rui.rodrigues/Desktop/GasRapido/supabase/config.toml) contém as configurações para execução local do Supabase:

- API na porta 54321
- Banco de dados na porta 54322
- Studio (interface web) na porta 54323
- Storage na porta 54327
- Edge Functions na porta 54328

## Banco de Dados

O banco de dados PostgreSQL do Supabase contém todas as informações do sistema, incluindo usuários, pedidos, produtos, entregas e avaliações.

### Estrutura Principal

```
supabase/migrations/
├── 20250912000001_initial_schema.sql    # Schema inicial do banco de dados
├── 20250912000002_rls_policies.sql      # Políticas de segurança RLS
└── 20250912000003_functions_triggers.sql # Funções e triggers
```

### Tabelas Principais

#### profiles
Tabela que armazena informações de todos os usuários do sistema.
- `id`: UUID (chave primária)
- `email`: STRING (email do usuário)
- `full_name`: STRING (nome completo)
- `phone`: STRING (telefone do usuário)
- `role`: user_role (tipo de usuário: admin, vendor, courier, client)
- `address`: TEXT (endereço do usuário)
- `location`: GEOGRAPHY (coordenadas geográficas)
- `created_at`: TIMESTAMP (data de criação)
- `updated_at`: TIMESTAMP (data de atualização)

#### vendors
Tabela que armazena informações dos fornecedores.
- `id`: UUID (chave primária)
- `user_id`: UUID (referência ao perfil do usuário)
- `business_name`: STRING (nome da empresa)
- `license_number`: STRING (número da licença)
- `address`: TEXT (endereço do fornecedor)
- `location`: GEOGRAPHY (coordenadas geográficas)
- `operating_hours`: JSONB (horário de funcionamento)
- `is_verified`: BOOLEAN (verificação do fornecedor)
- `is_active`: BOOLEAN (status do fornecedor)
- `rating`: DECIMAL (avaliação média)
- `created_at`: TIMESTAMP (data de criação)
- `updated_at`: TIMESTAMP (data de atualização)

#### couriers
Tabela que armazena informações dos entregadores.
- `id`: UUID (chave primária)
- `user_id`: UUID (referência ao perfil do usuário)
- `vehicle_type`: STRING (tipo de veículo)
- `license_plate`: STRING (placa do veículo)
- `is_verified`: BOOLEAN (verificação do entregador)
- `is_available`: BOOLEAN (disponibilidade)
- `current_location`: GEOGRAPHY (localização atual)
- `rating`: DECIMAL (avaliação média)
- `created_at`: TIMESTAMP (data de criação)
- `updated_at`: TIMESTAMP (data de atualização)

#### products
Tabela que armazena informações dos produtos (botijas de gás).
- `id`: UUID (chave primária)
- `vendor_id`: UUID (referência ao fornecedor)
- `name`: STRING (nome do produto)
- `description`: TEXT (descrição do produto)
- `weight_kg`: DECIMAL (peso em kg)
- `price_aoa`: DECIMAL (preço em AOA)
- `stock_quantity`: INTEGER (quantidade em estoque)
- `is_available`: BOOLEAN (disponibilidade)
- `image_url`: TEXT (URL da imagem)
- `created_at`: TIMESTAMP (data de criação)
- `updated_at`: TIMESTAMP (data de atualização)

#### orders
Tabela que armazena informações dos pedidos.
- `id`: UUID (chave primária)
- `order_number`: STRING (número único do pedido)
- `customer_id`: UUID (referência ao cliente)
- `vendor_id`: UUID (referência ao fornecedor)
- `courier_id`: UUID (referência ao entregador)
- `product_id`: UUID (referência ao produto)
- `quantity`: INTEGER (quantidade)
- `unit_price`: DECIMAL (preço unitário)
- `total_amount`: DECIMAL (valor total)
- `delivery_fee`: DECIMAL (taxa de entrega)
- `final_amount`: DECIMAL (valor final)
- `status`: order_status (status do pedido)
- `delivery_address`: TEXT (endereço de entrega)
- `delivery_location`: GEOGRAPHY (coordenadas de entrega)
- `pickup_address`: TEXT (endereço de coleta)
- `pickup_location`: GEOGRAPHY (coordenadas de coleta)
- `estimated_delivery`: TIMESTAMP (entrega estimada)
- `delivered_at`: TIMESTAMP (data de entrega)
- `special_instructions`: TEXT (instruções especiais)
- `created_at`: TIMESTAMP (data de criação)
- `updated_at`: TIMESTAMP (data de atualização)

#### payments
Tabela que armazena informações dos pagamentos.
- `id`: UUID (chave primária)
- `order_id`: UUID (referência ao pedido)
- `amount`: DECIMAL (valor)
- `method`: payment_method (método de pagamento)
- `status`: payment_status (status do pagamento)
- `transaction_id`: STRING (ID da transação)
- `multicaixa_reference`: STRING (referência Multicaixa)
- `payment_provider`: STRING (provedor de pagamento)
- `provider_response`: JSONB (resposta do provedor)
- `processed_at`: TIMESTAMP (data de processamento)
- `created_at`: TIMESTAMP (data de criação)
- `updated_at`: TIMESTAMP (data de atualização)

### Políticas RLS (Row Level Security)

O sistema utiliza políticas RLS para controle de acesso aos dados:

- Usuários podem ler e atualizar apenas seus próprios perfis
- Fornecedores podem gerenciar seus próprios produtos e pedidos
- Entregadores podem ver e atualizar apenas entregas atribuídas a eles
- Administradores têm acesso completo a todas as tabelas

## Autenticação

O sistema utiliza Supabase Auth para autenticação baseada em:

- OTP por SMS
- Email
- Roles e permissões RBAC

### Funções de Usuário

- **admin**: Acesso completo ao sistema
- **vendor**: Gestão de produtos e pedidos
- **courier**: Gestão de entregas
- **client**: Criação de pedidos e acompanhamento

## Armazenamento

Supabase Storage é utilizado para armazenar:

- Fotos de produtos
- Documentos de verificação
- Evidências de entrega

## Edge Functions

Funções serverless para lógica de negócios:

```
supabase/functions/
├── create-order/        # Criação de pedidos
├── process-payment/     # Processamento de pagamentos
└── assign-courier/      # Atribuição de entregadores
```

### Funções Principais

#### create-order
Responsável pela criação de novos pedidos no sistema, incluindo:
- Validação de estoque
- Cálculo de taxa de entrega
- Criação do registro no banco de dados
- Atualização de estoque
- Notificação do fornecedor

#### process-payment
Responsável pelo processamento de pagamentos, incluindo:
- Integração com diferentes métodos de pagamento
- Atualização do status do pagamento
- Atualização do status do pedido
- Atribuição automática de entregador

## CI/CD

Processo de integração e deploy contínuo.

## Variáveis de Ambiente

Configurações sensíveis e variáveis de ambiente necessárias para execução.

### Arquivo .env.example

```
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Payment Providers
STRIPE_SECRET_KEY=your_stripe_secret_key
MULTICAIXA_API_KEY=your_multicaixa_api_key

# SMS Provider
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```