import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import notificationService from './notificationService';

// Tipos para o sistema de alertas
export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'scarcity' | 'sla' | 'pricing' | 'info' | 'warning' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  resourceId?: string; // ID do recurso relacionado (pedido, produto, etc.)
  read: boolean;
  createdAt: string;
  triggeredAt?: string;
  resolvedAt?: string;
  metadata?: Record<string, any>;
}

export interface AlertConfig {
  id: string;
  userId: string;
  type: Alert['type'];
  enabled: boolean;
  threshold?: number; // Valor limite para acionar o alerta
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  channels: ('email' | 'sms' | 'push' | 'dashboard')[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertRequest {
  title: string;
  message: string;
  type: Alert['type'];
  severity: Alert['severity'];
  userId?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}

export interface AlertFilter {
  type?: Alert['type'];
  severity?: Alert['severity'];
  userId?: string;
  read?: boolean;
  limit?: number;
  offset?: number;
}

export class AlertService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  /**
   * Cria um novo alerta
   */
  async createAlert(alertData: CreateAlertRequest): Promise<Alert> {
    try {
      const newAlert: Alert = {
        id: this.generateId(),
        title: alertData.title,
        message: alertData.message,
        type: alertData.type,
        severity: alertData.severity,
        userId: alertData.userId,
        resourceId: alertData.resourceId,
        read: false,
        createdAt: new Date().toISOString(),
        triggeredAt: new Date().toISOString(),
        metadata: alertData.metadata || {}
      };

      // Salvar no banco de dados
      const { data, error } = await this.supabase
        .from('alerts')
        .insert(newAlert)
        .select()
        .single();

      if (error) throw error;

      // Enviar notificação se houver usuário associado
      if (alertData.userId) {
        await notificationService.sendNotification(
          alertData.userId,
          alertData.title,
          alertData.message,
          this.mapAlertTypeToNotificationType(alertData.type)
        );
      }

      return data as Alert;
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      throw new Error('Falha ao criar alerta');
    }
  }

  /**
   * Obtém alertas com filtros
   */
  async getAlerts(filter?: AlertFilter): Promise<Alert[]> {
    try {
      let query = this.supabase.from('alerts').select('*');

      if (filter?.type) {
        query = query.eq('type', filter.type);
      }

      if (filter?.severity) {
        query = query.eq('severity', filter.severity);
      }

      if (filter?.userId) {
        query = query.eq('user_id', filter.userId);
      }

      if (filter?.read !== undefined) {
        query = query.eq('read', filter.read);
      }

      if (filter?.limit) {
        query = query.limit(filter.limit);
      }

      if (filter?.offset) {
        query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Alert[];
    } catch (error) {
      console.error('Erro ao obter alertas:', error);
      return [];
    }
  }

  /**
   * Marca um alerta como lido
   */
  async markAsRead(alertId: string): Promise<Alert | null> {
    try {
      const { data, error } = await this.supabase
        .from('alerts')
        .update({ 
          read: true,
          triggeredAt: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw error;
      return data as Alert;
    } catch (error) {
      console.error('Erro ao marcar alerta como lido:', error);
      return null;
    }
  }

  /**
   * Marca todos os alertas de um usuário como lidos
   */
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from('alerts')
        .update({ 
          read: true,
          triggeredAt: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return data?.length || 0;
    } catch (error) {
      console.error('Erro ao marcar todos os alertas como lidos:', error);
      return 0;
    }
  }

  /**
   * Remove um alerta
   */
  async removeAlert(alertId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao remover alerta:', error);
      return false;
    }
  }

  /**
   * Resolve um alerta
   */
  async resolveAlert(alertId: string): Promise<Alert | null> {
    try {
      const { data, error } = await this.supabase
        .from('alerts')
        .update({ 
          resolvedAt: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw error;
      return data as Alert;
    } catch (error) {
      console.error('Erro ao resolver alerta:', error);
      return null;
    }
  }

  /**
   * Cria uma configuração de alerta para um usuário
   */
  async createAlertConfig(configData: Omit<AlertConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertConfig> {
    try {
      const newConfig: AlertConfig = {
        id: this.generateId(),
        userId: configData.userId,
        type: configData.type,
        enabled: configData.enabled,
        threshold: configData.threshold,
        frequency: configData.frequency,
        channels: configData.channels,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('alert_configs')
        .insert(newConfig)
        .select()
        .single();

      if (error) throw error;
      return data as AlertConfig;
    } catch (error) {
      console.error('Erro ao criar configuração de alerta:', error);
      throw new Error('Falha ao criar configuração de alerta');
    }
  }

  /**
   * Obtém as configurações de alerta de um usuário
   */
  async getAlertConfigs(userId: string): Promise<AlertConfig[]> {
    try {
      const { data, error } = await this.supabase
        .from('alert_configs')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data as AlertConfig[];
    } catch (error) {
      console.error('Erro ao obter configurações de alerta:', error);
      return [];
    }
  }

  /**
   * Atualiza uma configuração de alerta
   */
  async updateAlertConfig(configId: string, updates: Partial<Omit<AlertConfig, 'id' | 'createdAt' | 'userId'>>): Promise<AlertConfig | null> {
    try {
      const { data, error } = await this.supabase
        .from('alert_configs')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('id', configId)
        .select()
        .single();

      if (error) throw error;
      return data as AlertConfig;
    } catch (error) {
      console.error('Erro ao atualizar configuração de alerta:', error);
      return null;
    }
  }

  /**
   * Verifica e cria alertas com base em regras de negócio
   * Esta função seria chamada periodicamente por um worker ou cron job
   */
  async checkAndCreateAlerts(): Promise<void> {
    try {
      // Verificar escassez de produtos
      await this.checkScarcityAlerts();
      
      // Verificar SLA de pedidos
      await this.checkSlaAlerts();
      
      // Verificar mudanças de preço significativas
      await this.checkPricingAlerts();
    } catch (error) {
      console.error('Erro ao verificar e criar alertas:', error);
    }
  }

  /**
   * Verifica escassez de produtos e cria alertas
   */
  private async checkScarcityAlerts(): Promise<void> {
    // Esta função verificaria produtos com estoque baixo
    // e criaria alertas para fornecedores
    console.log('Verificando alertas de escassez...');
  }

  /**
   * Verifica SLA de pedidos e cria alertas
   */
  private async checkSlaAlerts(): Promise<void> {
    // Esta função verificaria pedidos que estão demorando mais
    // do que o SLA previsto e criaria alertas
    console.log('Verificando alertas de SLA...');
  }

  /**
   * Verifica mudanças de preço significativas e cria alertas
   */
  private async checkPricingAlerts(): Promise<void> {
    // Esta função verificaria mudanças de preço significativas
    // e criaria alertas para clientes
    console.log('Verificando alertas de preço...');
  }

  /**
   * Mapeia tipo de alerta para tipo de notificação
   */
  private mapAlertTypeToNotificationType(alertType: Alert['type']): any {
    switch (alertType) {
      case 'scarcity':
      case 'sla':
        return 'warning';
      case 'pricing':
        return 'info';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }

  /**
   * Gera um ID único
   */
  private generateId(): string {
    return 'alert-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}

// Exportar instância singleton do serviço
export default new AlertService();