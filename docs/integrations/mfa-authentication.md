# Autenticação Multifator (MFA)

## Visão Geral

Este documento descreve a implementação da autenticação multifator (MFA) para entregadores e fornecedores no GasRápido, aumentando a segurança das contas desses usuários que têm acesso a funcionalidades críticas da plataforma.

## Requisitos de Negócio

### Usuários Alvo
- **Fornecedores**: Acesso ao dashboard de gestão de produtos e pedidos
- **Entregadores**: Acesso ao app de entregas e informações de clientes

### Níveis de Segurança
- **Alto**: Acesso a funcionalidades financeiras e dados sensíveis
- **Médio**: Acesso a operações de gestão de pedidos
- **Baixo**: Acesso a informações básicas de perfil

## Métodos de Autenticação Suportados

### TOTP (Time-Based One-Time Password)
- **Google Authenticator**
- **Microsoft Authenticator**
- **Authy**
- **Built-in authenticators (iOS, Android)**

### SMS OTP
- Envio de códigos via SMS para verificação
- Fallback para usuários sem apps de autenticação

### Push Notifications
- **Firebase Push Notifications**
- **Expo Push Notifications**
- Confirmação de login através de notificações push

## Implementação Técnica

### Estrutura de Dados

```sql
-- Tabela para armazenar métodos MFA dos usuários
CREATE TABLE user_mfa_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL, -- 'totp', 'sms', 'push'
  secret TEXT, -- Para TOTP
  phone_number TEXT, -- Para SMS
  device_token TEXT, -- Para Push
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar sessões MFA
CREATE TABLE mfa_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  method_id UUID REFERENCES user_mfa_methods(id),
  challenge TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Serviço de Autenticação MFA

```typescript
// packages/shared/services/mfaService.ts

interface MfaMethod {
  id: string;
  userId: string;
  type: 'totp' | 'sms' | 'push';
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: string;
}

interface MfaChallenge {
  id: string;
  userId: string;
  methodId: string;
  challenge: string;
  expiresAt: string;
}

class MfaService {
  // Registrar novo método MFA para usuário
  async registerMfaMethod(
    userId: string,
    type: MfaMethod['type'],
    options?: { phoneNumber?: string; deviceToken?: string }
  ): Promise<{ method: MfaMethod; qrCode?: string; secret?: string }> { /* ... */ }

  // Verificar e ativar método MFA
  async verifyMfaMethod(
    methodId: string,
    verificationCode: string
  ): Promise<boolean> { /* ... */ }

  // Iniciar processo de autenticação MFA
  async initiateMfaChallenge(
    userId: string,
    methodId?: string
  ): Promise<MfaChallenge> { /* ... */ }

  // Verificar código MFA
  async verifyMfaChallenge(
    challengeId: string,
    code: string
  ): Promise<{ success: boolean; token?: string }> { /* ... */ }

  // Obter métodos MFA do usuário
  async getUserMfaMethods(userId: string): Promise<MfaMethod[]> { /* ... */ }

  // Remover método MFA
  async removeMfaMethod(methodId: string): Promise<boolean> { /* ... */ }

  // Definir método MFA como primário
  async setPrimaryMfaMethod(methodId: string): Promise<MfaMethod | null> { /* ... */ }

  // Gerar QR Code para TOTP
  private generateTotpQrCode(
    secret: string,
    userIdentifier: string
  ): string { /* ... */ }

  // Validar código TOTP
  private validateTotpCode(
    secret: string,
    code: string
  ): boolean { /* ... */ }

  // Enviar código SMS
  private async sendSmsCode(
    phoneNumber: string,
    code: string
  ): Promise<boolean> { /* ... */ }

