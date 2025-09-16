# Gestão Segura de Secrets e Credenciais

## Visão Geral

Este documento descreve a estratégia e implementação para gestão segura de secrets e credenciais no GasRápido, abrangendo práticas de segurança, ferramentas recomendadas e procedimentos para diferentes ambientes (desenvolvimento, staging e produção).

## Princípios de Segurança

### 1. Princípio do Menor Privilégio
- Cada serviço deve ter apenas as permissões necessárias
- Usar roles e políticas específicas por serviço
- Revogar acessos não utilizados

### 2. Segregação de Ambientes
- Secrets diferentes para cada ambiente (dev, staging, prod)
- Isolamento de redes entre ambientes
- Controle de acesso baseado em roles

### 3. Rotação de Secrets
- Rotação automática de secrets críticas
- Notificação de expiração de secrets
- Processos de emergency rotation

### 4. Auditoria e Monitoramento
- Logging de acesso a secrets
- Alertas para acessos suspeitos
- Relatórios de compliance

## Tipos de Secrets

### Credenciais de Banco de Dados
- Connection strings
- Usuários e senhas
- Chaves de criptografia

### Chaves de API
- Google Maps API Key
- Stripe Secret Key
- FCM Server Key
- Mapbox Access Token

### Certificados e Chaves TLS
- Certificados SSL/TLS
- Chaves privadas
- Certificados de cliente

### Secrets de Aplicação
- JWT Secrets
- Encryption Keys
- Session Secrets

### Credenciais de Infraestrutura
- Credenciais de cloud providers
- Credenciais de serviços de monitoramento
- Credenciais de backup services

## Estratégias de Armazenamento

### 1. Desenvolvimento Local

#### Arquivos .env
```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDE3Njk0MzIsImV4cCI6MTc3MzMyODYzMn0.zt61i2dKVyXH2tj4se0cQx9b8Hq8W1GA74nA4pQJw5o
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0MTc2OTQzMiwiZXhwIjoxNzczMzI4NjMyfQ.TGxJCGXxXn5yFHs9jT5xL3fFzpy892XfV0O4Jz0FJw4

# APIs externas
GOOGLE_MAPS_API_KEY=AIzaSyDevelopmentKey1234567890
STRIPE_SECRET_KEY=sk_test_1234567890abcdef
FCM_SERVER_KEY=AAAA-development-key
```

#### Ferramentas de Desenvolvimento
```bash
# Usar dotenv-vault para encryptar secrets locais
npm install dotenv-vault

# Criar vault encryptado
npx dotenv-vault encrypt

# Desenvolvedores recebem chave de decriptação via canal seguro
```

### 2. CI/CD (GitHub Actions)

