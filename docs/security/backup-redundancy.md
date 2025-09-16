# Backup Automático Encriptado e Redundância Multi-região

## Visão Geral

Este documento descreve a estratégia de backup automático encriptado e redundância multi-região para o GasRápido, garantindo a proteção dos dados e a continuidade dos negócios em caso de falhas ou desastres.

## Estratégia de Backup

### Princípios

1. **Backup Automático**: Todos os backups são automatizados e agendados
2. **Encriptação**: Todos os backups são encriptados em repouso
3. **Redundância**: Cópias armazenadas em múltiplas regiões geográficas
4. **Retenção**: Políticas de retenção baseadas em requisitos legais e de negócios
5. **Testes**: Restaurações regulares para verificar integridade
6. **Monitoramento**: Alertas para falhas de backup

### Tipos de Backup

#### 1. Backup Completo
- Cópia completa de todos os dados
- Executado semanalmente
- Ponto de recuperação base

#### 2. Backup Incremental
- Apenas dados alterados desde o último backup
- Executado diariamente
- Menor uso de armazenamento e tempo

#### 3. Backup Diferencial
- Dados alterados desde o último backup completo
- Executado duas vezes por semana
- Equilíbrio entre tempo de backup e recuperação

## Implementação Técnica

### Estrutura de Armazenamento

#### Regiões Geográficas
- **Primária**: Europa Ocidental (AWS eu-west-1)
- **Secundária**: Leste dos EUA (AWS us-east-1)
- **Terciária**: Ásia-Pacífico (AWS ap-southeast-1)

#### Serviços de Armazenamento
- **Banco de Dados**: Amazon RDS com replicação multi-AZ
- **Arquivos**: Amazon S3 com versionamento
- **Logs**: Amazon CloudWatch Logs
- **Snapshots**: Amazon EBS snapshots

### Encriptação

#### Chaves de Encriptação
```bash
# AWS KMS para gerenciamento de chaves
aws kms create-key \
  --description "GasRapido Backup Encryption Key" \
  --tags TagKey=Project,TagValue=GasRapido

# Chave mestra para backup
aws kms create-alias \
  --alias-name alias/gasrapido-backup-key \
  --target-key-id <key-id>
```

#### Encriptação de Dados
```typescript
// packages/shared/utils/backupEncryption.ts

import { KMSClient, EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms";

class BackupEncryption {
  private kmsClient: KMSClient;
  private keyId: string;

  constructor() {
    this.kmsClient = new KMSClient({ region: "eu-west-1" });
    this.keyId = process.env.BACKUP_ENCRYPTION_KEY_ID || "alias/gasrapido-backup-key";
  }

  async encryptData(data: string): Promise<string> {
    try {
      const command = new EncryptCommand({
        KeyId: this.keyId,
        Plaintext: Buffer.from(data)
      });

      const response = await this.kmsClient.send(command);
      return Buffer.from(response.CiphertextBlob!).toString('base64');
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  async decryptData(encryptedData: string): Promise<string> {
    try {
      const command = new DecryptCommand({
        CiphertextBlob: Buffer.from(encryptedData, 'base64')
      });

      const response = await this.kmsClient.send(command);
      return Buffer.from(response.Plaintext!).toString();
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }
}

export default new BackupEncryption();
```

### Scripts de Backup

