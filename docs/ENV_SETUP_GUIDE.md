# Guia de Configuração de Variáveis de Ambiente - GasRápido

Este documento fornece instruções detalhadas para configurar as variáveis de ambiente necessárias para o projeto GasRápido.

## 📁 Arquivos de Ambiente

O projeto utiliza três arquivos principais de configuração:

- **`.env.example`** - Template com todas as variáveis disponíveis
- **`.env.local`** - Configuração para desenvolvimento local
- **`.env`** - Configuração para produção

## 🚀 Configuração Inicial

### 1. Desenvolvimento Local

```bash
# Copie o arquivo de exemplo para desenvolvimento local
cp .env.example .env.local

# Edite o arquivo com suas credenciais de desenvolvimento
# O arquivo .env.local já contém valores padrão para desenvolvimento
```

### 2. Produção

```bash
# Copie o arquivo de exemplo para produção
cp .env.example .env

# Configure todas as variáveis com valores de produção
```

## 🔧 Variáveis Obrigatórias

### Supabase (CRÍTICO)
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### Banco de Dados
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### Segurança
```env
JWT_SECRET=chave-jwt-com-pelo-menos-32-caracteres
SESSION_SECRET=chave-sessao-muito-longa-e-segura
```

## 🗺️ Configurações por Serviço

### Google Maps
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a API do Google Maps
3. Crie uma chave de API
4. Configure as restrições de domínio

```env
GOOGLE_MAPS_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### Firebase (Notificações)
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um projeto
3. Configure Cloud Messaging
4. Obtenha as credenciais

```env
FCM_SERVER_KEY=AAAA...
FCM_PROJECT_ID=seu-projeto-firebase
```

### Stripe (Pagamentos)
1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/)
2. Obtenha as chaves de API
3. Configure webhooks

```env
STRIPE_PUBLISHABLE_KEY=pk_live_... # ou pk_test_... para teste
STRIPE_SECRET_KEY=sk_live_... # ou sk_test_... para teste
```

### Multicaixa (Angola)
1. Contacte Multicaixa para credenciais
2. Configure ambiente (sandbox/production)

```env
MULTICAIXA_API_KEY=sua_chave
MULTICAIXA_MERCHANT_ID=seu_merchant_id
MULTICAIXA_ENVIRONMENT=production # ou sandbox
```

## 🔍 Configurações de Desenvolvimento

### Supabase Local
Para desenvolvimento, use a instância local do Supabase:

```env
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Portas dos Serviços
```env
SUPABASE_API_PORT=54321
SUPABASE_DB_PORT=54322
REDIS_PORT=6379
RABBITMQ_PORT=5672
```

## 📊 Monitoramento e Observabilidade

### Sentry (Monitoramento de Erros)
```env
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=development # ou production
```

### Analytics
```env
NEXT_PUBLIC_GA_TRACKING_ID=UA-XXXXXXXXX-X
NEXT_PUBLIC_MIXPANEL_TOKEN=seu_token_mixpanel
```

## 🔒 Segurança e Boas Práticas

### ⚠️ IMPORTANTE - Nunca Commitar Credenciais

1. **Adicione ao .gitignore:**
   ```
   .env
   .env.local
   .env.production
   ```

2. **Use valores de exemplo:**
   - Mantenha `.env.example` atualizado
   - Use placeholders genéricos
   - Documente todas as variáveis

3. **Rotação de Chaves:**
   - Troque chaves regularmente
   - Use diferentes chaves para dev/prod
   - Monitore uso de APIs

### Validação de Ambiente

Verifique se todas as variáveis estão configuradas:

```bash
# Execute o script de validação
npm run validate-env

# Ou manualmente verifique os serviços
npm run health-check
```

## 🌍 Configuração por Ambiente

### Desenvolvimento Local
- Use APIs de teste/sandbox
- Dados mockados quando possível
- Logs verbosos habilitados
- Hot reload ativo

### Staging
- APIs de teste com dados reais
- Configurações próximas à produção
- Monitoramento ativo

### Produção
- APIs de produção
- SSL habilitado
- Logs otimizados
- Backups configurados

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de conexão Supabase:**
   - Verifique URL e chaves
   - Confirme região do projeto
   - Teste conectividade

2. **Google Maps não carrega:**
   - Verifique cota da API
   - Confirme restrições de domínio
   - Teste chave em ambiente de teste

3. **Notificações não funcionam:**
   - Verifique configuração FCM
   - Confirme permissões do navegador
   - Teste com token válido

### Comandos Úteis

```bash
# Teste conexão com Supabase
npm run test:supabase

# Teste APIs externas
npm run test:external-apis

# Validar todas as configurações
npm run validate:all
```

## 📞 Suporte

Para problemas com configuração de ambiente:

1. Consulte a documentação oficial de cada serviço
2. Verifique os logs da aplicação
3. Teste em ambiente isolado
4. Contacte a equipe de desenvolvimento

## 🔄 Atualizações

Este guia será atualizado conforme novos serviços são adicionados ao projeto. Sempre consulte a versão mais recente no repositório.

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0