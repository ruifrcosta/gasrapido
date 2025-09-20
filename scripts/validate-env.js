#!/usr/bin/env node
/**
 * Environment Validation Script for GasRápido
 * 
 * This script validates that all required environment variables are set
 * and provides helpful error messages for missing configurations.
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

// Environment variable configuration
const requiredVars = {
  development: [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'DATABASE_URL'
  ],
  production: [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'DATABASE_URL',
    'SESSION_SECRET',
    'AUTH_SECRET',
    'GOOGLE_MAPS_API_KEY',
    'STRIPE_SECRET_KEY',
    'SENTRY_DSN'
  ]
};

const optionalVars = [
  'FCM_SERVER_KEY',
  'TWILIO_ACCOUNT_SID',
  'SENDGRID_API_KEY',
  'OPENWEATHER_API_KEY',  // CRÍTICO para pricing dinâmico
  'CLOUDINARY_API_KEY',
  'DEEPSEEK_API_KEY',     // CRÍTICO para AI agents (DeepSeek)
  'OPENAI_API_KEY',       // Backup AI provider
  'REDIS_URL',
  'RABBITMQ_URL',
  'CONSUL_HTTP_ADDR',
  'MULTICAIXA_API_KEY',   // CRÍTICO para pagamentos Angola
  'SENTRY_DSN',
  'VAPID_PUBLIC_KEY',
  'AWS_ACCESS_KEY_ID'
];

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\\n${'='.repeat(60)}`, 'cyan');
  log(`  ${message}`, 'cyan');
  log(`${'='.repeat(60)}`, 'cyan');
}

function loadEnvFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    
    content.split('\\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    return env;
  } catch (error) {
    log(`Error reading ${filePath}: ${error.message}`, 'red');
    return null;
  }
}

function validateEnvironment() {
  logHeader('GasRápido Environment Validation');
  
  const nodeEnv = process.env.NODE_ENV || 'development';
  log(`\\nEnvironment: ${nodeEnv}`, 'blue');
  
  // Determine which env file to check
  const envFiles = [
    '.env.local',
    '.env',
    '.env.example'
  ];
  
  let envData = {};
  let envFile = null;
  
  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    const data = loadEnvFile(filePath);
    if (data) {
      envData = { ...envData, ...data };
      if (!envFile) envFile = file;
    }
  }
  
  if (!envFile) {
    log('\\n❌ No environment files found!', 'red');
    log('Please create .env.local or .env file based on .env.example', 'yellow');
    return false;
  }
  
  log(`\\nUsing environment file: ${envFile}`, 'green');
  
  // Merge with process.env (process.env takes precedence)
  const allVars = { ...envData, ...process.env };
  
  const required = requiredVars[nodeEnv] || requiredVars.development;
  
  logHeader('Required Variables Validation');
  
  let missingRequired = [];
  let invalidValues = [];
  
  required.forEach(varName => {
    const value = allVars[varName];
    
    if (!value) {
      missingRequired.push(varName);
      log(`❌ ${varName}: MISSING`, 'red');
    } else if (value.includes('sua_') || value.includes('seu_') || value === 'YOUR_') {
      invalidValues.push(varName);
      log(`⚠️  ${varName}: PLACEHOLDER VALUE`, 'yellow');
    } else {
      log(`✅ ${varName}: SET`, 'green');
    }
  });
  
  logHeader('Optional Variables Check');
  
  let missingOptional = [];
  
  optionalVars.forEach(varName => {
    const value = allVars[varName];
    
    if (!value) {
      missingOptional.push(varName);
      log(`⚪ ${varName}: NOT SET (optional)`, 'yellow');
    } else if (value.includes('sua_') || value.includes('seu_')) {
      log(`⚠️  ${varName}: PLACEHOLDER VALUE`, 'yellow');
    } else {
      log(`✅ ${varName}: SET`, 'green');
    }
  });
  
  logHeader('Validation Summary');
  
  if (missingRequired.length === 0 && invalidValues.length === 0) {
    log('\\n🎉 All required environment variables are properly configured!', 'green');
    
    if (missingOptional.length > 0) {
      log(`\\n⚠️  ${missingOptional.length} optional variables are not set.`, 'yellow');
      log('Some features may not work without these variables.', 'yellow');
    }
    
    return true;
  } else {
    log('\\n❌ Environment validation failed!', 'red');
    
    if (missingRequired.length > 0) {
      log(`\\nMissing required variables (${missingRequired.length}):`, 'red');
      missingRequired.forEach(varName => {
        log(`  - ${varName}`, 'red');
      });
    }
    
    if (invalidValues.length > 0) {
      log(`\\nVariables with placeholder values (${invalidValues.length}):`, 'yellow');
      invalidValues.forEach(varName => {
        log(`  - ${varName}`, 'yellow');
      });
    }
    
    log('\\n📖 For setup instructions, see: docs/ENV_SETUP_GUIDE.md', 'cyan');
    
    return false;
  }
}

function checkServiceConnections() {
  logHeader('Service Connection Tests');
  
  // TODO: Add actual connection tests
  log('🔄 Service connection tests not implemented yet', 'yellow');
  log('This will be added in future versions', 'yellow');
}

function main() {
  const isValid = validateEnvironment();
  
  if (process.argv.includes('--connections')) {
    checkServiceConnections();
  }
  
  if (!isValid) {
    process.exit(1);
  }
  
  log('\\n✨ Environment validation completed successfully!\\n', 'green');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateEnvironment,
  checkServiceConnections
};