#### Backup do Banco de Dados
```bash
#!/bin/bash
# scripts/backup-database.sh

# Configurações
BACKUP_BUCKET="gasrapido-backups-eu-west-1"
BACKUP_REGION="eu-west-1"
ENCRYPTION_KEY="alias/gasrapido-backup-key"

# Timestamp para o backup
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_NAME="gasrapido-db-backup-$TIMESTAMP"

# Criar backup do banco de dados
pg_dump \
  --host=$DB_HOST \
  --port=$DB_PORT \
  --username=$DB_USER \
  --dbname=$DB_NAME \
  --format=custom \
  --file="/tmp/$BACKUP_NAME.dump"

# Encriptar backup
aws kms encrypt \
  --key-id $ENCRYPTION_KEY \
  --plaintext fileb:///tmp/$BACKUP_NAME.dump \
  --output text \
  --query CiphertextBlob \
  > /tmp/$BACKUP_NAME.dump.encrypted

# Upload para S3
aws s3 cp /tmp/$BACKUP_NAME.dump.encrypted s3://$BACKUP_BUCKET/database/$BACKUP_NAME.dump.encrypted

# Copiar para regiões secundárias
aws s3 cp s3://$BACKUP_BUCKET/database/$BACKUP_NAME.dump.encrypted s3://gasrapido-backups-us-east-1/database/$BACKUP_NAME.dump.encrypted
aws s3 cp s3://$BACKUP_BUCKET/database/$BACKUP_NAME.dump.encrypted s3://gasrapido-backups-ap-southeast-1/database/$BACKUP_NAME.dump.encrypted

# Limpar arquivos temporários
rm /tmp/$BACKUP_NAME.dump /tmp/$BACKUP_NAME.dump.encrypted

# Registrar backup no sistema de metadados
echo "Backup completed: $BACKUP_NAME" >> /var/log/gasrapido-backup.log
```

#### Backup de Arquivos
```bash
#!/bin/bash
# scripts/backup-files.sh

# Configurações
BACKUP_BUCKET="gasrapido-backups-eu-west-1"
SOURCE_DIR="/app/uploads"
ENCRYPTION_KEY="alias/gasrapido-backup-key"

# Timestamp para o backup
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_NAME="gasrapido-files-backup-$TIMESTAMP"

# Criar arquivo tar
tar -czf /tmp/$BACKUP_NAME.tar.gz -C $SOURCE_DIR .

# Encriptar backup
aws kms encrypt \
  --key-id $ENCRYPTION_KEY \
  --plaintext fileb:///tmp/$BACKUP_NAME.tar.gz \
  --output text \
  --query CiphertextBlob \
  > /tmp/$BACKUP_NAME.tar.gz.encrypted

# Upload para S3
aws s3 cp /tmp/$BACKUP_NAME.tar.gz.encrypted s3://$BACKUP_BUCKET/files/$BACKUP_NAME.tar.gz.encrypted

# Copiar para regiões secundárias
aws s3 cp s3://$BACKUP_BUCKET/files/$BACKUP_NAME.tar.gz.encrypted s3://gasrapido-backups-us-east-1/files/$BACKUP_NAME.tar.gz.encrypted
aws s3 cp s3://$BACKUP_BUCKET/files/$BACKUP_NAME.tar.gz.encrypted s3://gasrapido-backups-ap-southeast-1/files/$BACKUP_NAME.tar.gz.encrypted

# Limpar arquivos temporários
rm /tmp/$BACKUP_NAME.tar.gz /tmp/$BACKUP_NAME.tar.gz.encrypted

# Registrar backup no sistema de metadados
echo "File backup completed: $BACKUP_NAME" >> /var/log/gasrapido-backup.log
```

### Sistema de Metadados de Backup

