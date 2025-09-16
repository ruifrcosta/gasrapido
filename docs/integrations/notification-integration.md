# Integração com APIs de Notificações

## Visão Geral

Este documento descreve a integração do GasRápido com APIs de notificações, especificamente Firebase Cloud Messaging (FCM) para dispositivos móveis e Web Push para a aplicação web, para enviar notificações em tempo real aos usuários.

## APIs Suportadas

### Firebase Cloud Messaging (FCM)
- **Notificações push**: Envio de mensagens para dispositivos Android e iOS
- **Mensagens de dados**: Envio de payloads personalizados
- **Segmentação**: Envio direcionado com base em tópicos ou grupos de usuários
- **Relatórios**: Analytics de entrega e abertura de notificações

### Web Push (W3C Push API)
- **Notificações push**: Envio de mensagens para navegadores web
- **Mensagens de dados**: Envio de payloads personalizados
- **Subscrições**: Gerenciamento de subscrições de usuários
- **Compatibilidade**: Suporte a Chrome, Firefox, Edge e Safari

## Configuração

### Variáveis de Ambiente

As seguintes variáveis de ambiente devem ser configuradas:

```env
# Firebase Cloud Messaging
FCM_SERVER_KEY=your-fcm-server-key
FCM_PROJECT_ID=your-firebase-project-id
FCM_PRIVATE_KEY=your-firebase-private-key
FCM_CLIENT_EMAIL=your-firebase-client-email

# Web Push (VAPID keys)
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_EMAIL=your-vapid-email
```

### Instalação de Dependências

```bash
# Para a aplicação mobile
npm install @react-native-firebase/app @react-native-firebase/messaging

# Para a aplicação web
npm install web-push

# Para o backend
npm install firebase-admin web-push
```

## Serviços Implementados

### NotificationService

Serviço responsável por gerenciar todas as operações relacionadas a notificações.

```typescript
// packages/shared/services/notificationService.ts

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  userId?: string;
  orderId?: string;
}

class NotificationService {
  // Enviar notificação para um usuário específico
  async sendNotification(
    userId: string,
    title: string,
    message: string,
    type?: Notification['type'],
    orderId?: string
  ): Promise<Notification> { /* ... */ }

  // Obter notificações de um usuário
  async getUserNotifications(userId: string): Promise<Notification[]> { /* ... */ }

  // Marcar notificação como lida
  async markAsRead(notificationId: string): Promise<Notification | null> { /* ... */ }

  // Marcar todas as notificações como lidas
  async markAllAsRead(userId: string): Promise<number> { /* ... */ }

  // Obter contagem de notificações não lidas
  async getUnreadCount(userId: string): Promise<number> { /* ... */ }

  // Enviar notificação para múltiplos usuários
  async sendBulkNotifications(
    userIds: string[],
    title: string,
    message: string,
    type?: Notification['type']
  ): Promise<Notification[]> { /* ... */ }

  // Enviar notificação relacionada a um pedido
  async sendOrderNotification(
    userId: string,
    orderId: string,
    title: string,
    message: string,
    type?: Notification['type']
  ): Promise<Notification> { /* ... */ }
}
```

## Componentes UI

### NotificationBell

Componente para exibir o ícone de notificações com contador.

```typescript
// apps/mobile/src/components/NotificationBell.tsx (Mobile)
// apps/web/src/components/NotificationBell.tsx (Web)

interface NotificationBellProps {
  userId: string;
  onNotificationClick?: (notification: Notification) => void;
  size?: 'small' | 'medium' | 'large';
}
```

### NotificationList

Componente para exibir a lista de notificações do usuário.

```typescript
// apps/mobile/src/components/NotificationList.tsx (Mobile)
// apps/web/src/components/NotificationList.tsx (Web)

interface NotificationListProps {
  userId: string;
  onNotificationClick?: (notification: Notification) => void;
  limit?: number;
}
```

## Integração com Funcionalidades do GasRápido

### Tipos de Notificações

1. **Atualizações de Pedido**
   - Pedido confirmado pelo fornecedor
   - Pedido despachado para entrega
   - Entregador a caminho
   - Pedido entregue
   - Pedido cancelado

2. **Notificações Administrativas**
   - Novo fornecedor registrado
   - Novo entregador registrado
   - Problemas com pedidos
   - Relatórios diários

3. **Notificações de Pagamento**
   - Pagamento processado com sucesso
   - Falha no processamento de pagamento
   - Reembolso processado

4. **Notificações de Sistema**
   - Manutenção programada
   - Novas funcionalidades
   - Problemas de serviço

### Segmentação de Notificações

- Por tipo de usuário (cliente, fornecedor, entregador, admin)
- Por localização geográfica
- Por histórico de pedidos
- Por preferências de notificação

## Considerações de Segurança

- Tokens de dispositivo são armazenados de forma segura e associados a usuários
- Todas as comunicações com APIs de notificação são feitas via HTTPS
- Payloads de notificações são validados antes do envio
- Implementar rate limiting para evitar abusos
- Respeitar preferências de privacidade dos usuários

## Monitoramento e Logs

- Registrar todas as notificações enviadas com metadados
- Monitorar taxas de entrega e abertura
- Alertas para falhas em massa de envio
- Relatórios de engajamento por tipo de notificação

## Próximos Passos

1. Implementar notificações por SMS como fallback
2. Adicionar suporte a notificações por email
3. Implementar sistema de preferências de notificação por usuário
4. Adicionar suporte a notificações ricas com imagens e ações