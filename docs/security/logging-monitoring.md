# Logging de Segurança e Monitoramento com Detecção de Anomalias

## Visão Geral

Este documento descreve a implementação de logging de segurança e monitoramento com detecção de anomalias para o GasRápido, visando proteger a plataforma contra atividades suspeitas e garantir a conformidade com requisitos de segurança.

## Arquitetura de Logging

### Estrutura de Logs

#### Logs de Segurança
- **Autenticação**: Tentativas de login, falhas, sucessos, MFA
- **Autorização**: Acessos a recursos protegidos, tentativas de privilege escalation
- **Auditoria**: Alterações em dados sensíveis, acesso a informações pessoais
- **API**: Chamadas a endpoints críticos, taxa de requisições, erros

#### Logs de Aplicação
- **Erros**: Exceções não tratadas, erros de validação
- **Performance**: Tempo de resposta, latência de serviços
- **Negócio**: Métricas de pedidos, conversões, cancelamentos

#### Logs de Infraestrutura
- **Sistema**: Uso de CPU, memória, disco
- **Rede**: Tráfego, conexões, latência
- **Container**: Status de containers, reinicializações

### Formato de Logs

```json
{
  "timestamp": "2023-12-01T10:30:00.123Z",
  "level": "info",
  "service": "user-service",
  "traceId": "abc123def456",
  "spanId": "789ghi012",
  "event": "user_login",
  "userId": "user-123",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "location": {
    "country": "AO",
    "city": "Luanda"
  },
  "metadata": {
    "authMethod": "password",
    "mfaUsed": true,
    "success": true
  }
}
```

## Implementação Técnica

### Sistema de Logging Centralizado

```typescript
// packages/shared/utils/securityLogger.ts

import winston from 'winston';
import { format, transports } from 'winston';

interface SecurityEvent {
  event: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: {
    country?: string;
    city?: string;
    lat?: number;
    lng?: number;
  };
  metadata?: Record<string, any>;
}

class SecurityLogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
      transports: [
        // Logs de segurança em arquivo separado
        new transports.File({
          filename: 'security.log',
          level: 'info',
          maxsize: 10000000, // 10MB
          maxFiles: 5
        }),
        // Logs de erro em arquivo separado
        new transports.File({
          filename: 'security-error.log',
          level: 'error'
        })
      ]
    });

    // Em produção, enviar logs para serviço centralizado
    if (process.env.NODE_ENV === 'production') {
      this.setupRemoteLogging();
    }
  }

  logSecurityEvent(event: SecurityEvent, level: 'info' | 'warn' | 'error' = 'info'): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: process.env.SERVICE_NAME || 'unknown',
      ...event
    };

    this.logger.log(level, event.event, logEntry);
    
    // Enviar para sistema de detecção de anomalias
    this.sendToAnomalyDetector(logEntry);
  }

  logAuthenticationAttempt(
    userId: string,
    ipAddress: string,
    success: boolean,
    method: string,
    mfaUsed?: boolean
  ): void {
    this.logSecurityEvent({
      event: 'authentication_attempt',
      userId,
      ipAddress,
      metadata: {
        success,
        method,
        mfaUsed
      }
    }, success ? 'info' : 'warn');
  }

  logAuthorizationFailure(
    userId: string,
    resource: string,
    action: string,
    ipAddress: string
  ): void {
    this.logSecurityEvent({
      event: 'authorization_failure',
      userId,
      ipAddress,
      metadata: {
        resource,
        action
      }
    }, 'warn');
  }

  logDataAccess(
    userId: string,
    resource: string,
    action: string,
    ipAddress: string,
    sensitive: boolean = false
  ): void {
    const level = sensitive ? 'warn' : 'info';
    this.logSecurityEvent({
      event: 'data_access',
      userId,
      ipAddress,
      metadata: {
        resource,
        action,
        sensitive
      }
    }, level);
  }

  private setupRemoteLogging(): void {
    // Configurar envio para ELK Stack, Splunk, ou outro serviço
    // Implementação específica depende do serviço escolhido
  }

  private sendToAnomalyDetector(logEntry: any): void {
    // Enviar log para serviço de detecção de anomalias
    // Implementação assíncrona para não impactar performance
    setImmediate(() => {
      // Código para enviar ao detector de anomalias
    });
  }
}

export default new SecurityLogger();
```

