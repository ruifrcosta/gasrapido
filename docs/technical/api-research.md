# Pesquisa de APIs Gratuitas para o GasRápido

## 1. Autenticação e Segurança

### Firebase Authentication
- **Descrição**: Serviço de autenticação do Google com suporte a OAuth, JWT e múltiplos provedores
- **Limites gratuitos**: 
  - 50K logins mensais
  - 10GB de storage para arquivos de usuários
- **Utilidade**: Perfeito para o fluxo de autenticação do GasRápido, com suporte a múltiplos provedores
- **Link**: https://firebase.google.com/docs/auth

### Auth0 (Free Tier)
- **Descrição**: Plataforma de autenticação com suporte completo a OAuth 2.0, JWT e 2FA
- **Limites gratuitos**: 
  - 7K usuários ativos mensais
  - 1K logins sociais mensais
- **Utilidade**: Excelente para implementação de 2FA para entregadores e fornecedores
- **Link**: https://auth0.com/pricing

## 2. Geolocalização e Mapas

### Google Maps Platform
- **Descrição**: API completa de mapas com geocodificação, rotas e places
- **Limites gratuitos**: 
  - $200/mês em créditos (suficiente para ~28K map loads)
  - Geocodificação: 40K requisições/mês
- **Utilidade**: Ideal para rastreamento em tempo real e otimização de rotas
- **Link**: https://developers.google.com/maps/documentation

### Mapbox
- **Descrição**: Plataforma de mapas customizável com APIs de navegação e geocodificação
- **Limites gratuitos**: 
  - 50K map views/mês
  - 100K geocodificações/mês
- **Utilidade**: Alternativa ao Google Maps com maior customização
- **Link**: https://www.mapbox.com/pricing

### OpenStreetMap (Nominatim)
- **Descrição**: Mapa open-source com API de geocodificação gratuita
- **Limites gratuitos**: 
  - 1 requisição/segundo
  - Uso comercial permitido com atribuição
- **Utilidade**: Opção gratuita para geocodificação básica
- **Link**: https://nominatim.org/

## 3. Notificações

### Firebase Cloud Messaging (FCM)
- **Descrição**: Serviço gratuito do Google para envio de notificações push
- **Limites gratuitos**: 
  - Ilimitado para apps com até 100 usuários ativos
  - $0.001 por mensagem para apps maiores
- **Utilidade**: Perfeito para notificações em tempo real do estado dos pedidos
- **Link**: https://firebase.google.com/docs/cloud-messaging

### OneSignal (Free Tier)
- **Descrição**: Plataforma de notificações push com dashboard intuitivo
- **Limites gratuitos**: 
  - Ilimitado para até 10K usuários
  - Sem limite de mensagens
- **Utilidade**: Alternativa ao FCM com interface mais amigável
- **Link**: https://onesignal.com/pricing

## 4. Pagamentos

### Stripe (Test Mode)
- **Descrição**: API de pagamentos completa com modo sandbox para testes
- **Limites gratuitos**: 
  - Totalmente gratuito no modo test
  - Sem limites de requisições
- **Utilidade**: Ideal para testar o fluxo de pagamento antes de ir para produção
- **Link**: https://stripe.com/docs/testing

### PayPal (Sandbox)
- **Descrição**: Plataforma de pagamentos com ambiente sandbox para testes
- **Limites gratuitos**: 
  - Totalmente gratuito no modo sandbox
  - Sem limites de transações
- **Utilidade**: Alternativa ao Stripe, especialmente para mercados locais
- **Link**: https://developer.paypal.com/tools/sandbox/

## 5. Clima e Tempo Real

### OpenWeatherMap (Free Tier)
- **Descrição**: API de clima com dados atuais, previsões e históricos
- **Limites gratuitos**: 
  - 1K requisições/dia
  - Dados atuais e previsões de 5 dias
- **Utilidade**: Para integração com o motor de precificação dinâmica
- **Link**: https://openweathermap.org/price

### Open-Meteo
- **Descrição**: API de clima open-source sem necessidade de API key
- **Limites gratuitos**: 
  - Sem limites de requisições para uso não comercial
  - Dados de múltiplos provedores
- **Utilidade**: Alternativa gratuita ao OpenWeatherMap
- **Link**: https://open-meteo.com/

## 6. Comunicação

### Twilio (Free Trial)
- **Descrição**: API de comunicação com SMS, WhatsApp e email
- **Limites gratuitos**: 
  - $15 em créditos gratuitos
  - 1K mensagens SMS
  - WhatsApp sandbox para desenvolvimento
- **Utilidade**: Para notificações críticas e comunicação com usuários
- **Link**: https://www.twilio.com/docs/usage/tutorials/how-to-use-your-free-trial-account

### SendGrid (Free Tier)
- **Descrição**: API de envio de emails com alta deliverability
- **Limites gratuitos**: 
  - 100 emails/dia
  - 40K emails/mês
- **Utilidade**: Para emails de notificação e comunicação transacional
- **Link**: https://sendgrid.com/en-us/pricing

## 7. Monitorização e Logs

### Sentry (Free Tier)
- **Descrição**: Plataforma de monitoramento de erros e performance
- **Limites gratuitos**: 
  - 5K eventos/mês
  - 10K transações/mês
  - 1GB de attachments
- **Utilidade**: Essencial para monitorar a saúde da aplicação em produção
- **Link**: https://sentry.io/pricing/

### LogRocket (Free Tier)
- **Descrição**: Ferramenta de replay de sessões e monitoramento de UX
- **Limites gratuitos**: 
  - 1K sessões/mês
  - 30 dias de retenção
  - 1GB de armazenamento
- **Utilidade**: Para entender problemas de UX e debugar issues complexas
- **Link**: https://logrocket.com/pricing/

## 8. Armazenamento e Uploads

### Firebase Storage (Free Tier)
- **Descrição**: Serviço de armazenamento do Google com CDN integrado
- **Limites gratuitos**: 
  - 1GB de storage
  - 10GB de download/mês
- **Utilidade**: Ideal para armazenar fotos de entregas e documentos dos usuários
- **Link**: https://firebase.google.com/docs/storage

### Cloudinary (Free Tier)
- **Descrição**: Plataforma de gerenciamento e otimização de mídia
- **Limites gratuitos**: 
  - 25K transformações/mês
  - 25GB de storage
  - 25GB de banda
- **Utilidade**: Perfeito para otimizar e entregar imagens das entregas
- **Link**: https://cloudinary.com/pricing