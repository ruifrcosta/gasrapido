# Documentação da Aplicação Mobile

Documentação dos principais componentes e módulos da aplicação mobile do GasRápido.

## Estrutura Principal

```
mobile/
├── App.tsx                 # Ponto de entrada da aplicação
├── app.config.ts           # Configuração do Expo
├── assets/                 # Recursos estáticos (imagens, ícones, fonts)
├── src/
│   ├── App.tsx             # Componente principal da aplicação
│   ├── components/         # Componentes específicos da mobile
│   ├── hooks/              # Hooks personalizados
│   ├── navigation/         # Configuração de navegação
│   ├── screens/            # Telas da aplicação
│   ├── services/           # Serviços e integrações
│   ├── types/              # Tipos TypeScript específicos
│   └── utils/              # Funções utilitárias
```

## Telas (Screens)

### HomeScreen.tsx

Tela principal da aplicação onde os usuários podem acessar as funcionalidades principais.

**Principais funcionalidades:**
- Visualização de informações do usuário
- Acesso rápido às funcionalidades principais
- Navegação para outras telas

### OrderGasScreen.tsx

Tela para criação de novos pedidos de botijas de gás.

**Principais funcionalidades:**
- Seleção do tipo de botija
- Escolha da quantidade
- Confirmação do endereço de entrega
- Seleção do método de pagamento
- Envio do pedido

### OrdersScreen.tsx

Tela para visualização do histórico de pedidos.

**Principais funcionalidades:**
- Listagem de pedidos passados
- Visualização do status atual dos pedidos
- Acesso ao rastreamento de pedidos em andamento

### ProfileScreen.tsx

Tela de perfil do usuário.

**Principais funcionalidades:**
- Visualização e edição de informações pessoais
- Gestão de endereços
- Configurações da conta

### TrackOrderScreen.tsx

Tela de rastreamento de pedidos em tempo real.

**Principais funcionalidades:**
- Visualização do status atual do pedido
- Rastreamento GPS da entrega
- Informações do entregador
- Tempo estimado de chegada

### WalletScreen.tsx

Tela de carteira e pagamentos.

**Principais funcionalidades:**
- Visualização de saldo
- Histórico de transações
- Adição de métodos de pagamento
- Gestão de faturas

## Serviços

### orderService.ts

Serviço responsável pela gestão de pedidos.

**Principais funções:**
- `createOrder`: Criação de novos pedidos
- `getOrders`: Obtenção do histórico de pedidos
- `trackOrder`: Rastreamento de pedidos em tempo real

## Tipos

### order.ts

Definições de tipos relacionados a pedidos.

**Tipos principais:**
- `Order`: Estrutura de um pedido
- `OrderStatus`: Status possíveis de um pedido
- `DeliveryInfo`: Informações de entrega

### user.ts

Definições de tipos relacionados a usuários.

**Tipos principais:**
- `User`: Estrutura de um usuário
- `UserProfile`: Perfil detalhado do usuário

### payment.ts

Definições de tipos relacionados a pagamentos.

**Tipos principais:**
- `PaymentMethod`: Métodos de pagamento
- `Transaction`: Estrutura de uma transação

### address.ts

Definições de tipos relacionados a endereços.

**Tipos principais:**
- `Address`: Estrutura de um endereço
- `Location`: Coordenadas geográficas

## Utilitários

### helpers.ts

Funções utilitárias para operações comuns.

**Funções principais:**
- `formatCurrency`: Formatação de valores monetários
- `formatDate`: Formatação de datas
- `calculateDeliveryTime`: Cálculo estimado de tempo de entrega

## Componentes

### CustomButton.tsx

Botão personalizado reutilizável.

**Props:**
- `title`: Texto do botão
- `onPress`: Função de callback ao pressionar
- `variant`: Variação visual do botão
- `loading`: Estado de carregamento

### CustomInput.tsx

Campo de entrada personalizado.

**Props:**
- `label`: Rótulo do campo
- `placeholder`: Texto de placeholder
- `value`: Valor atual
- `onChangeText`: Função de callback para mudança de texto
- `error`: Mensagem de erro

## Hooks

### useAuth.ts

Hook personalizado para gestão de autenticação.

**Funcionalidades:**
- `signIn`: Autenticação de usuário
- `signOut`: Encerramento de sessão
- `user`: Estado do usuário autenticado

### useOrders.ts

Hook personalizado para gestão de pedidos.

**Funcionalidades:**
- `orders`: Lista de pedidos
- `loading`: Estado de carregamento
- `refreshOrders`: Função para atualizar a lista de pedidos

## Navegação

### MainNavigator.tsx

Navegador principal da aplicação.

**Telas configuradas:**
- Home
- OrderGas
- Orders
- TrackOrder
- Profile
- Wallet

## Configuração

### app.config.ts

Configuração do Expo com definições de:
- Nome da aplicação
- Identificador do pacote
- Versão
- Configurações de URL do Supabase