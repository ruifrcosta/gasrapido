# Exemplo de Integração do MFA no GasRápido

## Visão Geral

Este documento demonstra como integrar a autenticação multifator (MFA) no aplicativo GasRápido. A implementação inclui:

1. Componentes de UI para configuração e verificação MFA
2. Serviços para gerenciamento de métodos MFA
3. Integração com o serviço de autenticação existente

## Estrutura dos Arquivos Criados

```
packages/
├── shared/
│   └── services/
│       └── mfaService.ts          # Serviço de gerenciamento MFA
└── ui/
    ├── src/
    │   ├── MfaSetupComponent.tsx   # Componente de configuração MFA
    │   └── MfaVerificationComponent.tsx # Componente de verificação MFA
    └── components/
        └── (symlinks para src)

apps/
└── mobile/
    └── src/
        ├── screens/
        │   ├── LoginWithMfaScreen.tsx     # Tela de login com MFA
        │   └── MfaManagementScreen.tsx    # Tela de gerenciamento MFA
        └── navigation/
            └── AuthNavigator.tsx          # Navegador de autenticação
```

## Componentes Principais

### 1. Serviço MFA (mfaService.ts)

O serviço MFA fornece as seguintes funcionalidades:

```typescript
// Registro de método MFA
await mfaService.registerMfaMethod(userId, 'totp', { phoneNumber, emailAddress });

// Verificação de método MFA
await mfaService.verifyMfaMethod(methodId, verificationCode);

// Definição de método primário
await mfaService.setPrimaryMfaMethod(methodId);

// Iniciação de desafio MFA
const challenge = await mfaService.initiateMfaChallenge(userId, methodId);

// Verificação de desafio MFA
await mfaService.verifyMfaChallenge(challengeId, code);

// Remoção de método MFA
await mfaService.removeMfaMethod(methodId);

// Obtenção de métodos do usuário
const methods = mfaService.getUserMfaMethods(userId);

// Geração de códigos de backup
const backupCodes = mfaService.generateBackupCodes(userId, count);
```

### 2. Componente de Configuração MFA (MfaSetupComponent.tsx)

Este componente permite que os usuários configurem métodos MFA:

```typescript
<MfaSetupComponent
  userId={userId}
  onSetupComplete={handleSetupComplete}
  onCancel={handleSetupCancel}
/>
```

Suporta três tipos de métodos:
- **TOTP**: App autenticador (Google Authenticator, Authy, etc.)
- **SMS**: Códigos enviados por mensagem de texto
- **Email**: Códigos enviados por email

### 3. Componente de Verificação MFA (MfaVerificationComponent.tsx)

Este componente é usado durante o login para verificar códigos MFA:

```typescript
<MfaVerificationComponent
  challengeId={challenge.id}
  methodType={methodType}
  onVerificationComplete={handleMfaComplete}
  onResendCode={handleMfaResend}
  onCancel={handleMfaCancel}
/>
```

## Integração com Autenticação

### Atualização do AuthService

O serviço de autenticação foi atualizado para suportar MFA:

```typescript
// Login com verificação MFA
const result = await authService.login({ email, password });

if (result.needsMfa && result.challenge) {
  // Mostrar tela de verificação MFA
  setMfaChallenge(result.challenge);
  setMfaMethodType(result.methodType);
} else {
  // Login bem-sucedido sem MFA
  router.push('/home');
}

// Completar login com MFA
const mfaResult = await authService.completeMfaLogin(challengeId, token);
```

## Telas de Demonstração

### 1. Tela de Login com MFA (LoginWithMfaScreen.tsx)

```typescript
// Se precisar de MFA, mostrar componente de verificação
if (mfaChallenge) {
  return (
    <MfaVerificationComponent
      challengeId={mfaChallenge.id}
      methodType={mfaMethodType}
      onVerificationComplete={handleMfaComplete}
      onResendCode={handleMfaResend}
      onCancel={handleMfaCancel}
    />
  );
}

// Se estiver configurando MFA, mostrar componente de configuração
if (showMfaSetup) {
  return (
    <MfaSetupComponent
      userId={userId}
      onSetupComplete={handleSetupComplete}
      onCancel={handleSetupCancel}
    />
  );
}
```

### 2. Tela de Gerenciamento MFA (MfaManagementScreen.tsx)

Permite aos usuários:
- Visualizar métodos MFA configurados
- Adicionar novos métodos
- Remover métodos existentes
- Definir método primário

## Navegação

### AuthNavigator.tsx

```typescript
<Stack.Navigator>
  <Stack.Screen 
    name="LoginWithMfa" 
    component={LoginWithMfaScreen}
    options={{ title: 'Login' }}
  />
  <Stack.Screen 
    name="MfaManagement" 
    component={MfaManagementScreen}
    options={{ title: 'Autenticação Multifator' }}
  />
</Stack.Navigator>
```

## Considerações de Segurança

1. **Encriptação**: Todos os segredos MFA são armazenados com encriptação
2. **Expiração**: Desafios MFA expiram após 5 minutos
3. **Rate Limiting**: Limitação de tentativas para prevenir ataques de força bruta
4. **Backup Codes**: Geração de códigos de backup para recuperação de conta
5. **Logging**: Registro de todas as tentativas de autenticação para auditoria

## Próximos Passos

1. **Testes**: Implementar testes unitários e de integração para os componentes MFA
2. **Documentação**: Criar guias de usuário para configuração e uso do MFA
3. **Acessibilidade**: Garantir que os componentes MFA sejam acessíveis
4. **Internacionalização**: Adicionar suporte a múltiplos idiomas
5. **Monitoramento**: Implementar métricas de uso e sucesso do MFA