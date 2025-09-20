#!/usr/bin/env node
/**
 * GasRápido Service Configuration Checker
 * Verifica se todos os serviços externos estão configurados e acessíveis
 */

const https = require('https');
const http = require('http');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${message}`, 'cyan');
  log(`${'='.repeat(60)}`, 'cyan');
}

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const services = [
  {
    name: 'Supabase',
    critical: true,
    check: () => {
      const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!url) return { status: 'error', message: 'SUPABASE_URL não configurada' };
      if (!key) return { status: 'error', message: 'SUPABASE_ANON_KEY não configurada' };
      if (url.includes('YOUR_')) return { status: 'warning', message: 'URL placeholder detectada' };
      if (key.includes('sua_')) return { status: 'warning', message: 'Key placeholder detectada' };
      
      return { status: 'success', message: 'Configurado corretamente' };
    }
  },
  {
    name: 'OpenWeather API (Pricing Dinâmico)',
    critical: true,
    check: () => {
      const key = process.env.OPENWEATHER_API_KEY;
      if (!key) return { status: 'error', message: 'OPENWEATHER_API_KEY não configurada - OBRIGATÓRIA para pricing dinâmico' };
      if (key.includes('sua_')) return { status: 'warning', message: 'Key placeholder detectada' };
      return { status: 'success', message: 'Configurado corretamente' };
    }
  },
  {
    name: 'Google Maps API',
    critical: true,
    check: () => {
      const key = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!key) return { status: 'error', message: 'GOOGLE_MAPS_API_KEY não configurada' };
      if (key.includes('sua_')) return { status: 'warning', message: 'Key placeholder detectada' };
      return { status: 'success', message: 'Configurado corretamente' };
    }
  },
  {
    name: 'Stripe (Pagamentos)',
    critical: true,
    check: () => {
      const pubKey = process.env.STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      const secKey = process.env.STRIPE_SECRET_KEY;
      
      if (!pubKey) return { status: 'error', message: 'STRIPE_PUBLISHABLE_KEY não configurada' };
      if (!secKey) return { status: 'error', message: 'STRIPE_SECRET_KEY não configurada' };
      if (pubKey.includes('sua_')) return { status: 'warning', message: 'Keys placeholder detectadas' };
      
      return { status: 'success', message: 'Configurado corretamente' };
    }
  },
  {
    name: 'Multicaixa (Pagamentos Angola)',
    critical: true,
    check: () => {
      const key = process.env.MULTICAIXA_API_KEY;
      const merchant = process.env.MULTICAIXA_MERCHANT_ID;
      
      if (!key) return { status: 'warning', message: 'MULTICAIXA_API_KEY não configurada - necessária para Angola' };
      if (!merchant) return { status: 'warning', message: 'MULTICAIXA_MERCHANT_ID não configurado' };
      if (key && key.includes('sua_')) return { status: 'warning', message: 'Keys placeholder detectadas' };
      
      return { status: 'success', message: 'Configurado corretamente' };
    }
  },
  {
    name: 'DeepSeek AI (Primary AI Provider)',
    critical: true,
    check: () => {
      const key = process.env.DEEPSEEK_API_KEY;
      const provider = process.env.AI_PROVIDER;
      
      if (!key) return { status: 'error', message: 'DEEPSEEK_API_KEY não configurada - OBRIGATÓRIA para AI Agents' };
      if (key.includes('sua_')) return { status: 'warning', message: 'Key placeholder detectada' };
      if (provider !== 'deepseek') return { status: 'warning', message: 'AI_PROVIDER não configurado para DeepSeek' };
      
      return { status: 'success', message: 'Configurado corretamente como provider principal' };
    }
  },
  {
    name: 'Firebase FCM (Notificações)',
    critical: false,
    check: () => {
      const projectId = process.env.FCM_PROJECT_ID || process.env.NEXT_PUBLIC_FCM_PROJECT_ID;
      const serverKey = process.env.FCM_SERVER_KEY;
      
      if (!projectId) return { status: 'warning', message: 'FCM_PROJECT_ID não configurado' };
      if (!serverKey) return { status: 'warning', message: 'FCM_SERVER_KEY não configurada' };
      
      return { status: 'success', message: 'Configurado corretamente' };
    }
  },
  {
    name: 'Twilio (SMS/WhatsApp)',
    critical: false,
    check: () => {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      
      if (!sid) return { status: 'warning', message: 'TWILIO_ACCOUNT_SID não configurado' };
      if (!token) return { status: 'warning', message: 'TWILIO_AUTH_TOKEN não configurado' };
      
      return { status: 'success', message: 'Configurado corretamente' };
    }
  },
  {
    name: 'SendGrid (Email)',
    critical: false,
    check: () => {
      const key = process.env.SENDGRID_API_KEY;
      if (!key) return { status: 'warning', message: 'SENDGRID_API_KEY não configurada' };
      if (key.includes('sua_')) return { status: 'warning', message: 'Key placeholder detectada' };
      return { status: 'success', message: 'Configurado corretamente' };
    }
  },
  {
    name: 'Cloudinary (Imagens)',
    critical: false,
    check: () => {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      
      if (!cloudName) return { status: 'warning', message: 'CLOUDINARY_CLOUD_NAME não configurado' };
      if (!apiKey) return { status: 'warning', message: 'CLOUDINARY_API_KEY não configurada' };
      
      return { status: 'success', message: 'Configurado corretamente' };
    }
  },
  {
    name: 'Sentry (Error Tracking)',
    critical: false,
    check: () => {
      const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
      if (!dsn) return { status: 'warning', message: 'SENTRY_DSN não configurado' };
      if (dsn.includes('sua_')) return { status: 'warning', message: 'DSN placeholder detectado' };
      return { status: 'success', message: 'Configurado corretamente' };
    }
  },
  {
    name: 'OpenAI (Backup AI Provider)',
    critical: false,
    check: () => {
      const key = process.env.OPENAI_API_KEY;
      if (!key) return { status: 'warning', message: 'OPENAI_API_KEY não configurada - Backup AI provider não disponível' };
      if (key.includes('sua_')) return { status: 'warning', message: 'Key placeholder detectada' };
      return { status: 'success', message: 'Configurado como backup' };
    }
  }
];

function checkServices() {
  logHeader('Verificação de Configuração de Serviços - GasRápido');
  
  let criticalErrors = 0;
  let warnings = 0;
  let success = 0;
  
  services.forEach(service => {
    const result = service.check();
    const icon = result.status === 'success' ? '✅' : 
                 result.status === 'warning' ? '⚠️' : '❌';
    const color = result.status === 'success' ? 'green' : 
                  result.status === 'warning' ? 'yellow' : 'red';
    
    const criticality = service.critical ? ' (CRÍTICO)' : '';
    log(`${icon} ${service.name}${criticality}: ${result.message}`, color);
    
    if (result.status === 'error' && service.critical) criticalErrors++;
    else if (result.status === 'warning') warnings++;
    else if (result.status === 'success') success++;
  });
  
  logHeader('Resumo da Verificação');
  
  log(`✅ Serviços configurados: ${success}`, 'green');
  log(`⚠️  Avisos: ${warnings}`, 'yellow');
  log(`❌ Erros críticos: ${criticalErrors}`, 'red');
  
  if (criticalErrors > 0) {
    log('\\n🚨 ATENÇÃO: Existem erros críticos que impedem o funcionamento do sistema!', 'red');
    log('Consulte o guia completo: docs/COMPLETE_ENVIRONMENT_SETUP_GUIDE.md', 'cyan');
    return false;
  } else if (warnings > 0) {
    log('\\n⚠️  Sistema pode funcionar com limitações. Recomenda-se configurar todos os serviços.', 'yellow');
    return true;
  } else {
    log('\\n🎉 Todos os serviços estão configurados corretamente!', 'green');
    return true;
  }
}

function showNextSteps() {
  logHeader('Próximos Passos');
  
  log('1. 📖 Leia o guia completo: docs/COMPLETE_ENVIRONMENT_SETUP_GUIDE.md', 'cyan');
  log('2. 🔑 Configure as APIs que faltam seguindo os links no guia', 'cyan');
  log('3. 🐳 Inicie os serviços locais: docker-compose up -d', 'cyan');
  log('4. 🚀 Execute o projeto: npm run dev', 'cyan');
  log('5. ✅ Execute novamente: npm run check-services', 'cyan');
}

function main() {
  const isValid = checkServices();
  showNextSteps();
  
  if (!isValid) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkServices };