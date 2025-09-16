import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

// Tipos para o sistema de ticketing
export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resolution_notes?: string;
  tags: string[];
  metadata?: Record<string, any>;
}

export type TicketCategory = 
  | 'technical' 
  | 'billing' 
  | 'account' 
  | 'order' 
  | 'delivery' 
  | 'feature_request' 
  | 'complaint'
  | 'other';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';

export interface TicketCreateRequest {
  title: string;
  description: string;
  category?: TicketCategory;
  priority?: TicketPriority;
  created_by: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface TicketUpdateRequest {
  id: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigned_to?: string;
  resolution_notes?: string;
}

export interface TicketFilter {
  category?: TicketCategory;
  priority?: TicketPriority;
  status?: TicketStatus;
  assigned_to?: string;
  created_by?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byCategory: Record<TicketCategory, number>;
  byPriority: Record<TicketPriority, number>;
}

export class TicketingService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  /**
   * Cria um novo ticket
   */
  async createTicket(ticketData: TicketCreateRequest): Promise<Ticket | null> {
    try {
      // Classificar automaticamente o ticket com IA (simulação)
      const classifiedTicket = await this.classifyTicketWithAI(ticketData);
      
      const { data, error } = await this.supabase
        .from('tickets')
        .insert([
          {
            title: ticketData.title,
            description: ticketData.description,
            category: classifiedTicket.category,
            priority: classifiedTicket.priority,
            status: 'open',
            created_by: ticketData.created_by,
            tags: ticketData.tags || [],
            metadata: ticketData.metadata || {}
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data as Ticket;
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      return null;
    }
  }

  /**
   * Obtém um ticket pelo ID
   */
  async getTicketById(id: string): Promise<Ticket | null> {
    try {
      const { data, error } = await this.supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Ticket;
    } catch (error) {
      console.error('Erro ao obter ticket:', error);
      return null;
    }
  }

  /**
   * Lista tickets com filtros
   */
  async listTickets(filter?: TicketFilter): Promise<Ticket[]> {
    try {
      let query = this.supabase.from('tickets').select('*');

      if (filter?.category) {
        query = query.eq('category', filter.category);
      }

      if (filter?.priority) {
        query = query.eq('priority', filter.priority);
      }

      if (filter?.status) {
        query = query.eq('status', filter.status);
      }

      if (filter?.assigned_to) {
        query = query.eq('assigned_to', filter.assigned_to);
      }

      if (filter?.created_by) {
        query = query.eq('created_by', filter.created_by);
      }

      if (filter?.tags && filter.tags.length > 0) {
        query = query.contains('tags', filter.tags);
      }

      if (filter?.limit) {
        query = query.limit(filter.limit);
      }

      if (filter?.offset) {
        query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Ticket[];
    } catch (error) {
      console.error('Erro ao listar tickets:', error);
      return [];
    }
  }

  /**
   * Atualiza um ticket
   */
  async updateTicket(updateData: TicketUpdateRequest): Promise<Ticket | null> {
    try {
      const updatePayload: any = {
        updated_at: new Date().toISOString()
      };

      if (updateData.status) updatePayload.status = updateData.status;
      if (updateData.priority) updatePayload.priority = updateData.priority;
      if (updateData.assigned_to) updatePayload.assigned_to = updateData.assigned_to;
      if (updateData.resolution_notes) updatePayload.resolution_notes = updateData.resolution_notes;

      // Se o ticket está sendo resolvido, definir a data de resolução
      if (updateData.status === 'resolved') {
        updatePayload.resolved_at = new Date().toISOString();
      }

      const { data, error } = await this.supabase
        .from('tickets')
        .update(updatePayload)
        .eq('id', updateData.id)
        .select()
        .single();

      if (error) throw error;
      return data as Ticket;
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error);
      return null;
    }
  }

  /**
   * Fecha um ticket
   */
  async closeTicket(ticketId: string, resolutionNotes?: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('tickets')
        .update({
          status: 'closed',
          resolved_at: new Date().toISOString(),
          resolution_notes: resolutionNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao fechar ticket:', error);
      return false;
    }
  }

  /**
   * Obtém estatísticas de tickets
   */
  async getTicketStats(): Promise<TicketStats> {
    try {
      const { data, error } = await this.supabase
        .from('tickets')
        .select('status, category, priority');

      if (error) throw error;

      const stats: TicketStats = {
        total: data.length,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        byCategory: {
          technical: 0,
          billing: 0,
          account: 0,
          order: 0,
          delivery: 0,
          feature_request: 0,
          complaint: 0,
          other: 0
        },
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          urgent: 0
        }
      };

      data.forEach(ticket => {
        // Contagem por status
        switch (ticket.status) {
          case 'open': stats.open++; break;
          case 'in_progress': stats.inProgress++; break;
          case 'resolved': stats.resolved++; break;
          case 'closed': stats.closed++; break;
        }

        // Contagem por categoria
        if (ticket.category in stats.byCategory) {
          stats.byCategory[ticket.category as TicketCategory]++;
        }

        // Contagem por prioridade
        if (ticket.priority in stats.byPriority) {
          stats.byPriority[ticket.priority as TicketPriority]++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas de tickets:', error);
      return {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        byCategory: {
          technical: 0,
          billing: 0,
          account: 0,
          order: 0,
          delivery: 0,
          feature_request: 0,
          complaint: 0,
          other: 0
        },
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          urgent: 0
        }
      };
    }
  }

  /**
   * Classifica automaticamente um ticket usando IA
   * Esta é uma implementação simulada - em produção, conectaria a um serviço de IA
   */
  private async classifyTicketWithAI(ticketData: TicketCreateRequest): Promise<TicketCreateRequest> {
    // Simulação de classificação automática com IA
    let category: TicketCategory = 'other';
    let priority: TicketPriority = 'medium';

    // Lógica simples de classificação baseada em palavras-chave
    const titleAndDescription = (ticketData.title + ' ' + ticketData.description).toLowerCase();

    // Classificação por categoria
    if (titleAndDescription.includes('pagamento') || titleAndDescription.includes('cobrança') || 
        titleAndDescription.includes('fatura') || titleAndDescription.includes('billing')) {
      category = 'billing';
    } else if (titleAndDescription.includes('conta') || titleAndDescription.includes('login') || 
               titleAndDescription.includes('senha') || titleAndDescription.includes('account')) {
      category = 'account';
    } else if (titleAndDescription.includes('pedido') || titleAndDescription.includes('order')) {
      category = 'order';
    } else if (titleAndDescription.includes('entrega') || titleAndDescription.includes('delivery')) {
      category = 'delivery';
    } else if (titleAndDescription.includes('erro') || titleAndDescription.includes('quebrado') || 
               titleAndDescription.includes('bug') || titleAndDescription.includes('technical')) {
      category = 'technical';
    } else if (titleAndDescription.includes('recurso') || titleAndDescription.includes('feature')) {
      category = 'feature_request';
    } else if (titleAndDescription.includes('reclamação') || titleAndDescription.includes('complaint')) {
      category = 'complaint';
    }

    // Classificação por prioridade
    if (titleAndDescription.includes('urgente') || titleAndDescription.includes('imediato') || 
        titleAndDescription.includes('urgent')) {
      priority = 'urgent';
    } else if (titleAndDescription.includes('importante') || titleAndDescription.includes('importante') || 
               titleAndDescription.includes('high')) {
      priority = 'high';
    } else if (titleAndDescription.includes('baixo') || titleAndDescription.includes('low')) {
      priority = 'low';
    }

    return {
      ...ticketData,
      category: ticketData.category || category,
      priority: ticketData.priority || priority
    };
  }

  /**
   * Escala um ticket para nível superior
   */
  async escalateTicket(ticketId: string, reason: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('tickets')
        .update({
          status: 'escalated',
          priority: 'urgent',
          updated_at: new Date().toISOString(),
          metadata: {
            escalation_reason: reason,
            escalated_at: new Date().toISOString()
          }
        })
        .eq('id', ticketId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao escalar ticket:', error);
      return false;
    }
  }

  /**
   * Adiciona uma tag a um ticket
   */
  async addTagToTicket(ticketId: string, tag: string): Promise<boolean> {
    try {
      const ticket = await this.getTicketById(ticketId);
      if (!ticket) return false;

      const updatedTags = [...new Set([...ticket.tags, tag])];

      const { error } = await this.supabase
        .from('tickets')
        .update({
          tags: updatedTags,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao adicionar tag ao ticket:', error);
      return false;
    }
  }

  /**
   * Remove uma tag de um ticket
   */
  async removeTagFromTicket(ticketId: string, tag: string): Promise<boolean> {
    try {
      const ticket = await this.getTicketById(ticketId);
      if (!ticket) return false;

      const updatedTags = ticket.tags.filter(t => t !== tag);

      const { error } = await this.supabase
        .from('tickets')
        .update({
          tags: updatedTags,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao remover tag do ticket:', error);
      return false;
    }
  }
}

// Instância singleton do serviço
export const ticketingService = new TicketingService();