```typescript
// packages/shared/services/backupMetadataService.ts

interface BackupMetadata {
  id: string;
  name: string;
  type: 'database' | 'files' | 'logs';
  size: number;
  createdAt: string;
  expiresAt: string;
  regions: string[];
  status: 'completed' | 'failed' | 'in_progress';
  checksum: string;
  encryptionKeyId: string;
  retentionDays: number;
}

class BackupMetadataService {
  private metadata: BackupMetadata[] = [];

  createBackupRecord(
    name: string,
    type: 'database' | 'files' | 'logs',
    size: number,
    regions: string[] = ['eu-west-1', 'us-east-1', 'ap-southeast-1']
  ): BackupMetadata {
    const retentionDays = type === 'database' ? 90 : 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + retentionDays);

    const backup: BackupMetadata = {
      id: this.generateId(),
      name,
      type,
      size,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      regions,
      status: 'in_progress',
      checksum: '',
      encryptionKeyId: process.env.BACKUP_ENCRYPTION_KEY_ID || 'alias/gasrapido-backup-key',
      retentionDays
    };

    this.metadata.push(backup);
    return backup;
  }

  updateBackupStatus(
    backupId: string,
    status: 'completed' | 'failed' | 'in_progress',
    checksum?: string
  ): void {
    const backup = this.metadata.find(b => b.id === backupId);
    if (backup) {
      backup.status = status;
      if (checksum) {
        backup.checksum = checksum;
      }
    }
  }

  getExpiredBackups(): BackupMetadata[] {
    const now = new Date();
    return this.metadata.filter(backup => {
      const expiryDate = new Date(backup.expiresAt);
      return expiryDate < now && backup.status === 'completed';
    });
  }

  deleteBackupRecord(backupId: string): boolean {
    const initialLength = this.metadata.length;
    this.metadata = this.metadata.filter(b => b.id !== backupId);
    return this.metadata.length < initialLength;
  }

  getBackupById(backupId: string): BackupMetadata | undefined {
    return this.metadata.find(b => b.id === backupId);
  }

  getBackupsByType(type: 'database' | 'files' | 'logs'): BackupMetadata[] {
    return this.metadata.filter(b => b.type === type);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default new BackupMetadataService();
```

## Redundância Multi-região

### Estratégia de Replicação

#### Banco de Dados
```yaml
# k8s/database/deployment.yaml

apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-primary
spec:
  serviceName: postgres
  replicas: 1
  template:
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_DB
          value: gasrapido
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc-primary
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-standby-us-east
spec:
  serviceName: postgres-standby-us-east
  replicas: 1
  template:
    spec:
      containers:
      - name: postgres-standby
        image: postgres:15
        env:
        - name: POSTGRES_DB
          value: gasrapido
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        - name: STANDBY_MODE
          value: "on"
        - name: PRIMARY_HOST
          value: "postgres-primary.gasrapido.svc.cluster.local"
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc-standby-us-east
```

#### Armazenamento de Arquivos
```typescript
// packages/shared/services/multiRegionStorageService.ts

import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand
} from "@aws-sdk/client-s3";

interface StorageRegion {
  name: string;
  endpoint: string;
  bucket: string;
}

class MultiRegionStorageService {
  private regions: StorageRegion[] = [
    {
      name: 'eu-west-1',
      endpoint: 'https://s3.eu-west-1.amazonaws.com',
      bucket: 'gasrapido-backups-eu-west-1'
    },
    {
      name: 'us-east-1',
      endpoint: 'https://s3.us-east-1.amazonaws.com',
      bucket: 'gasrapido-backups-us-east-1'
    },
    {
      name: 'ap-southeast-1',
      endpoint: 'https://s3.ap-southeast-1.amazonaws.com',
      bucket: 'gasrapido-backups-ap-southeast-1'
    }
  ];

  private clients: Map<string, S3Client> = new Map();

  constructor() {
    this.initializeClients();
  }

  private initializeClients(): void {
    for (const region of this.regions) {
      const client = new S3Client({
        region: region.name,
        endpoint: region.endpoint
      });
      this.clients.set(region.name, client);
    }
  }

  async storeObject(
    key: string,
    data: Buffer,
    contentType: string = 'application/octet-stream'
  ): Promise<void> {
    // Armazenar na região primária
    const primaryRegion = this.regions[0];
    const primaryClient = this.clients.get(primaryRegion.name)!;
    
    const putCommand = new PutObjectCommand({
      Bucket: primaryRegion.bucket,
      Key: key,
      Body: data,
      ContentType: contentType,
      ServerSideEncryption: 'aws:kms',
      SSEKMSKeyId: process.env.BACKUP_ENCRYPTION_KEY_ID
    });

    await primaryClient.send(putCommand);

    // Replicar para regiões secundárias
    for (let i = 1; i < this.regions.length; i++) {
      const region = this.regions[i];
      const client = this.clients.get(region.name)!;
      
      const copyCommand = new CopyObjectCommand({
        Bucket: region.bucket,
        Key: key,
        CopySource: `${primaryRegion.bucket}/${key}`,
        ServerSideEncryption: 'aws:kms',
        SSEKMSKeyId: process.env.BACKUP_ENCRYPTION_KEY_ID
      });

      try {
        await client.send(copyCommand);
      } catch (error) {
        console.error(`Failed to replicate to ${region.name}:`, error);
        // Log error but continue with other regions
      }
    }
  }

  async getObject(
    key: string,
    region?: string
  ): Promise<Buffer | null> {
    const targetRegion = region || this.regions[0].name;
    const client = this.clients.get(targetRegion);
    
    if (!client) {
      throw new Error(`Region ${targetRegion} not configured`);
    }

    // Implementar obtenção de objeto
    // Esta é uma implementação simplificada
    return null;
  }
}

export default new MultiRegionStorageService();
```

