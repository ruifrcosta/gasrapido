# Sistema de Convites e Verificação - GasRápido

## Visão Geral

O Sistema de Convites e Verificação do GasRápido é um componente crítico que garante a segurança e a qualidade dos fornecedores e entregadores na plataforma. Este sistema implementa um fluxo completo de onboarding com convites controlados e verificação rigorosa de documentos.

## Arquitetura do Sistema

### Componentes Principais

1. **Banco de Dados**
   - Tabelas: `invites`, `verification_documents`, `verification_requests`
   - Funções: `create_invite`, `accept_invite`, `generate_unique_invite_code`
   - Políticas RLS para controle de acesso

2. **Serviços Backend**
   - `InvitationService`: Gestão de convites
   - `VerificationService`: Workflow de verificação de documentos
   - `SecureStorageService`: Armazenamento seguro de documentos

3. **Funções Edge**
   - `manage-invites`: Operações de convites
   - `verify-documents`: Processamento de documentos

4. **Interface Frontend**
   - Telas de entrada por convite
   - Upload de documentos para fornecedores e entregadores
   - Portal administrativo para gestão de convites e verificações

## Fluxo de Convites

### 1. Criação de Convite (Administrador)
```
1. Administrador acessa o portal administrativo
2. Navega até a aba "Convites"
3. Clica em "Criar Novo Convite"
4. Seleciona tipo (fornecedor/entregador) e email
5. Sistema gera código único e envia email
```

### 2. Aceitação de Convite (Usuário)
```
1. Usuário recebe email com código de convite
2. Acessa a aplicação e seleciona "Tenho Convite"
3. Insere o código do convite
4. Sistema valida o convite
5. Usuário é redirecionado para upload de documentos
```

## Fluxo de Verificação de Documentos

### 1. Upload de Documentos
```
1. Usuário acessa tela de upload de documentos
2. Seleciona e faz upload dos documentos obrigatórios:
   - Fornecedores: Documento de identidade, licença comercial, seguro
   - Entregadores: Documento de identidade, carta de condução, registro do veículo, seguro
3. Documentos são armazenados de forma segura
4. Sistema cria solicitação de verificação
```

### 2. Revisão Administrativa
```
1. Administrador acessa o portal administrativo
2. Navega até a aba "Verificações"
3. Visualiza solicitações pendentes
4. Revisa documentos enviados
5. Aprova ou rejeita a solicitação
6. Sistema envia notificação automática ao usuário
```

## Estrutura do Banco de Dados

### Tabela `invites`
```sql
CREATE TABLE IF NOT EXISTS public.invites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type invitation_type NOT NULL, -- 'client', 'vendor', 'courier'
    email VARCHAR(255) NOT NULL,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    accepted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status invitation_status DEFAULT 'pending', -- 'pending', 'accepted', 'expired', 'revoked'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela `verification_documents`
```sql
CREATE TABLE IF NOT EXISTS public.verification_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'id', 'license', 'insurance', 'vehicle_registration'
    file_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    rejection_reason TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);