#### GitHub Secrets
```yaml
# Configuração de secrets no GitHub
# Settings > Secrets and variables > Actions

# Banco de dados
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# APIs externas
GOOGLE_MAPS_API_KEY
MAPBOX_ACCESS_TOKEN
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
FCM_SERVER_KEY

# Infraestrutura
VERCEL_TOKEN
EXPO_TOKEN
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

#### Uso em Workflows
```yaml
# .github/workflows/deploy.yml

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        github-token: ${{ secrets.GITHUB_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      env:
        NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

### 3. Kubernetes (Produção)

#### Kubernetes Secrets
```yaml
# k8s/secrets.yaml

apiVersion: v1
kind: Secret
metadata:
  name: gasrapido-secrets
  namespace: gasrapido-prod
type: Opaque
data:
  # Secrets devem ser base64 encoded
  database-url: <base64-encoded-database-url>
  jwt-secret: <base64-encoded-jwt-secret>
  stripe-secret-key: <base64-encoded-stripe-key>
  fcm-server-key: <base64-encoded-fcm-key>
```

#### Criando Secrets com kubectl
```bash
# Criar secret a partir de arquivo
kubectl create secret generic gasrapido-secrets \
  --from-file=database-url=./secrets/database-url \
  --from-file=jwt-secret=./secrets/jwt-secret \
  --namespace=gasrapido-prod

# Criar secret a partir de literals
kubectl create secret generic api-keys \
  --from-literal=google-maps-key=${GOOGLE_MAPS_API_KEY} \
  --from-literal=stripe-key=${STRIPE_SECRET_KEY} \
  --namespace=gasrapido-prod
```

#### Usando Secrets em Deployments
```yaml
# k8s/user-service-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  template:
    spec:
      containers:
      - name: user-service
        image: gasrapido/user-service:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: gasrapido-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: gasrapido-secrets
              key: jwt-secret
        - name: GOOGLE_MAPS_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: google-maps-key
```

### 4. HashiCorp Vault (Recomendado para Produção)

#### Configuração do Vault
```hcl
# vault/policies/gasrapido-policy.hcl

path "secret/gasrapido/*" {
  capabilities = ["read"]
}

path "secret/gasrapido/database" {
  capabilities = ["read"]
}

path "secret/gasrapido/api-keys" {
  capabilities = ["read"]
}
```

#### Estrutura de Secrets no Vault
```bash
# Secrets de banco de dados
secret/gasrapido/database/url
secret/gasrapido/database/username
secret/gasrapido/database/password

# Secrets de APIs
secret/gasrapido/api-keys/google-maps
secret/gasrapido/api-keys/stripe
secret/gasrapido/api-keys/fcm

# Secrets de aplicação
secret/gasrapido/app/jwt-secret
secret/gasrapido/app/encryption-key
```

#### Integração com Aplicações
```typescript
// packages/shared/utils/vaultClient.ts

import Vault from 'node-vault';

class VaultClient {
  private vault: Vault.client;

  constructor() {
    this.vault = Vault({
      apiVersion: 'v1',
      endpoint: process.env.VAULT_ADDR,
      token: process.env.VAULT_TOKEN
    });
  }

  async getSecret(path: string): Promise<any> {
    try {
      const result = await this.vault.read(path);
      return result.data;
    } catch (error) {
      console.error(`Failed to retrieve secret from ${path}:`, error);
      throw error;
    }
  }

  async getDatabaseCredentials(): Promise<any> {
    return this.getSecret('secret/gasrapido/database');
  }

  async getApiKeys(): Promise<any> {
    return this.getSecret('secret/gasrapido/api-keys');
  }
}

export default new VaultClient();
```

## Práticas de Segurança

### 1. Encriptação em Trânsito e em Repouso

#### TLS/SSL para Todas as Comunicações
```yaml
# k8s/ingress-tls.yaml

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gasrapido-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.gasrapido.com
    - app.gasrapido.com
    secretName: gasrapido-tls
  rules:
  - host: api.gasrapido.com
    # ... regras de roteamento
```

#### Encriptação de Secrets no Banco de Dados
```sql
-- Supabase: Encriptar dados sensíveis
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para encriptar dados
CREATE OR REPLACE FUNCTION encrypt_secret(secret_value TEXT, key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_encrypt(secret_value, key);
END;
$$ LANGUAGE plpgsql;

-- Função para decriptar dados
CREATE OR REPLACE FUNCTION decrypt_secret(encrypted_value TEXT, key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_value, key);
END;
$$ LANGUAGE plpgsql;
```

### 2. Controle de Acesso

#### RBAC para Kubernetes
```yaml
# k8s/rbac.yaml

apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: gasrapido-prod
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-secrets
  namespace: gasrapido-prod
subjects:
- kind: User
  name: dev-team
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

#### Service Accounts com Permissões Mínimas
```yaml
# k8s/service-account.yaml

apiVersion: v1
kind: ServiceAccount
metadata:
  name: user-service-account
  namespace: gasrapido-prod

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: gasrapido-prod
  name: user-service-role
rules:
- apiGroups: [""]
  resources: ["secrets"]
  resourceNames: ["user-service-secrets"]
  verbs: ["get"]
```

### 3. Monitoramento e Auditoria

#### Logging de Acesso a Secrets
```typescript
// packages/shared/utils/secretLogger.ts

import winston from 'winston';

const secretLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'secret-access.log',
      level: 'info'
    })
  ]
});

