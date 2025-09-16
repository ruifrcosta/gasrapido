# Sistema de Ticketing com Classificação Automática por IA e Workflow Definido

## Visão Geral

Este documento descreve a implementação de um sistema de ticketing avançado para o GasRápido, utilizando inteligência artificial para classificação automática de tickets e um workflow estruturado para resolução eficiente de problemas.

## Arquitetura do Sistema

### Componentes Principais

#### 1. Classificador de Tickets por IA
- **Processamento de Linguagem Natural (NLP)**
- **Classificação por categoria e prioridade**
- **Aprendizado contínuo com feedback**

#### 2. Sistema de Workflow
- **Fluxos de trabalho personalizados por tipo de ticket**
- **Atribuição automática de agentes**
- **Escalonamento baseado em SLA**

#### 3. Interface de Gestão
- **Dashboard para agentes de suporte**
- **Painéis de controle para supervisores**
- **Relatórios e análises**

#### 4. Integrações
- **API RESTful para integração com outros sistemas**
- **Webhooks para notificações em tempo real**
- **Conectores para Slack, Email e SMS**

## Implementação Técnica

### Estrutura de Dados

```typescript
// packages/shared/types/ticketing.ts

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: TicketCategory;
  subcategory?: string;
  requester: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  team?: string;
  sla: SLA;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  metadata: Record<string, any>;
}

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  slaHours: number;
  autoAssignTeam?: string;
  escalationPath?: string[];
}

export interface SLA {
  responseTime: number; // em horas
  resolutionTime: number; // em horas
  businessHoursOnly: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    role: 'customer' | 'agent' | 'system';
  };
  content: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface TicketWorkflow {
  id: string;
  name: string;
  category: string;
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  action: 'assign' | 'notify' | 'escalate' | 'close' | 'custom';
  target?: string; // ID do agente, equipe ou ação customizada
  delay?: number; // em minutos
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}
```

### Serviço de Classificação por IA

```typescript
// packages/shared/services/aiTicketClassifier.ts

import { Ticket, TicketCategory } from '../types/ticketing';

interface ClassificationResult {
  category: TicketCategory;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  suggestedTags: string[];
}

class AITicketClassifier {
  private categories: TicketCategory[] = [];
  private model: any; // Modelo de ML treinado

  constructor() {
    this.initializeCategories();
    this.loadModel();
  }

  private initializeCategories(): void {
    this.categories = [
      {
        id: 'payment',
        name: 'Problemas de Pagamento',
        description: 'Questões relacionadas a pagamentos, reembolsos e métodos de pagamento',
        priority: 'high',
        slaHours: 4,
        autoAssignTeam: 'finance'
      },
      {
        id: 'delivery',
        name: 'Problemas de Entrega',
        description: 'Questões relacionadas a atrasos, danos ou problemas com entregas',
        priority: 'high',
        slaHours: 2,
        autoAssignTeam: 'operations'
      },
      {
        id: 'account',
        name: 'Problemas de Conta',
        description: 'Questões relacionadas a login, senha, perfil e permissões',
        priority: 'medium',
        slaHours: 8,
        autoAssignTeam: 'support'
      },
      {
        id: 'technical',
        name: 'Problemas Técnicos',
        description: 'Questões relacionadas a bugs, erros e problemas técnicos',
        priority: 'high',
        slaHours: 6,
        autoAssignTeam: 'tech'
      },
      {
        id: 'billing',
        name: 'Questões de Faturamento',
        description: 'Questões relacionadas a faturas, cobranças e assinaturas',
        priority: 'medium',
        slaHours: 24,
        autoAssignTeam: 'finance'
      },
      {
        id: 'feature',
        name: 'Solicitações de Funcionalidades',
        description: 'Sugestões e solicitações de novas funcionalidades',
        priority: 'low',
        slaHours: 72,
        autoAssignTeam: 'product'
      }
    ];
  }

  async classifyTicket(title: string, description: string): Promise<ClassificationResult> {
    // Em produção, isso usaria um modelo de ML real
    // Para este exemplo, usaremos regras simples baseadas em palavras-chave
    
    const text = `${title} ${description}`.toLowerCase();
    
    // Classificar com base em palavras-chave
    if (this.containsKeywords(text, ['pagamento', 'pagar', 'cartão', 'mbway', 'reembolso'])) {
      return {
        category: this.categories.find(c => c.id === 'payment')!,
        confidence: 0.9,
        priority: 'high',
        suggestedTags: ['payment', 'billing']
      };
    }
    
    if (this.containsKeywords(text, ['entrega', 'atraso', 'danificado', 'perdido', 'motoboy'])) {
      return {
        category: this.categories.find(c => c.id === 'delivery')!,
        confidence: 0.85,
        priority: 'high',
        suggestedTags: ['delivery', 'logistics']
      };
    }
    
    if (this.containsKeywords(text, ['conta', 'login', 'senha', 'perfil', 'acesso'])) {
      return {
        category: this.categories.find(c => c.id === 'account')!,
        confidence: 0.8,
        priority: 'medium',
        suggestedTags: ['account', 'auth']
      };
    }
    
    if (this.containsKeywords(text, ['erro', 'não funciona', 'bug', 'crash', 'falha'])) {
      return {
        category: this.categories.find(c => c.id === 'technical')!,
        confidence: 0.75,
        priority: 'high',
        suggestedTags: ['technical', 'bug']
      };
    }
    
    // Categoria padrão
    return {
      category: this.categories.find(c => c.id === 'technical')!,
      confidence: 0.5,
      priority: 'medium',
      suggestedTags: ['general']
    };
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private async loadModel(): Promise<void> {
    // Em produção, carregar modelo de ML treinado
    // Exemplo: TensorFlow.js, ONNX.js, ou chamada para API de ML
    console.log('Loading ML model for ticket classification...');
  }
}

export default new AITicketClassifier();
```

### Serviço de Workflow

```typescript
// packages/shared/services/ticketWorkflowService.ts

import { Ticket, TicketWorkflow, WorkflowStep } from '../types/ticketing';
import { TicketService } from './ticketService';

class TicketWorkflowService {
  private workflows: TicketWorkflow[] = [];
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
    this.initializeWorkflows();
  }

  private initializeWorkflows(): void {
    // Workflow para problemas de pagamento
    this.workflows.push({
      id: 'payment-workflow',
      name: 'Workflow de Problemas de Pagamento',
      category: 'payment',
      steps: [
        {
          id: 'step-1',
          name: 'Notificar equipe de finanças',
          action: 'notify',
          target: 'finance-team'
        },
        {
          id: 'step-2',
          name: 'Atribuir ao agente especializado',
          action: 'assign',
          target: 'finance-specialist'
        },
        {
          id: 'step-3',
          name: 'Seguir até resolução',
          action: 'custom',
          target: 'follow-up-until-resolved'
        }
      ],
      conditions: [
        {
          field: 'category',
          operator: 'equals',
          value: 'payment'
        }
      ]
    });

    // Workflow para problemas de entrega
    this.workflows.push({
      id: 'delivery-workflow',
      name: 'Workflow de Problemas de Entrega',
      category: 'delivery',
      steps: [
        {
          id: 'step-1',
          name: 'Notificar equipe de operações',
          action: 'notify',
          target: 'operations-team'
        },
        {
          id: 'step-2',
          name: 'Atribuir ao gerente de operações',
          action: 'assign',
          target: 'operations-manager'
        },
        {
          id: 'step-3',
          name: 'Escalonar se não resolvido em 1 hora',
          action: 'escalate',
          target: 'senior-operations-manager',
          delay: 60
        }
      ],
      conditions: [
        {
          field: 'category',
          operator: 'equals',
          value: 'delivery'
        }
      ]
    });
  }

  async applyWorkflow(ticketId: string): Promise<void> {
    const ticket = await this.ticketService.getTicketById(ticketId);
    if (!ticket) return;

    const workflow = this.getWorkflowForTicket(ticket);
    if (!workflow) return;

    // Aplicar cada passo do workflow
    for (const step of workflow.steps) {
      await this.executeWorkflowStep(ticket, step);
    }
  }

  private getWorkflowForTicket(ticket: Ticket): TicketWorkflow | undefined {
    return this.workflows.find(workflow => 
      workflow.category === ticket.category.id
    );
  }

  private async executeWorkflowStep(ticket: Ticket, step: WorkflowStep): Promise<void> {
    switch (step.action) {
      case 'assign':
        await this.ticketService.assignTicket(ticket.id, step.target!);
        break;
      case 'notify':
        await this.notifyTeam(step.target!, ticket);
        break;
      case 'escalate':
        // Implementar lógica de escalonamento
        if (step.delay) {
          setTimeout(() => {
            this.escalateTicket(ticket.id, step.target!);
          }, step.delay * 60 * 1000); // Converter minutos para milissegundos
        }
        break;
      case 'close':
        await this.ticketService.updateTicketStatus(ticket.id, 'resolved');
        break;
      case 'custom':
        await this.executeCustomAction(step.target!, ticket);
        break;
    }
  }

  private async notifyTeam(teamId: string, ticket: Ticket): Promise<void> {
    // Implementar notificação para equipe
    console.log(`Notifying team ${teamId} about ticket ${ticket.id}`);
  }

  private async escalateTicket(ticketId: string, target: string): Promise<void> {
    // Implementar lógica de escalonamento
    console.log(`Escalating ticket ${ticketId} to ${target}`);
  }

  private async executeCustomAction(action: string, ticket: Ticket): Promise<void> {
    // Implementar ações customizadas
    console.log(`Executing custom action ${action} for ticket ${ticket.id}`);
  }
}

export default new TicketWorkflowService();
```

### Serviço de Tickets

```typescript
// packages/shared/services/ticketService.ts

import { Ticket, Comment } from '../types/ticketing';
import { AITicketClassifier } from './aiTicketClassifier';
import { TicketWorkflowService } from './ticketWorkflowService';

class TicketService {
  private tickets: Ticket[] = [];
  private classifier: AITicketClassifier;
  private workflowService: TicketWorkflowService;

  constructor() {
    this.classifier = new AITicketClassifier();
    this.workflowService = new TicketWorkflowService();
  }

  async createTicket(
    title: string,
    description: string,
    requester: Ticket['requester']
  ): Promise<Ticket> {
    // Classificar ticket usando IA
    const classification = await this.classifier.classifyTicket(title, description);
    
    // Criar ticket com classificação
    const ticket: Ticket = {
      id: this.generateId(),
      title,
      description,
      status: 'open',
      priority: classification.priority,
      category: classification.category,
      requester,
      sla: {
        responseTime: classification.category.slaHours,
        resolutionTime: classification.category.slaHours * 2,
        businessHoursOnly: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: classification.suggestedTags,
      attachments: [],
      comments: []
    };

    this.tickets.push(ticket);
    
    // Aplicar workflow automaticamente
    await this.workflowService.applyWorkflow(ticket.id);
    
    // Notificar interessados
    await this.notifyStakeholders(ticket);
    
    return ticket;
  }

  async getTicketById(ticketId: string): Promise<Ticket | undefined> {
    return this.tickets.find(ticket => ticket.id === ticketId);
  }

  async updateTicketStatus(ticketId: string, status: Ticket['status']): Promise<Ticket | null> {
    const ticket = await this.getTicketById(ticketId);
    if (!ticket) return null;

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    
    if (status === 'resolved') {
      ticket.resolvedAt = new Date().toISOString();
    }

    return ticket;
  }

  async assignTicket(ticketId: string, assigneeId: string): Promise<Ticket | null> {
    const ticket = await this.getTicketById(ticketId);
    if (!ticket) return null;

    // Em uma implementação real, buscar dados do assignee do banco de dados
    ticket.assignee = {
      id: assigneeId,
      name: `Assignee ${assigneeId}`,
      email: `${assigneeId}@gasrapido.com`
    };
    
    ticket.updatedAt = new Date().toISOString();
    
    return ticket;
  }

  async addComment(
    ticketId: string,
    author: Comment['author'],
    content: string,
    isPrivate: boolean = false
  ): Promise<Comment | null> {
    const ticket = await this.getTicketById(ticketId);
    if (!ticket) return null;

    const comment: Comment = {
      id: this.generateId(),
      author,
      content,
      createdAt: new Date().toISOString(),
      isPrivate
    };

    ticket.comments.push(comment);
    ticket.updatedAt = new Date().toISOString();
    
    return comment;
  }

  async searchTickets(filters: {
    status?: Ticket['status'];
    priority?: Ticket['priority'];
    category?: string;
    assignee?: string;
    requester?: string;
  }): Promise<Ticket[]> {
    return this.tickets.filter(ticket => {
      if (filters.status && ticket.status !== filters.status) return false;
      if (filters.priority && ticket.priority !== filters.priority) return false;
      if (filters.category && ticket.category.id !== filters.category) return false;
      if (filters.assignee && ticket.assignee?.id !== filters.assignee) return false;
      if (filters.requester && ticket.requester.id !== filters.requester) return false;
      return true;
    });
  }

  private async notifyStakeholders(ticket: Ticket): Promise<void> {
    // Notificar requester
    console.log(`Notifying requester ${ticket.requester.name} about ticket ${ticket.id}`);
    
    // Notificar equipe atribuída
    if (ticket.category.autoAssignTeam) {
      console.log(`Notifying team ${ticket.category.autoAssignTeam} about ticket ${ticket.id}`);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export { TicketService };
export default new TicketService();
```

## Interface de Usuário

### Dashboard do Agente de Suporte

```typescript
// apps/web/src/components/ticketing/AgentDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Ticket } from '@gasrapido/shared/types/ticketing';
import { ticketService } from '@gasrapido/shared/services/ticketService';

interface AgentDashboardProps {
  agentId: string;
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({ agentId }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, [agentId]);

  const loadTickets = async (): Promise<void> => {
    setLoading(true);
    try {
      const assignedTickets = await ticketService.searchTickets({
        assignee: agentId
      });
      setTickets(assignedTickets);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket['status']): Promise<void> => {
    try {
      await ticketService.updateTicketStatus(ticketId, status);
      loadTickets(); // Recarregar tickets após atualização
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  if (loading) {
    return <div>Carregando tickets...</div>;
  }

  return (
    <div className="agent-dashboard">
      <h1>Dashboard do Agente de Suporte</h1>
      
      <div className="tickets-summary">
        <div className="summary-card">
          <h3>Tickets Abertos</h3>
          <p>{tickets.filter(t => t.status === 'open').length}</p>
        </div>
        <div className="summary-card">
          <h3>Em Progresso</h3>
          <p>{tickets.filter(t => t.status === 'in_progress').length}</p>
        </div>
        <div className="summary-card">
          <h3>Resolvidos</h3>
          <p>{tickets.filter(t => t.status === 'resolved').length}</p>
        </div>
      </div>

      <div className="tickets-list">
        <h2>Meus Tickets</h2>
        {tickets.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-header">
              <h3>{ticket.title}</h3>
              <span className={`priority-${ticket.priority}`}>{ticket.priority}</span>
            </div>
            <p>{ticket.description}</p>
            <div className="ticket-footer">
              <span>Categoria: {ticket.category.name}</span>
              <span>Status: {ticket.status}</span>
              <button 
                onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                disabled={ticket.status === 'in_progress' || ticket.status === 'resolved'}
              >
                Em Progresso
              </button>
              <button 
                onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                disabled={ticket.status === 'resolved'}
              >
                Resolvido
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentDashboard;
```

### Formulário de Criação de Ticket

```typescript
// apps/web/src/components/ticketing/TicketForm.tsx

import React, { useState } from 'react';
import { ticketService } from '@gasrapido/shared/services/ticketService';

interface TicketFormProps {
  onSubmit: () => void;
  requester: {
    id: string;
    name: string;
    email: string;
  };
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, requester }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await ticketService.createTicket(title, description, requester);
      setTitle('');
      setDescription('');
      onSubmit();
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Erro ao criar ticket. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <h2>Criar Novo Ticket</h2>
      
      <div className="form-group">
        <label htmlFor="title">Título</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Criando...' : 'Criar Ticket'}
      </button>
    </form>
  );
};

export default TicketForm;
```

## Monitoramento e SLA

### Sistema de Monitoramento de SLA

```typescript
// packages/shared/services/slaMonitoringService.ts

import { Ticket } from '../types/ticketing';
import { TicketService } from './ticketService';

interface SLAViolation {
  ticketId: string;
  type: 'response' | 'resolution';
  overdueBy: number; // em horas
  assignedTo?: string;
}

class SLAMonitoringService {
  private ticketService: TicketService;
  private violations: SLAViolation[] = [];

  constructor() {
    this.ticketService = new TicketService();
    this.startMonitoring();
  }

  private startMonitoring(): void {
    // Verificar SLAs a cada 15 minutos
    setInterval(() => {
      this.checkSLAViolations();
    }, 15 * 60 * 1000);
  }

  private async checkSLAViolations(): Promise<void> {
    const openTickets = await this.ticketService.searchTickets({ status: 'open' });
    
    for (const ticket of openTickets) {
      this.checkTicketSLA(ticket);
    }
  }

  private checkTicketSLA(ticket: Ticket): void {
    const now = new Date();
    const createdAt = new Date(ticket.createdAt);
    
    // Verificar SLA de resposta
    const responseTimeHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    if (responseTimeHours > ticket.sla.responseTime) {
      this.registerSLAViolation({
        ticketId: ticket.id,
        type: 'response',
        overdueBy: responseTimeHours - ticket.sla.responseTime,
        assignedTo: ticket.assignee?.id
      });
    }
    
    // Verificar SLA de resolução (se houver data esperada)
    if (ticket.resolvedAt) {
      const resolvedAt = new Date(ticket.resolvedAt);
      const resolutionTimeHours = (resolvedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      if (resolutionTimeHours > ticket.sla.resolutionTime) {
        this.registerSLAViolation({
          ticketId: ticket.id,
          type: 'resolution',
          overdueBy: resolutionTimeHours - ticket.sla.resolutionTime,
          assignedTo: ticket.assignee?.id
        });
      }
    }
  }

  private registerSLAViolation(violation: SLAViolation): void {
    this.violations.push(violation);
    
    // Notificar stakeholders
    this.notifySLAViolation(violation);
    
    // Log para análise
    console.warn('SLA Violation:', violation);
  }

  private notifySLAViolation(violation: SLAViolation): void {
    // Enviar notificações por email, Slack, etc.
    console.log(`SLA violation for ticket ${violation.ticketId}: ${violation.type}`);
  }

  getActiveViolations(): SLAViolation[] {
    return this.violations.filter(v => {
      // Filtrar violações que ainda são relevantes
      return true;
    });
  }

  getViolationsByAssignee(assigneeId: string): SLAViolation[] {
    return this.violations.filter(v => v.assignedTo === assigneeId);
  }
}

export default new SLAMonitoringService();
```

## Integrações

### API RESTful

```typescript
// apps/web/src/pages/api/tickets.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { ticketService } from '@gasrapido/shared/services/ticketService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return handleGetTickets(req, res);
    case 'POST':
      return handleCreateTicket(req, res);
    case 'PUT':
      return handleUpdateTicket(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGetTickets(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { status, priority, category, assignee } = req.query;
    
    const tickets = await ticketService.searchTickets({
      status: status as any,
      priority: priority as any,
      category: category as string,
      assignee: assignee as string
    });
    
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Failed to get tickets:', error);
    res.status(500).json({ error: 'Failed to get tickets' });
  }
}

async function handleCreateTicket(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, description, requester } = req.body;
    
    const ticket = await ticketService.createTicket(title, description, requester);
    
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Failed to create ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
}

async function handleUpdateTicket(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { ticketId } = req.query;
    const { status, assignee } = req.body;
    
    let ticket = null;
    
    if (status) {
      ticket = await ticketService.updateTicketStatus(ticketId as string, status);
    }
    
    if (assignee) {
      ticket = await ticketService.assignTicket(ticketId as string, assignee);
    }
    
    if (ticket) {
      res.status(200).json(ticket);
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    console.error('Failed to update ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
}
```

## Próximos Passos

1. Implementar modelo de ML real para classificação de tickets
2. Adicionar suporte a múltiplos idiomas no sistema de classificação
3. Implementar sistema de feedback para melhorar a classificação por IA
4. Adicionar métricas de desempenho e relatórios
5. Implementar integração com sistemas de chat em tempo real
6. Adicionar suporte a automação avançada com regras personalizadas
7. Implementar sistema de conhecimento para respostas automáticas
8. Adicionar suporte a pesquisa semântica em tickets antigos