```

### Tabela `verification_requests`
```sql
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    rejection_reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);
```

## Funções do Banco de Dados

### `generate_unique_invite_code()`
Gera códigos de convite únicos de 8 caracteres alfanuméricos, garantindo que não haja duplicatas.

### `create_invite()`
Cria um novo convite com:
- Tipo de usuário (fornecedor/entregador)
- Email do destinatário
- ID do administrador que criou
- Dias até expiração (padrão: 7 dias)

### `accept_invite()`
Processa a aceitação de um convite:
- Valida existência do convite
- Verifica se não está expirado ou revogado
- Atualiza status para "accepted"
- Registra usuário que aceitou

## Serviços Backend

### InvitationService
Responsável por:
- Criar e gerenciar convites
- Aceitar convites
- Buscar convites por código
- Revogar convites
- Gerenciar documentos de verificação

### VerificationService
Responsável por:
- Upload de documentos
- Submissão para verificação
- Obtenção de status de verificação
- Atualização de status de verificação
- Revisão individual de documentos

### SecureStorageService
Responsável por:
- Upload seguro de documentos
- Gerenciamento de storage buckets
- Geração de URLs assinadas
- Controle de acesso a documentos

## Funções Edge

### manage-invites
Endpoints disponíveis:
- `POST /create-invite`: Cria novo convite
- `POST /accept-invite`: Aceita convite existente
- `GET /get-invite?code={code}`: Busca convite por código
- `GET /list-invites`: Lista convites com filtros
- `POST /revoke-invite`: Revoga convite

### verify-documents
Endpoints disponíveis:
- `POST /upload-document`: Upload de documento
- `GET /get-user-documents`: Busca documentos do usuário
- `POST /submit-verification-request`: Submete solicitação de verificação
- `GET /get-verification-request`: Busca solicitação de verificação
- `POST /admin/review-document`: Revisão de documento (admin)
- `POST /admin/update-verification-request`: Atualização de solicitação (admin)

## Interface de Usuário

### Telas de Convite
- **InvitationEntryScreen**: Entrada por código de convite
- **SupplierDocumentUploadScreen**: Upload de documentos de fornecedor
- **CourierDocumentUploadScreen**: Upload de documentos de entregador
- **VerificationPendingScreen**: Status de verificação pendente

### Portal Administrativo
- **AdminPortalComponent**: Componente principal com abas
- **Invitation Management**: Criação e gestão de convites
- **Verification Management**: Revisão de documentos e aprovações

## Segurança

### Controle de Acesso
- Convites são associados a emails específicos
- Documentos são acessíveis apenas pelo proprietário e administradores
- Políticas RLS garantem isolamento de dados

### Armazenamento Seguro
- Buckets separados para diferentes tipos de documentos
- URLs assinadas para acesso temporário
- Criptografia de dados em trânsito e em repouso

### Validação
- Formatos de email validados
- Tipos de documento restritos
- Tamanhos de arquivo limitados
- Tipos MIME validados

## Notificações

### Para Usuários
- Convite criado (email)
- Convite aceito
- Documentos enviados para verificação
- Verificação aprovada/rejeitada

### Para Administradores
- Novos convites aceitos
- Solicitações de verificação pendentes
- Documentos aguardando revisão

## Métricas e Monitoramento

### Métricas Disponíveis
- Número total de convites criados
- Taxa de aceitação de convites
- Tempo médio de verificação
- Taxa de aprovação de documentos
- Convites expirados/revogados

### Logs de Auditoria
- Criação de convites
- Aceitação de convites
- Upload de documentos
- Aprovações/rejeições
- Ações administrativas

## Futuras Melhorias

### 1. Automação
- Verificação automática de documentos com OCR
- Integração com sistemas governamentais de validação
- Aprovação automática para documentos padrão

### 2. Expansão
- Convites para outros tipos de usuários
- Verificação biométrica
- Integração com redes sociais para validação

### 3. Melhorias de UX
- Progresso em tempo real do onboarding
- Templates de documentos
- Ajuda contextual para upload

## Conclusão

O Sistema de Convites e Verificação do GasRápido é uma solução robusta e segura que garante a qualidade dos fornecedores e entregadores na plataforma. Com uma arquitetura bem definida e fluxos claros, o sistema proporciona:

1. **Controle Rigoroso**: Apenas usuários convidados podem se registrar como fornecedores ou entregadores
2. **Segurança**: Documentos são armazenados de forma segura com controle de acesso
3. **Transparência**: Status de verificação visíveis para usuários e administradores
4. **Escalabilidade**: Arquitetura modular permite expansão futura
5. **Automação**: Processos automatizados reduzem carga administrativa

Este sistema é fundamental para manter a confiança dos clientes na plataforma e garantir operações seguras e eficientes.