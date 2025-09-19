import notificationService, { AppNotification } from './notificationService';

export class VerificationNotificationService {
  /**
   * Send notification when documents are submitted for verification
   */
  async sendDocumentsSubmittedNotification(userId: string, userName: string): Promise<AppNotification> {
    return await notificationService.sendNotification(
      userId,
      'Documentos Enviados',
      `Olá ${userName}, seus documentos foram enviados com sucesso para verificação. Nossa equipe irá analisá-los em breve.`,
      'info'
    );
  }

  /**
   * Send notification when documents are approved
   */
  async sendDocumentsApprovedNotification(userId: string, userName: string): Promise<AppNotification> {
    return await notificationService.sendNotification(
      userId,
      'Documentos Aprovados!',
      `Parabéns ${userName}! Seus documentos foram aprovados e sua conta está agora ativa.`,
      'success'
    );
  }

  /**
   * Send notification when documents are rejected
   */
  async sendDocumentsRejectedNotification(userId: string, userName: string, reason?: string): Promise<AppNotification> {
    const message = reason 
      ? `Infelizmente, seus documentos foram rejeitados. Motivo: ${reason}. Por favor, corrija os documentos e envie novamente.`
      : 'Infelizmente, seus documentos foram rejeitados. Por favor, revise-os e envie novamente.';
      
    return await notificationService.sendNotification(
      userId,
      'Documentos Rejeitados',
      message,
      'warning'
    );
  }

  /**
   * Send notification to admin when new verification request is submitted
   */
  async sendNewVerificationRequestNotification(adminUserId: string, userName: string): Promise<AppNotification> {
    return await notificationService.sendNotification(
      adminUserId,
      'Nova Solicitação de Verificação',
      `Uma nova solicitação de verificação foi enviada por ${userName}. Por favor, revise os documentos.`,
      'info'
    );
  }

  /**
   * Send notification to multiple admins when new verification request is submitted
   */
  async sendNewVerificationRequestBulkNotification(adminUserIds: string[], userName: string): Promise<AppNotification[]> {
    return await notificationService.sendBulkNotifications(
      adminUserIds,
      'Nova Solicitação de Verificação',
      `Uma nova solicitação de verificação foi enviada por ${userName}. Por favor, revise os documentos.`,
      'info'
    );
  }

  /**
   * Send reminder notification for pending verifications
   */
  async sendVerificationReminderNotification(adminUserId: string, pendingCount: number): Promise<AppNotification> {
    return await notificationService.sendNotification(
      adminUserId,
      'Lembrete de Verificações Pendentes',
      `Você tem ${pendingCount} solicitações de verificação pendentes. Por favor, revise-as assim que possível.`,
      'warning'
    );
  }
}

export default new VerificationNotificationService();