export class SecretLogger {
  static logAccess(
    secretName: string,
    serviceName: string,
    userId?: string
  ): void {
    secretLogger.info('Secret accessed', {
      secretName,
      serviceName,
      userId,
      timestamp: new Date().toISOString(),
      ip: this.getClientIP()
    });
  }

  private static getClientIP(): string {
    // Implementar obtenção de IP do cliente
    return '127.0.0.1';
  }
}
```

#### Alertas para Acessos Suspeitos
```yaml
# k8s/monitoring/alerts.yaml

apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: secret-access-alerts
spec:
  groups:
  - name: secret.access.rules
    rules:
    - alert: HighSecretAccessRate
      expr: rate(secret_access_total[5m]) > 10
      for: 1m
      labels:
        severity: warning
      annotations:
        summary: "High rate of secret access detected"
        description: "Service {{ $labels.service }} is accessing secrets at a high rate"
```

## Rotação de Secrets

### Script de Rotação Automática
```bash
#!/bin/bash
# scripts/rotate-secrets.sh

# Rotação de JWT Secret
NEW_JWT_SECRET=$(openssl rand -base64 32)
kubectl patch secret gasrapido-secrets \
  -p="{\"data\":{\"jwt-secret\":\"$(echo -n $NEW_JWT_SECRET|base64)\"}}" \
  --namespace=gasrapido-prod

# Notificar serviços para reload
kubectl rollout restart deployment/user-service --namespace=gasrapido-prod
kubectl rollout restart deployment/order-service --namespace=gasrapido-prod

echo "JWT Secret rotated successfully"
```

### CronJob para Rotação Periódica
```yaml
# k8s/secret-rotation-cronjob.yaml

apiVersion: batch/v1
kind: CronJob
metadata:
  name: secret-rotation
  namespace: gasrapido-prod
spec:
  schedule: "0 2 * * 0"  # Domingo às 2h
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: secret-rotator
            image: gasrapido/secret-rotator:latest
            env:
            - name: VAULT_ADDR
              value: "http://vault:8200"
            - name: VAULT_TOKEN
              valueFrom:
                secretKeyRef:
                  name: vault-token
                  key: token
          restartPolicy: OnFailure
```

## Backup e Disaster Recovery

### Backup de Secrets
```bash
#!/bin/bash
# scripts/backup-secrets.sh

# Backup de secrets do Kubernetes
kubectl get secrets --namespace=gasrapido-prod -o yaml > secrets-backup-$(date +%Y%m%d).yaml

# Encriptar backup
gpg --cipher-algo AES256 --compress-algo 2 --symmetric --output secrets-backup-$(date +%Y%m%d).yaml.gpg secrets-backup-$(date +%Y%m%d).yaml

# Armazenar em local seguro
aws s3 cp secrets-backup-$(date +%Y%m%d).yaml.gpg s3://gasrapido-backups/secrets/

echo "Secrets backed up successfully"
```

### Restauração de Secrets
```bash
#!/bin/bash
# scripts/restore-secrets.sh

# Decriptar backup
gpg --decrypt secrets-backup-20231201.yaml.gpg > secrets-backup-20231201.yaml

# Restaurar secrets
kubectl apply -f secrets-backup-20231201.yaml --namespace=gasrapido-prod

echo "Secrets restored successfully"
```

## Próximos Passos

1. Implementar HashiCorp Vault para gestão centralizada de secrets
2. Adicionar suporte a external secrets operators (AWS Secrets Manager, Azure Key Vault)
3. Implementar key management service (KMS) para encriptação de secrets
4. Adicionar auditoria automática de secrets expirados
5. Implementar secret scanning no pipeline de CI/CD
6. Adicionar suporte a hardware security modules (HSM) para secrets críticos