### Middleware de Logging para APIs

```typescript
// packages/shared/middleware/loggingMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import securityLogger from '../utils/securityLogger';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Capturar timestamp de início
  const startTime = Date.now();
  
  // Log da requisição
  securityLogger.logSecurityEvent({
    event: 'api_request',
    userId: (req as any).user?.id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    metadata: {
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      query: req.query
    }
  });

  // Monitorar resposta
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    securityLogger.logSecurityEvent({
      event: 'api_response',
      userId: (req as any).user?.id,
      ipAddress: req.ip,
      metadata: {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration,
        userAgent: req.get('User-Agent')
      }
    }, res.statusCode >= 400 ? 'warn' : 'info');
  });

  next();
};
```

## Detecção de Anomalias

### Sistema de Detecção

```typescript
// packages/shared/services/anomalyDetectionService.ts

interface AnomalyRule {
  id: string;
  name: string;
  description: string;
  condition: (event: any) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actions: string[];
}

interface AnomalyAlert {
  id: string;
  ruleId: string;
  eventId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  details: any;
}

class AnomalyDetectionService {
  private rules: AnomalyRule[] = [];
  private alerts: AnomalyAlert[] = [];

  constructor() {
    this.initializeRules();
  }

  private initializeRules(): void {
    // Regra: Muitas tentativas de login falhas em curto período
    this.rules.push({
      id: 'login-failures',
      name: 'Multiple Failed Logins',
      description: 'Detects multiple failed login attempts from same IP',
      condition: (event: any) => {
        return event.event === 'authentication_attempt' && 
               event.metadata?.success === false;
      },
      severity: 'medium',
      actions: ['rate_limit_ip', 'notify_security_team']
    });

    // Regra: Acesso a dados sensíveis fora do horário comercial
    this.rules.push({
      id: 'sensitive-access-off-hours',
      name: 'Sensitive Data Access Off Hours',
      description: 'Detects access to sensitive data outside business hours',
      condition: (event: any) => {
        return event.event === 'data_access' && 
               event.metadata?.sensitive === true &&
               this.isOffHours(new Date(event.timestamp));
      },
      severity: 'high',
      actions: ['notify_security_team', 'require_additional_auth']
    });

    // Regra: Acesso de localização suspeita
    this.rules.push({
      id: 'suspicious-location',
      name: 'Suspicious Location Access',
      description: 'Detects access from unusual geographic locations',
      condition: (event: any) => {
        return event.event === 'authentication_attempt' && 
               this.isSuspiciousLocation(event.location);
      },
      severity: 'high',
      actions: ['require_mfa', 'notify_user', 'notify_security_team']
    });

    // Regra: Taxa alta de requisições
    this.rules.push({
      id: 'high-request-rate',
      name: 'High Request Rate',
      description: 'Detects unusually high API request rates',
      condition: (event: any) => {
        return event.event === 'api_request' && 
               this.isHighRequestRate(event.userId || event.ipAddress);
      },
      severity: 'medium',
      actions: ['rate_limit', 'notify_ops_team']
    });
  }

  analyzeEvent(event: any): void {
    for (const rule of this.rules) {
      if (rule.condition(event)) {
        this.generateAlert(rule, event);
      }
    }
  }

  private generateAlert(rule: AnomalyRule, event: any): void {
    const alert: AnomalyAlert = {
      id: this.generateId(),
      ruleId: rule.id,
      eventId: event.id || this.generateId(),
      severity: rule.severity,
      timestamp: new Date().toISOString(),
      details: {
        event,
        rule: {
          id: rule.id,
          name: rule.name
        }
      }
    };

    this.alerts.push(alert);
    
    // Executar ações configuradas
    this.executeActions(rule.actions, alert);
    
    // Notificar sistemas externos se necessário
    if (rule.severity === 'high' || rule.severity === 'critical') {
      this.notifySecurityTeam(alert);
    }
  }

  private executeActions(actions: string[], alert: AnomalyAlert): void {
    for (const action of actions) {
      switch (action) {
        case 'rate_limit_ip':
          this.rateLimitIP(alert.details.event.ipAddress);
          break;
        case 'rate_limit':
          this.rateLimitUser(alert.details.event.userId);
          break;
        case 'notify_security_team':
          this.notifySecurityTeam(alert);
          break;
        case 'notify_user':
          this.notifyUser(alert.details.event.userId, alert);
          break;
        case 'require_additional_auth':
          this.requireAdditionalAuth(alert.details.event.userId);
          break;
        case 'require_mfa':
          this.requireMFA(alert.details.event.userId);
          break;
        case 'notify_ops_team':
          this.notifyOpsTeam(alert);
          break;
      }
    }
  }

  private isOffHours(date: Date): boolean {
    const hour = date.getHours();
    // Considerar off-hours como antes das 8h e após as 18h
    return hour < 8 || hour > 18;
  }

  private isSuspiciousLocation(location: any): boolean {
    // Implementar lógica para detectar localizações suspeitas
    // Por exemplo: acesso de múltiplos países em curto período
    return false; // Placeholder
  }

  private isHighRequestRate(identifier: string): boolean {
    // Implementar lógica para detectar alta taxa de requisições
    // Por exemplo: mais de 100 requisições por minuto
    return false; // Placeholder
  }

  private rateLimitIP(ip: string): void {
    // Implementar rate limiting por IP
    console.log(`Rate limiting IP: ${ip}`);
  }

  private rateLimitUser(userId: string): void {
    // Implementar rate limiting por usuário
    console.log(`Rate limiting user: ${userId}`);
  }

  private notifySecurityTeam(alert: AnomalyAlert): void {
    // Implementar notificação para equipe de segurança
    console.log(`Security alert: ${alert.id}`, alert);
  }

  private notifyUser(userId: string, alert: AnomalyAlert): void {
    // Implementar notificação para usuário
    console.log(`User notification: ${userId}`, alert);
  }

  private notifyOpsTeam(alert: AnomalyAlert): void {
    // Implementar notificação para equipe de operações
    console.log(`Ops notification: ${alert.id}`, alert);
  }

  private requireAdditionalAuth(userId: string): void {
    // Implementar exigência de autenticação adicional
    console.log(`Requiring additional auth for user: ${userId}`);
  }

  private requireMFA(userId: string): void {
    // Implementar exigência de MFA
    console.log(`Requiring MFA for user: ${userId}`);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default new AnomalyDetectionService();
```