## Políticas de Retenção

### Estratégia de Retenção

```typescript
// packages/shared/services/retentionPolicyService.ts

interface RetentionPolicy {
  name: string;
  description: string;
  retentionDays: number;
  backupTypes: ('database' | 'files' | 'logs')[];
  complianceRequirements: string[];
}

class RetentionPolicyService {
  private policies: RetentionPolicy[] = [
    {
      name: 'critical-data',
      description: 'Dados críticos para operação do negócio',
      retentionDays: 365,
      backupTypes: ['database'],
      complianceRequirements: ['GDPR', 'SOX']
    },
    {
      name: 'operational-data',
      description: 'Dados operacionais e logs',
      retentionDays: 90,
      backupTypes: ['files', 'logs'],
      complianceRequirements: ['GDPR']
    },
    {
      name: 'development-data',
      description: 'Dados de desenvolvimento e testes',
      retentionDays: 30,
      backupTypes: ['database', 'files'],
      complianceRequirements: []
    }
  ];

  getPolicyForBackupType(type: 'database' | 'files' | 'logs'): RetentionPolicy {
    return this.policies.find(policy => 
      policy.backupTypes.includes(type)
    ) || this.policies[1]; // Padrão para operational-data
  }

  isComplianceRequired(policyName: string, regulation: string): boolean {
    const policy = this.policies.find(p => p.name === policyName);
    return policy?.complianceRequirements.includes(regulation) || false;
  }

  cleanupExpiredBackups(): void {
    // Esta função seria chamada por um cron job
    // para remover backups expirados
    console.log('Cleaning up expired backups...');
  }
}

export default new RetentionPolicyService();
```

## Monitoramento e Alertas

### Sistema de Monitoramento

