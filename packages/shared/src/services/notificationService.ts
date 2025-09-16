// Serviço para gerenciar notificações no GasRápido
export interface AppNotification {
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
  // Armazenamento temporário de notificações (em uma implementação real, isso viria de uma API)
  private notifications: AppNotification[] = [];

  // Enviar notificação para um usuário específico
  async sendNotification(
    userId: string,
    title: string,
    message: string,
    type: AppNotification['type'] = 'info',
    orderId?: string
  ): Promise<AppNotification> {
    const notification: AppNotification = {
      id: this.generateId(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      userId,
      orderId
    };

    this.notifications.push(notification);
    
    // Em uma implementação real, isso enviaria a notificação através de um serviço como FCM, APNs, etc.
    await this.simulateApiCall();
    
    return notification;
  }

  // Obter notificações de um usuário
  async getUserNotifications(userId: string): Promise<AppNotification[]> {
    await this.simulateApiCall();
    
    return this.notifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Marcar notificação como lida
  async markAsRead(notificationId: string): Promise<AppNotification | null> {
    await this.simulateApiCall();
    
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return notification;
    }
    
    return null;
  }

  // Marcar todas as notificações como lidas
  async markAllAsRead(userId: string): Promise<number> {
    await this.simulateApiCall();
    
    let count = 0;
    this.notifications.forEach(notification => {
      if (notification.userId === userId && !notification.read) {
        notification.read = true;
        count++;
      }
    });
    
    return count;
  }

  // Remover notificação
  async removeNotification(notificationId: string): Promise<boolean> {
    await this.simulateApiCall();
    
    const initialLength = this.notifications.length;
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    
    return this.notifications.length < initialLength;
  }

  // Remover todas as notificações de um usuário
  async removeAllUserNotifications(userId: string): Promise<number> {
    await this.simulateApiCall();
    
    const initialLength = this.notifications.length;
    this.notifications = this.notifications.filter(n => n.userId !== userId);
    
    return initialLength - this.notifications.length;
  }

  // Obter contagem de notificações não lidas
  async getUnreadCount(userId: string): Promise<number> {
    await this.simulateApiCall();
    
    return this.notifications.filter(n => n.userId === userId && !n.read).length;
  }

  // Enviar notificação para múltiplos usuários
  async sendBulkNotifications(
    userIds: string[],
    title: string,
    message: string,
    type: AppNotification['type'] = 'info'
  ): Promise<AppNotification[]> {
    const notifications: AppNotification[] = [];
    
    for (const userId of userIds) {
      const notification = await this.sendNotification(userId, title, message, type);
      notifications.push(notification);
    }
    
    return notifications;
  }

  // Enviar notificação relacionada a um pedido
  async sendOrderNotification(
    userId: string,
    orderId: string,
    title: string,
    message: string,
    type: AppNotification['type'] = 'info'
  ): Promise<AppNotification> {
    return this.sendNotification(userId, title, message, type, orderId);
  }

  // Métodos auxiliares
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private async simulateApiCall(): Promise<void> {
    // Simular latência de rede
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new NotificationService();
export { NotificationService };