## Monitoramento em Tempo Real

### Dashboard de Segurança

```typescript
// packages/shared/services/securityDashboardService.ts

interface SecurityMetric {
  name: string;
  value: number;
  threshold?: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

class SecurityDashboardService {
  private metrics: Map<string, SecurityMetric> = new Map();
  private incidents: SecurityIncident[] = [];

  constructor() {
    this.initializeMetrics();
    this.startMetricCollection();
  }

  private initializeMetrics(): void {
    this.metrics.set('failed_logins', {
      name: 'Failed Login Attempts',
      value: 0,
      threshold: 100,
      trend: 'stable',
      lastUpdated: new Date().toISOString()
    });

    this.metrics.set('suspicious_activities', {
      name: 'Suspicious Activities',
      value: 0,
      threshold: 10,
      trend: 'stable',
      lastUpdated: new Date().toISOString()
    });

    this.metrics.set('api_errors', {
      name: 'API Errors',
      value: 0,
      threshold: 50,
      trend: 'stable',
      lastUpdated: new Date().toISOString()
    });

    this.metrics.set('data_access', {
      name: 'Data Access Requests',
      value: 0,
      trend: 'stable',
      lastUpdated: new Date().toISOString()
    });
  }

  updateMetric(name: string, value: number): void {
    const metric = this.metrics.get(name);
    if (metric) {
      const previousValue = metric.value;
      metric.value = value;
      metric.lastUpdated = new Date().toISOString();
      
      // Determinar tendência
      if (value > previousValue) {
        metric.trend = 'up';
      } else if (value < previousValue) {
        metric.trend = 'down';
      } else {
        metric.trend = 'stable';
      }
      
      this.metrics.set(name, metric);
    }
  }

  createIncident(
    title: string,
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical'
  ): SecurityIncident {
    const incident: SecurityIncident = {
      id: this.generateId(),
      title,
      description,
      severity,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.incidents.push(incident);
    return incident;
  }

  updateIncidentStatus(
    incidentId: string,
    status: 'open' | 'investigating' | 'resolved',
    assignedTo?: string
  ): SecurityIncident | null {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (incident) {
      incident.status = status;
      incident.assignedTo = assignedTo;
      incident.updatedAt = new Date().toISOString();
      return incident;
    }
    return null;
  }

  getMetrics(): SecurityMetric[] {
    return Array.from(this.metrics.values());
  }

  getIncidents(filter?: {
    severity?: 'low' | 'medium' | 'high' | 'critical';
    status?: 'open' | 'investigating' | 'resolved';
  }): SecurityIncident[] {
    let filtered = this.incidents;
    
    if (filter?.severity) {
      filtered = filtered.filter(i => i.severity === filter.severity);
    }
    
    if (filter?.status) {
      filtered = filtered.filter(i => i.status === filter.status);
    }
    
    return filtered;
  }

  private startMetricCollection(): void {
    // Coletar métricas em intervalos regulares
    setInterval(() => {
      this.collectMetrics();
    }, 60000); // A cada minuto
  }

  private collectMetrics(): void {
    // Implementar coleta de métricas do sistema
    // Esta é uma implementação de exemplo
    this.updateMetric('failed_logins', Math.floor(Math.random() * 20));
    this.updateMetric('suspicious_activities', Math.floor(Math.random() * 5));
    this.updateMetric('api_errors', Math.floor(Math.random() * 30));
    this.updateMetric('data_access', Math.floor(Math.random() * 100));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default new SecurityDashboardService();
```

## Integração com Ferramentas Externas

### ELK Stack (Elasticsearch, Logstash, Kibana)

```yaml
# docker-compose.logging.yml

version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    depends_on:
      - elasticsearch
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logs:/var/log/gasrapido
    ports:
      - "5044:5044"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    depends_on:
      - elasticsearch
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=["http://elasticsearch:9200"]

volumes:
  es_data:
```

### Configuração do Logstash

```ruby
# logstash/pipeline/security.conf

input {
  file {
    path => "/var/log/gasrapido/security.log"
    start_position => "beginning"
    sincedb_path => "/dev/null"
    codec => "json"
  }
}

filter {
  # Parse de campos específicos
  if [event] == "authentication_attempt" {
    mutate {
      add_tag => [ "auth" ]
    }
  }
  
  if [event] == "authorization_failure" {
    mutate {
      add_tag => [ "authz" ]
    }
  }
  
  if [metadata][sensitive] == true {
    mutate {
      add_tag => [ "sensitive" ]
    }
  }
  
  # Geolocalização de IPs
  geoip {
    source => "ipAddress"
    target => "geoip"
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "gasrapido-security-%{+YYYY.MM.dd}"
  }
}
```

## Alertas e Notificações

### Sistema de Alertas

```typescript
// packages/shared/services/alertService.ts

interface AlertConfig {
  id: string;
  name: string;
  condition: string; // Expressão que define quando alertar
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[]; // canais de notificação
  cooldown: number; // tempo em segundos para evitar spam
  enabled: boolean;
}

interface AlertNotification {
  id: string;
  alertConfigId: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  sentAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

class AlertService {
  private configs: AlertConfig[] = [];
  private notifications: AlertNotification[] = [];
  private lastTriggered: Map<string, number> = new Map();

  constructor() {
    this.loadAlertConfigs();
  }

  private loadAlertConfigs(): void {
    // Configurações de alertas padrão
    this.configs = [
      {
        id: 'high-failed-logins',
        name: 'High Failed Login Attempts',
        condition: 'failed_logins > 50',
        severity: 'high',
        channels: ['slack-security', 'email-security-team'],
        cooldown: 300, // 5 minutos
        enabled: true
      },
      {
        id: 'suspicious-activity',
        name: 'Suspicious Activity Detected',
        condition: 'suspicious_activities > 5',
        severity: 'critical',
        channels: ['slack-security', 'sms-admin', 'email-security-team'],
        cooldown: 60, // 1 minuto
        enabled: true
      },
      {
        id: 'data-breach-attempt',
        name: 'Potential Data Breach Attempt',
        condition: 'unauthorized_data_access > 10',
        severity: 'critical',
        channels: ['slack-security', 'sms-admin', 'email-security-team', 'phone-call-ceo'],
        cooldown: 30, // 30 segundos
        enabled: true
      }
    ];
  }

  triggerAlert(configId: string, message: string): void {
    const config = this.configs.find(c => c.id === configId);
    if (!config || !config.enabled) return;

    // Verificar cooldown
    const lastTriggered = this.lastTriggered.get(configId);
    const now = Date.now();
    if (lastTriggered && (now - lastTriggered) < (config.cooldown * 1000)) {
      return; // Ainda em cooldown
    }

    // Registrar o trigger
    this.lastTriggered.set(configId, now);

    // Criar notificação
    const notification: AlertNotification = {
      id: this.generateId(),
      alertConfigId: configId,
      message,
      severity: config.severity,
      channels: config.channels,
      sentAt: new Date().toISOString(),
      acknowledged: false
    };

    this.notifications.push(notification);

    // Enviar notificações
    this.sendNotifications(notification);
  }

  acknowledgeAlert(notificationId: string, userId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.acknowledged = true;
      notification.acknowledgedBy = userId;
      notification.acknowledgedAt = new Date().toISOString();
    }
  }

  private sendNotifications(notification: AlertNotification): void {
    for (const channel of notification.channels) {
      switch (channel) {
        case 'slack-security':
          this.sendSlackNotification(notification);
          break;
        case 'email-security-team':
          this.sendEmailNotification(notification);
          break;
        case 'sms-admin':
          this.sendSmsNotification(notification);
          break;
        case 'phone-call-ceo':
          this.sendPhoneCallNotification(notification);
          break;
      }
    }
  }

  private sendSlackNotification(notification: AlertNotification): void {
    // Implementar envio via Slack webhook
    console.log(`Sending Slack notification: ${notification.message}`);
  }

  private sendEmailNotification(notification: AlertNotification): void {
    // Implementar envio de email
    console.log(`Sending email notification: ${notification.message}`);
  }

  private sendSmsNotification(notification: AlertNotification): void {
    // Implementar envio de SMS
    console.log(`Sending SMS notification: ${notification.message}`);
  }

  private sendPhoneCallNotification(notification: AlertNotification): void {
    // Implementar chamada telefônica
    console.log(`Sending phone call notification: ${notification.message}`);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default new AlertService();
```

