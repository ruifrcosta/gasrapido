# 🚀 Guia Completo de Configuração de Ambiente - GasRápido

**Olá Rui!** Este é o guia definitivo para configurar TODOS os serviços necessários para o seu projeto GasRápido. Analisei todo o código e identifiquei cada integração e serviço necessário.

## 📋 Lista Completa de Serviços Identificados

### 🔧 SERVIÇOS OBRIGATÓRIOS (CORE)

#### 1. **Supabase** (Base de Dados Principal)
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```
**🔗 Link:** [https://supabase.com](https://supabase.com)  
**📝 Setup:**
1. Criar conta no Supabase
2. Criar novo projeto
3. Ir em Settings > API
4. Copiar URL e API Keys

#### 2. **OpenWeather API** (Clima para Pricing Dinâmico)
```env
OPENWEATHER_API_KEY=sua_chave_openweather
NEXT_PUBLIC_OPENWEATHER_API_KEY=sua_chave_openweather
```
**🔗 Link:** [https://openweathermap.org/api](https://openweathermap.org/api)  
**📝 Setup:**
1. Criar conta gratuita
2. Ir em "My API keys"
3. Copiar a chave padrão ou criar nova
4. **IMPORTANTE:** O sistema de pricing usa dados meteorológicos para ajustar preços

#### 3. **Google Maps API** (Mapas e Geolocalização)
```env
GOOGLE_MAPS_API_KEY=sua_chave_google_maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_google_maps
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_google_maps
```
**🔗 Link:** [https://console.cloud.google.com](https://console.cloud.google.com)  
**📝 Setup:**
1. Ir para Google Cloud Console
2. Criar projeto ou selecionar existente
3. Ativar APIs: Maps JavaScript API, Geocoding API, Places API
4. Ir em "Credentials" > "Create Credentials" > "API Key"
5. Configurar restrições para seu domínio

#### 4. **Stripe** (Pagamentos)
```env
STRIPE_PUBLISHABLE_KEY=pk_test_... (desenvolvimento) / pk_live_... (produção)
STRIPE_SECRET_KEY=sk_test_... (desenvolvimento) / sk_live_... (produção)
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
**🔗 Link:** [https://dashboard.stripe.com](https://dashboard.stripe.com)  
**📝 Setup:**
1. Criar conta Stripe
2. Ir em Developers > API keys
3. Copiar Publishable key e Secret key
4. Para webhooks: Developers > Webhooks > Add endpoint
5. **CRÍTICO:** O sistema processa pagamentos via Stripe + Multicaixa

#### 5. **Multicaixa** (Pagamentos Angola)
```env
MULTICAIXA_API_KEY=sua_chave_multicaixa
MULTICAIXA_MERCHANT_ID=seu_merchant_id
MULTICAIXA_ENVIRONMENT=sandbox ou production
MULTICAIXA_BASE_URL=https://api-sandbox.multicaixa.ao (dev) / https://api.multicaixa.ao (prod)
```
**🔗 Link:** [https://multicaixa.ao](https://multicaixa.ao) - Contactar comercialmente  
**📝 Setup:**
1. Contactar Multicaixa para conta merchant
2. Obter credenciais de sandbox para testes
3. **IMPORTANTE:** Sistema integrado com Stripe para pagamentos locais

### 📱 COMUNICAÇÃO E NOTIFICAÇÕES

#### 6. **Firebase Cloud Messaging** (Notificações Push)
```env
FCM_SERVER_KEY=AAAA...
FCM_PROJECT_ID=seu-projeto-firebase
FCM_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
FCM_CLIENT_EMAIL=firebase-adminsdk-...@seu-projeto.iam.gserviceaccount.com
NEXT_PUBLIC_FCM_PROJECT_ID=seu-projeto-firebase
EXPO_PUBLIC_FCM_PROJECT_ID=seu-projeto-firebase
```
**🔗 Link:** [https://console.firebase.google.com](https://console.firebase.google.com)  
**📝 Setup:**
1. Criar projeto Firebase
2. Ir em Project Settings > Cloud Messaging
3. Gerar chave de servidor
4. Para admin SDK: Project Settings > Service accounts > Generate private key

#### 7. **Twilio** (SMS e WhatsApp)
```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1555...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```
**🔗 Link:** [https://console.twilio.com](https://console.twilio.com)  
**📝 Setup:**
1. Criar conta Twilio
2. Ir em Console Dashboard
3. Copiar Account SID e Auth Token
4. Comprar número de telefone: Phone Numbers > Manage > Buy a number
5. Para WhatsApp: Messaging > Try it out > Send a WhatsApp message

#### 8. **SendGrid** (Email) 
```env
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@gasrapido.com
SENDGRID_FROM_NAME=GasRápido
```
**🔗 Link:** [https://sendgrid.com](https://sendgrid.com)  
**📝 Setup:**
1. Criar conta SendGrid
2. Ir em Settings > API Keys
3. Criar API Key com "Full Access"
4. Verificar domínio: Settings > Sender Authentication

#### 9. **VAPID Keys** (Web Push Notifications)
```env
VAPID_PUBLIC_KEY=B...
VAPID_PRIVATE_KEY=...
VAPID_EMAIL=seu@email.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=B...
```
**🔗 Gerador:** [https://vapidkeys.com](https://vapidkeys.com)  
**📝 Setup:**
1. Usar gerador online ou comando: `npx web-push generate-vapid-keys`
2. **IMPORTANTE:** Para notificações web push

### 🗄️ ARMAZENAMENTO E MEDIA

#### 10. **Cloudinary** (Processamento de Imagens)
```env
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu-cloud-name
```
**🔗 Link:** [https://cloudinary.com](https://cloudinary.com)  
**📝 Setup:**
1. Criar conta gratuita
2. Ir em Dashboard
3. Copiar Cloud Name, API Key e API Secret

### 🧠 INTELIGÊNCIA ARTIFICIAL

#### 11. **DeepSeek AI** (AI Agents Primary Provider)
```env
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_MAX_TOKENS=1000
```
**🔗 Link:** [https://platform.deepseek.com](https://platform.deepseek.com)  
**📝 Setup:**
1. Criar conta DeepSeek
2. Ir em API keys
3. Criar nova secret key
4. **USAGE:** Sistema principal de AI para todos os agentes especializados

#### 12. **OpenAI** (AI Backup Provider)
```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7
```
**🔗 Link:** [https://platform.openai.com](https://platform.openai.com)  
**📝 Setup:**
1. Criar conta OpenAI
2. Ir em API keys
3. Criar nova secret key
4. **USAGE:** Provider de backup para AI agents

### 📊 MONITORAMENTO E ANALYTICS

#### 12. **Sentry** (Error Tracking)
```env
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
EXPO_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=gasrapido
SENTRY_PROJECT=gasrapido-web
SENTRY_ENVIRONMENT=development ou production
```
**🔗 Link:** [https://sentry.io](https://sentry.io)  
**📝 Setup:**
1. Criar conta Sentry
2. Criar novo projeto
3. Copiar DSN do projeto
4. Configurar organização

#### 13. **Google Analytics** (Analytics Web/Mobile)
```env
NEXT_PUBLIC_GA_TRACKING_ID=UA-XXXXXXXXX-X ou G-XXXXXXXXXX
EXPO_PUBLIC_GA_TRACKING_ID=UA-XXXXXXXXX-X
```
**🔗 Link:** [https://analytics.google.com](https://analytics.google.com)  
**📝 Setup:**
1. Criar propriedade no GA4
2. Copiar Measurement ID

#### 14. **Mixpanel** (Event Analytics)
```env
NEXT_PUBLIC_MIXPANEL_TOKEN=...
EXPO_PUBLIC_MIXPANEL_TOKEN=...
```
**🔗 Link:** [https://mixpanel.com](https://mixpanel.com)  
**📝 Setup:**
1. Criar projeto Mixpanel
2. Ir em Settings > Project Settings
3. Copiar Project Token

### 🏗️ INFRAESTRUTURA E FERRAMENTAS

#### 15. **Redis** (Cache)
```env
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```
**🔗 Produção:** [https://redis.com](https://redis.com) ou [https://upstash.com](https://upstash.com)  
**📝 Setup Local:** `docker run -d -p 6379:6379 redis:alpine`

#### 16. **RabbitMQ** (Message Queue)
```env
RABBITMQ_URL=amqp://admin:admin@localhost:5672
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin
```
**🔗 Produção:** [https://cloudamqp.com](https://cloudamqp.com)  
**📝 Setup Local:** `docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:management`

#### 17. **Consul** (Service Discovery)
```env
CONSUL_HTTP_ADDR=localhost:8500
CONSUL_HOST=localhost
CONSUL_PORT=8500
```
**🔗 Produção:** [https://www.consul.io](https://www.consul.io)  
**📝 Setup Local:** `docker run -d -p 8500:8500 hashicorp/consul:latest`

#### 18. **AWS S3** (Backup e Storage)
```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-west-1
AWS_S3_BUCKET=gasrapido-backups
```
**🔗 Link:** [https://aws.amazon.com/s3](https://aws.amazon.com/s3)  
**📝 Setup:**
1. Criar conta AWS
2. Ir em IAM > Users > Create user
3. Attach policy: AmazonS3FullAccess
4. Create access key

### 🔐 SEGURANÇA E AUTENTICAÇÃO

#### 19. **JWT e Session Secrets**
```env
JWT_SECRET=chave-super-secreta-com-pelo-menos-32-caracteres
SESSION_SECRET=outra-chave-super-secreta-para-sessoes
AUTH_SECRET=chave-para-autenticacao-next-auth
```
**📝 Geração:**
```bash
# Gerar chaves seguras
openssl rand -base64 32
# ou
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📂 Estrutura de Arquivos de Ambiente

### `.env.local` (Desenvolvimento)
```env
# === AMBIENTE ===
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development

# === SUPABASE LOCAL ===
SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# === APIS EXTERNAS ===
OPENWEATHER_API_KEY=SUA_CHAVE_OPENWEATHER_AQUI
GOOGLE_MAPS_API_KEY=SUA_CHAVE_GOOGLE_MAPS_AQUI
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_CHAVE_GOOGLE_MAPS_AQUI

# === PAGAMENTOS ===
STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_STRIPE_TESTE
STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_STRIPE_TESTE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_STRIPE_TESTE

# Multicaixa Sandbox
MULTICAIXA_API_KEY=SUA_CHAVE_MULTICAIXA_SANDBOX
MULTICAIXA_MERCHANT_ID=SEU_MERCHANT_ID_SANDBOX
MULTICAIXA_ENVIRONMENT=sandbox

# === COMUNICAÇÃO ===
FCM_PROJECT_ID=seu-projeto-firebase
NEXT_PUBLIC_FCM_PROJECT_ID=seu-projeto-firebase
TWILIO_ACCOUNT_SID=SUA_ACCOUNT_SID_TWILIO
TWILIO_AUTH_TOKEN=SEU_AUTH_TOKEN_TWILIO
SENDGRID_API_KEY=SG.SUA_CHAVE_SENDGRID

# === OUTROS ===
OPENAI_API_KEY=sk-SUA_CHAVE_OPENAI
SENTRY_DSN=https://SUA_DSN_SENTRY@sentry.io/projeto
CLOUDINARY_CLOUD_NAME=seu-cloud-name-cloudinary
```

### `.env` (Produção)
```env
# === AMBIENTE ===
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production

# === SUPABASE PRODUÇÃO ===
SUPABASE_URL=https://seu-projeto-producao.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-producao.supabase.co
SUPABASE_ANON_KEY=SUA_CHAVE_PRODUCAO
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_PRODUCAO
SUPABASE_SERVICE_ROLE_KEY=SUA_CHAVE_SERVICE_ROLE_PRODUCAO

# === URLs PRODUÇÃO ===
NEXT_PUBLIC_WEB_URL=https://gasrapido.com
NEXT_PUBLIC_API_URL=https://api.gasrapido.com

# === PAGAMENTOS PRODUÇÃO ===
STRIPE_PUBLISHABLE_KEY=pk_live_SUA_CHAVE_STRIPE_LIVE
STRIPE_SECRET_KEY=sk_live_SUA_CHAVE_STRIPE_LIVE
MULTICAIXA_ENVIRONMENT=production
MULTICAIXA_BASE_URL=https://api.multicaixa.ao

# === SEGURANÇA ===
JWT_SECRET=chave-jwt-super-secreta-producao-32-chars-min
SESSION_SECRET=chave-sessao-super-secreta-producao
AUTH_SECRET=chave-auth-super-secreta-producao

# === CORS PRODUÇÃO ===
CORS_ORIGIN=https://gasrapido.com,https://app.gasrapido.com
ALLOWED_ORIGINS=https://gasrapido.com,https://app.gasrapido.com
```

## 🔧 Scripts de Configuração

### Validação de Ambiente
```bash
# Validar todas as variáveis
npm run validate-env

# Testar conexões
npm run validate-env:connections

# Setup completo
npm run setup:env
```

### Comandos Docker para Desenvolvimento
```bash
# Iniciar todos os serviços locais
docker-compose up -d

# Apenas Supabase local
docker run -d -p 54321:8000 supabase/supabase

# Redis local
docker run -d -p 6379:6379 redis:alpine

# RabbitMQ local
docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:management
```

## ⚠️ PONTOS CRÍTICOS IDENTIFICADOS

### 1. **Weather API Integration**
O sistema de pricing dinâmico **DEPENDE** de dados meteorológicos. A função `getWeatherData()` no `pricingService.ts` precisa da OpenWeather API.

### 2. **Multicaixa + Stripe**
O sistema de pagamentos está configurado para funcionar com AMBOS os provedores simultaneamente para o mercado angolano.

### 3. **Service Discovery**
O projeto usa Consul para descoberta de serviços - essencial para arquitetura de microserviços.

### 4. **AI Agents**
Sistema tem agentes AI integrados que precisam do OpenAI API key.

### 5. **Real-time Features**
Redis e RabbitMQ são essenciais para funcionalidades em tempo real.

## 📞 Suporte por Serviço

### Problemas com Setup?

1. **Supabase:** [https://supabase.com/docs](https://supabase.com/docs)
2. **Stripe:** [https://stripe.com/docs](https://stripe.com/docs)
3. **Google Maps:** [https://developers.google.com/maps](https://developers.google.com/maps)
4. **OpenWeather:** [https://openweathermap.org/api](https://openweathermap.org/api)
5. **Firebase:** [https://firebase.google.com/docs](https://firebase.google.com/docs)
6. **Twilio:** [https://www.twilio.com/docs](https://www.twilio.com/docs)

## ✅ Checklist Final

- [ ] Supabase configurado (URL + Keys)
- [ ] OpenWeather API key obtida
- [ ] Google Maps API configurada
- [ ] Stripe configurado (test + live)
- [ ] Multicaixa credenciais obtidas
- [ ] Firebase FCM configurado
- [ ] Twilio SMS/WhatsApp configurado
- [ ] SendGrid email configurado
- [ ] Cloudinary configurado
- [ ] OpenAI API key obtida
- [ ] Sentry configurado
- [ ] Analytics configurado (GA + Mixpanel)
- [ ] AWS S3 configurado
- [ ] JWT secrets geradas
- [ ] Validação de ambiente passou
- [ ] Docker services rodando

---

**Rui, este guia cobre TODOS os serviços identificados no seu código. Cada um tem um propósito específico no sistema GasRápido. Precisa de ajuda com algum serviço específico?**