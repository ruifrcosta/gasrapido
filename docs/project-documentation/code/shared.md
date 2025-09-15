# Documentação do Pacote Shared

Documentação dos tipos, utilitários e serviços compartilhados entre as aplicações.

## Estrutura Principal

```
shared/
├── package.json            # Configuração do pacote
├── src/
│   ├── index.ts            # Ponto de entrada do pacote
│   ├── hooks/              # Hooks compartilhados
│   ├── services/           # Serviços compartilhados
│   ├── types/              # Tipos compartilhados
│   └── utils/              # Funções utilitárias compartilhadas
```

## Tipos (types/)

### order.ts

Definições de tipos relacionados a pedidos compartilhados entre aplicações.

**Interfaces principais:**
- `Order`: Estrutura de um pedido
- `OrderItem`: Item dentro de um pedido
- `OrderStatus`: Enumeração de status possíveis

### user.ts

Definições de tipos relacionados a usuários compartilhados entre aplicações.

**Interfaces principais:**
- `User`: Estrutura de um usuário
- `UserProfile`: Perfil detalhado do usuário
- `UserRole`: Tipos de roles de usuário

## Serviços (services/)

### authService.ts

Serviço de autenticação compartilhado.

**Principais funções:**
- `signIn`: Autenticação de usuário
- `signOut`: Encerramento de sessão
- `getUser`: Obtenção de informações do usuário autenticado
- `refreshSession`: Atualização da sessão do usuário

### orderService.ts

Serviço de gestão de pedidos compartilhado.

**Principais funções:**
- `createOrder`: Criação de novos pedidos
- `getOrders`: Obtenção do histórico de pedidos
- `getOrderById`: Obtenção de pedido específico por ID
- `updateOrderStatus`: Atualização do status de um pedido

### supabaseService.ts

Cliente Supabase compartilhado.

**Funcionalidades:**
- Configuração única do cliente Supabase
- Funções auxiliares para operações comuns
- Tratamento de erros padronizado

## Utilitários (utils/)

### format.ts

Funções de formatação compartilhadas.

**Funções principais:**
- `formatCurrency`: Formatação de valores monetários
- `formatDate`: Formatação de datas
- `formatPhoneNumber`: Formatação de números de telefone

### validation.ts

Funções de validação compartilhadas.

**Funções principais:**
- `validateEmail`: Validação de endereços de email
- `validatePhone`: Validação de números de telefone
- `validateAddress`: Validação de endereços

## Hooks (hooks/)

### useSupabase.ts

Hook personalizado para acesso ao cliente Supabase.

**Funcionalidades:**
- Instância única do cliente Supabase
- Funções auxiliares para operações comuns
- Gerenciamento de estado de conexão

## Ponto de Entrada (index.ts)

Arquivo principal que exporta todos os componentes, tipos e funções do pacote.

**Exportações:**
- Todos os tipos definidos
- Todas as funções utilitárias
- Todos os serviços
- Todos os hooks