```typescript
// packages/shared/services/backupMonitoringService.ts

interface BackupStatus {
  backupId: string;
  name: string;
  type: 'database' | 'files' | 'logs';
  status: 'success' | 'failed' | 'in_progress';
  duration: number; // em segundos
  size: number; // em bytes
  timestamp: string;
}

interface BackupAlert {
  id: string;
  backupId: string;
  type: 'failure' | 'delay' | 'integrity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

class BackupMonitoringService {
  private backupStatus: BackupStatus[] = [];
  private alerts: BackupAlert[] = [];

  recordBackupStatus(
    backupId: string,
    name: string,
    type: 'database' | 'files' | 'logs',
    status: 'success' | 'failed' | 'in_progress',
    duration: number,
    size: number
  ): void {
    const backupStatus: BackupStatus = {
      backupId,
      name,
      type,
      status,
      duration,
      size,
      timestamp: new Date().toISOString()
    };

    this.backupStatus.push(backupStatus);

    // Verificar se é necessário gerar alerta
    if (status === 'failed') {
      this.generateAlert(backupId, 'failure', 'critical', `Backup failed: ${name}`);
    }

    // Verificar tempo de backup
    const expectedDuration = this.getExpectedDuration(type);
    if (status === 'success' && duration > expectedDuration * 2) {
      this.generateAlert(backupId, 'delay', 'high', `Backup took longer than expected: ${name}`);
    }
  }

  private getExpectedDuration(type: 'database' | 'files' | 'logs'): number {
    // Retornar duração esperada em segundos
    switch (type) {
      case 'database': return 3600; // 1 hora
      case 'files': return 1800; // 30 minutos
      case 'logs': return 600; // 10 minutos
      default: return 1800;
    }
  }

  private generateAlert(
    backupId: string,
    type: 'failure' | 'delay' | 'integrity',
    severity: 'low' | 'medium' | 'high' | 'critical',
    message: string
  ): void {
    const alert: BackupAlert = {
      id: this.generateId(),
      backupId,
      type,
      severity,
      message,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    this.alerts.push(alert);
    
    // Enviar notificação
    this.sendNotification(alert);
  }

  private sendNotification(alert: BackupAlert): void {
    // Implementar envio de notificações por:
    // - Email
    // - Slack
    // - SMS
    // - Chamada telefônica (para críticos)
    console.log(`Backup alert: ${alert.message}`);
  }

  getRecentBackups(hours: number = 24): BackupStatus[] {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);
    
    return this.backupStatus.filter(backup => 
      new Date(backup.timestamp) > cutoff
    );
  }

  getActiveAlerts(): BackupAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default new BackupMonitoringService();
```

## Testes de Restauração

### Plano de Testes

```bash
#!/bin/bash
# scripts/test-restore.sh

# Script para testar restauração de backups

echo "Starting backup restore test..."

# Selecionar backup mais recente
LATEST_BACKUP=$(aws s3 ls s3://gasrapido-backups-eu-west-1/database/ | sort | tail -n 1 | awk '{print $4}')

echo "Testing restore of backup: $LATEST_BACKUP"

# Criar ambiente de teste
TEST_ENV="restore-test-$(date +%s)"
docker network create $TEST_ENV

# Iniciar container de teste
docker run -d \
  --name postgres-test-$TEST_ENV \
  --network $TEST_ENV \
  -e POSTGRES_DB=gasrapido_test \
  -e POSTGRES_USER=test_user \
  -e POSTGRES_PASSWORD=test_password \
  postgres:15

# Aguardar inicialização
sleep 30

# Baixar e decriptar backup
aws s3 cp s3://gasrapido-backups-eu-west-1/database/$LATEST_BACKUP /tmp/backup.dump.encrypted

aws kms decrypt \
  --ciphertext-blob fileb:///tmp/backup.dump.encrypted \
  --output text \
  --query Plaintext \
  > /tmp/backup.dump

# Restaurar backup
docker exec -i postgres-test-$TEST_ENV \
  pg_restore \
  --username=test_user \
  --dbname=gasrapido_test \
  --clean \
  --if-exists \
  < /tmp/backup.dump

# Verificar integridade
docker exec postgres-test-$TEST_ENV \
  psql -U test_user -d gasrapido_test -c "SELECT COUNT(*) FROM users;"

# Limpar ambiente de teste
docker stop postgres-test-$TEST_ENV
docker rm postgres-test-$TEST_ENV
docker network rm $TEST_ENV

# Limpar arquivos temporários
rm /tmp/backup.dump.encrypted /tmp/backup.dump

echo "Restore test completed successfully"
```

## Próximos Passos

1. Implementar backup incremental usando WAL (Write-Ahead Logging) para PostgreSQL
2. Adicionar suporte a backup de volumes persistentes do Kubernetes
3. Implementar sistema de verificação de integridade automática dos backups
4. Adicionar suporte a backup de dados em tempo real (CDC - Change Data Capture)
5. Implementar políticas de backup baseadas em RPO (Recovery Point Objective) e RTO (Recovery Time Objective)
6. Adicionar suporte a backup em provedores de nuvem múltiplos (AWS, GCP, Azure)
7. Implementar sistema de auto-healing para restauração automática em caso de falhas
8. Adicionar métricas de performance de backup para otimização contínua