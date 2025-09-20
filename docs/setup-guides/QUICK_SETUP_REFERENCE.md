# 🎯 GasRápido - Quick Setup Reference Card

**Rui, aqui estão os links diretos para os serviços CRÍTICOS identificados no teu código:**

## 🔥 OBRIGATÓRIOS (Sistemas não funcionam sem estes)

### 1. **Supabase** (Base de Dados)
- 🔗 **Link:** https://supabase.com
- 📝 **Ação:** Criar projeto → Copiar URL e API Keys
- 🎯 **Variáveis:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### 2. **OpenWeather** (Pricing Dinâmico) 
- 🔗 **Link:** https://openweathermap.org/api
- 📝 **Ação:** Criar conta → My API keys
- 🎯 **Variável:** `OPENWEATHER_API_KEY`
- ⚠️ **CRÍTICO:** Sistema de pricing depende disto!

### 3. **Google Maps** (Mapas)
- 🔗 **Link:** https://console.cloud.google.com
- 📝 **Ação:** Ativar Maps API → Criar API Key
- 🎯 **Variável:** `GOOGLE_MAPS_API_KEY`

### 4. **Stripe** (Pagamentos)
- 🔗 **Link:** https://dashboard.stripe.com
- 📝 **Ação:** Developers → API keys
- 🎯 **Variáveis:** `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`

### 5. **Multicaixa** (Pagamentos Angola)
- 🔗 **Link:** Contactar Multicaixa comercialmente
- 📝 **Ação:** Obter credenciais merchant
- 🎯 **Variáveis:** `MULTICAIXA_API_KEY`, `MULTICAIXA_MERCHANT_ID`

## 🚀 IMPORTANTES (Funcionalidades avançadas)

### 6. **DeepSeek AI** (AI Agents Primary)
- 🔗 **Link:** https://platform.deepseek.com
- 📝 **Ação:** API keys → Create new secret key
- 🎯 **Variável:** `DEEPSEEK_API_KEY`
- 💡 **Uso:** Sistema principal de AI agents (DeepSeek, Customer Support, etc.)

### 7. **OpenAI** (AI Backup)
- 🔗 **Link:** https://platform.openai.com
- 📝 **Ação:** API keys → Create new secret key
- 🎯 **Variável:** `OPENAI_API_KEY`
- 💡 **Uso:** Provider de backup para AI features

### 8. **Firebase** (Notificações Push)
- 🔗 **Link:** https://console.firebase.google.com
- 📝 **Ação:** Criar projeto → Cloud Messaging
- 🎯 **Variáveis:** `FCM_PROJECT_ID`, `FCM_SERVER_KEY`

### 9. **Twilio** (SMS/WhatsApp)
- 🔗 **Link:** https://console.twilio.com
- 📝 **Ação:** Console → Account SID e Auth Token
- 🎯 **Variáveis:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`

### 10. **SendGrid** (Email)
- 🔗 **Link:** https://sendgrid.com
- 📝 **Ação:** Settings → API Keys
- 🎯 **Variável:** `SENDGRID_API_KEY`

## ⚡ COMANDOS RÁPIDOS

```bash
# Verificar configuração
npm run check-services

# Validar ambiente
npm run validate-env

# Setup completo
npm run setup:env

# Iniciar desenvolvimento
npm run dev
```

## 📁 ARQUIVOS IMPORTANTES

- `docs/COMPLETE_ENVIRONMENT_SETUP_GUIDE.md` - Guia completo
- `.env.example` - Template de todas as variáveis
- `.env.local` - Configuração de desenvolvimento
- `.env` - Configuração de produção

## 🆘 SE PRECISAR DE AJUDA

1. **Configuração específica:** Ver `docs/COMPLETE_ENVIRONMENT_SETUP_GUIDE.md`
2. **Problemas com serviços:** Executar `npm run check-services`
3. **Validação de ambiente:** Executar `npm run validate-env`

---

**✅ Checklist Rápido:**
- [ ] Supabase configurado
- [ ] OpenWeather API obtida
- [ ] Google Maps API configurada  
- [ ] Stripe configurado
- [ ] Multicaixa (se for para Angola)
- [ ] DeepSeek AI para agentes principais
- [ ] OpenAI como backup
- [ ] Firebase para notificações
- [ ] Executar `npm run check-services`