## Conformidade e Auditoria

### Sistema de Auditoria Imutável

```typescript
// packages/shared/services/auditService.ts

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  signature: string; // Assinatura digital para integridade
}

class AuditService {
  private auditLogs: AuditLog[] = [];

  logAction(
    userId: string,
    action: string,
    resource: string,
    oldValue?: any,
    newValue?: any
  ): void {
    const auditLog: AuditLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      userId,
      action,
      resource,
      oldValue,
      newValue,
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
      sessionId: this.getSessionId(),
      signature: this.generateSignature(userId, action, resource)
    };

    this.auditLogs.push(auditLog);
    
    // Armazenar em sistema externo para imutabilidade
    this.storeInImmutableStorage(auditLog);
  }

  private generateSignature(
    userId: string,
    action: string,
    resource: string
  ): string {
    // Gerar assinatura digital para verificar integridade
    // Em produção, usar chave privada para assinar
    return `${userId}-${action}-${resource}-${Date.now()}`;
  }

  private storeInImmutableStorage(log: AuditLog): void {
    // Em produção, armazenar em sistema imutável como:
    // - Blockchain
    // - Amazon S3 com versioning e MFA delete
    // - Google Cloud Storage com retenção de dados
    // - Sistema de arquivos com append-only
    console.log('Storing audit log in immutable storage:', log);
  }

  private getClientIP(): string {
    // Implementar obtenção do IP real do cliente
    return '127.0.0.1';
  }

  private getUserAgent(): string {
    // Implementar obtenção do user agent
    return 'unknown';
  }

  private getSessionId(): string {
    // Implementar obtenção do session ID
    return 'session-123';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default new AuditService();
```

## Próximos Passos

1. Implementar integração com ferramentas de SIEM (Security Information and Event Management)
2. Adicionar machine learning para detecção mais precisa de anomalias
3. Implementar sistema de resposta automática a incidentes
4. Adicionar suporte a padrões de conformidade (GDPR, ISO 27001)
5. Implementar criptografia de logs para dados sensíveis
6. Adicionar backup e recuperação de logs de segurança
7. Implementar dashboard em tempo real com Kibana ou Grafana
8. Adicionar suporte a threat intelligence feeds