  // Enviar notificação push
  private async sendPushNotification(
    deviceToken: string,
    challenge: string
  ): Promise<boolean> { /* ... */ }
}
```

## Fluxos de Usuário

### Registro de MFA

1. Usuário acessa configurações de segurança
2. Seleciona "Adicionar método de autenticação"
3. Escolhe método (TOTP, SMS, Push)
4. Sistema gera credenciais necessárias:
   - Para TOTP: QR Code e secret key
   - Para SMS: Solicita número de telefone
   - Para Push: Solicita permissão de notificações
5. Usuário configura o método:
   - TOTP: Escaneia QR Code no app de autenticação
   - SMS: Recebe e digita código de verificação
   - Push: Confirma notificação de teste
6. Sistema verifica e ativa o método
7. Método é definido como primário (se for o primeiro)

### Login com MFA

1. Usuário faz login com email/senha
2. Sistema verifica se usuário tem MFA ativado
3. Se sim, solicita autenticação adicional:
   - Exibe métodos MFA disponíveis
   - Inicia desafio com método primário
4. Usuário completa desafio:
   - TOTP: Digita código do app de autenticação
   - SMS: Recebe e digita código enviado por SMS
   - Push: Confirma notificação push
5. Sistema verifica código/token
6. Se válido, concede acesso completo
7. Sessão é criada com token MFA

## Componentes UI

### MfaSetupComponent

Componente para configuração de métodos MFA.

```typescript
// apps/mobile/src/components/MfaSetupComponent.tsx (Mobile)
// apps/web/src/components/MfaSetupComponent.tsx (Web)

interface MfaSetupComponentProps {
  userId: string;
  onSetupComplete: () => void;
  onCancel: () => void;
}

interface MfaMethodOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiresInput: boolean;
}
```

### MfaVerificationComponent

Componente para verificação durante o login.

```typescript
// apps/mobile/src/components/MfaVerificationComponent.tsx (Mobile)
// apps/web/src/components/MfaVerificationComponent.tsx (Web)

interface MfaVerificationComponentProps {
  challengeId: string;
  methodType: 'totp' | 'sms' | 'push';
  onVerificationComplete: (token: string) => void;
  onResendCode?: () => void;
  onCancel: () => void;
}
```

## Integração com AuthService

### Extensão do AuthService

```typescript
// packages/shared/services/authService.ts (extensões)

class AuthService {
  // Login com MFA
  async loginWithMfa(
    credentials: LoginCredentials
  ): Promise<{ 
    user: User; 
    needsMfa: boolean; 
    challengeId?: string;
    availableMethods?: MfaMethod[];
  }> { /* ... */ }

  // Completar login com MFA
  async completeMfaLogin(
    challengeId: string,
    code: string
  ): Promise<{ user: User; tokens: AuthTokens }> { /* ... */ }

  // Verificar se usuário requer MFA
  async requiresMfa(userId: string): Promise<boolean> { /* ... */ }

  // Obter métodos MFA disponíveis para usuário
  async getUserMfaMethods(userId: string): Promise<MfaMethod[]> { /* ... */ }
}
```

## Considerações de Segurança

### Proteção contra Abusos
- Rate limiting para tentativas de verificação
- Expiração de desafios MFA (5 minutos)
- Bloqueio temporário após múltiplas falhas
- Logging de todas as tentativas de autenticação

### Armazenamento de Segredos
- Secrets TOTP encriptados no banco de dados
- Chaves de API para SMS/Push armazenadas como secrets
- Nenhum secret compartilhado com o frontend

### Privacidade
- Números de telefone usados apenas para MFA
- Dados de dispositivo usados apenas para push notifications
- Conformidade com regulamentações de privacidade (LGPD, GDPR)

## Monitoramento e Logs

### Métricas
- Taxa de sucesso de registro MFA
- Taxa de sucesso de login com MFA
- Tempo médio para completar verificação MFA
- Uso por tipo de método MFA

### Logs
- Tentativas de registro MFA
- Tentativas de login com MFA
- Falhas e sucessos em verificação
- Mudanças em métodos MFA primários

## Próximos Passos

1. Implementar backup codes para recuperação de conta
2. Adicionar suporte a hardware security keys (WebAuthn)
3. Implementar políticas de MFA obrigatório por role
4. Adicionar relatórios de segurança para administradores
5. Implementar redefinição de MFA em casos de perda de acesso