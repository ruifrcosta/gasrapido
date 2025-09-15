# Documentação de Segurança

Documentação das medidas de cibersegurança implementadas no projeto GasRápido.

## Índice

1. [Autenticação e Autorização](#autenticação-e-autorização)
2. [Proteção de Dados Sensíveis](#proteção-de-dados-sensíveis)
3. [Logs e Auditorias](#logs-e-auditorias)
4. [Gestão de Permissões](#gestão-de-permissões)
5. [Criptografia](#criptografia)
6. [Proteção de APIs](#proteção-de-apis)

## Autenticação e Autorização

### Autenticação

O sistema utiliza múltiplas camadas de autenticação:

1. **OTP por SMS**: Validação inicial via código enviado por SMS
2. **Autenticação por Email**: Para usuários que preferem email
3. **Autenticação Multifator**: Para entregadores e fornecedores

### Autorização (RBAC)

Sistema de controle de acesso baseado em roles:

- **Cliente**: Acesso limitado às funcionalidades de pedido
- **Fornecedor**: Acesso à gestão de produtos e pedidos
- **Entregador**: Acesso à gestão de entregas
- **Administrador**: Acesso completo ao sistema
- **Financeiro**: Acesso às funcionalidades financeiras
- **Desenvolvedor**: Acesso às ferramentas de desenvolvimento

## Proteção de Dados Sensíveis

### Dados Protegidos

- Informações pessoais dos usuários
- Dados de localização
- Informações de pagamento
- Fotos e documentos de verificação
- Logs de atividade

### Medidas de Proteção

- Criptografia em trânsito (HTTPS/TLS)
- Criptografia em repouso (AES-256)
- Máscaras de dados sensíveis em logs
- Controle de acesso baseado em roles

## Logs e Auditorias

### Logs de Sistema

- Registro de todas as ações dos usuários
- Monitoramento de acessos suspeitos
- Logs de erros e exceções
- Métricas de desempenho

### Auditorias

- Auditoria imutável de todas as ações administrativas
- Relatórios de acesso a dados sensíveis
- Monitoramento de alterações de configuração
- Histórico de modificações em registros

## Gestão de Permissões

### Controle de Acesso

- Separação de funções (SoD)
- Princípio do menor privilégio
- Acesso temporal e JIT (Just-In-Time)
- Controle de dispositivos confiáveis

### Permissões por Perfil

- **Clientes**: Apenas seus próprios pedidos
- **Fornecedores**: Apenas seus próprios produtos
- **Entregadores**: Apenas entregas atribuídas
- **Administradores**: Acesso total com auditoria

## Criptografia

### Em Trânsito

- HTTPS/TLS 1.3 para todas as comunicações
- Certificados SSL válidos
- Pinning de certificados em dispositivos móveis

### Em Repouso

- Criptografia AES-256 para dados sensíveis
- Criptografia de fotos e documentos
- Chaves de criptografia gerenciadas pelo Supabase
- Rotação automática de chaves

## Proteção de APIs

### Autenticação de APIs

- Chaves de API para integrações externas
- JWT para autenticação interna
- Rate limiting por IP e usuário
- Monitoramento de uso anormal

### Segurança de Endpoints

- Validação de entrada rigorosa
- Proteção contra SQL Injection
- Proteção contra XSS
- CORS configurado adequadamente