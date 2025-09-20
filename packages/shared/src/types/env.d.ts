declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Environment
      NODE_ENV: 'development' | 'production' | 'test';
      
      // Supabase
      SUPABASE_URL: string;
      SUPABASE_KEY: string;
      SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      
      // Database
      DATABASE_URL: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_SSL: string;
      
      // Security
      JWT_SECRET: string;
      SESSION_SECRET: string;
      AUTH_SECRET: string;
      
      // Maps
      GOOGLE_MAPS_API_KEY: string;
      MAPBOX_ACCESS_TOKEN: string;
      
      // Payments
      STRIPE_PUBLISHABLE_KEY: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      MULTICAIXA_API_KEY: string;
      MULTICAIXA_MERCHANT_ID: string;
      MULTICAIXA_ENVIRONMENT: string;
      
      // Notifications
      FCM_SERVER_KEY: string;
      FCM_PROJECT_ID: string;
      FCM_PRIVATE_KEY: string;
      FCM_CLIENT_EMAIL: string;
      VAPID_PUBLIC_KEY: string;
      VAPID_PRIVATE_KEY: string;
      VAPID_EMAIL: string;
      
      // Communication
      TWILIO_ACCOUNT_SID: string;
      TWILIO_AUTH_TOKEN: string;
      TWILIO_PHONE_NUMBER: string;
      SENDGRID_API_KEY: string;
      SENDGRID_FROM_EMAIL: string;
      SENDGRID_FROM_NAME: string;
      SENDGRID_TEMPLATE_ID: string;
      
      // Monitoring
      SENTRY_DSN: string;
      SENTRY_ORG: string;
      SENTRY_PROJECT: string;
      
      // Storage
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      
      // Weather (OBRIGATÓRIO para pricing dinâmico)
      OPENWEATHER_API_KEY: string;
      WEATHER_LOCATION_DEFAULT: string;
      WEATHER_UPDATE_INTERVAL: string;
      
      // AI (OBRIGATÓRIO para AI Agents)
      AI_PROVIDER: string;
      DEEPSEEK_API_KEY: string;
      DEEPSEEK_MODEL: string;
      DEEPSEEK_BASE_URL: string;
      DEEPSEEK_TEMPERATURE: string;
      DEEPSEEK_MAX_TOKENS: string;
      OPENAI_API_KEY: string;
      OPENAI_MODEL: string;
      OPENAI_TEMPERATURE: string;
      OPENAI_MAX_TOKENS: string;
      
      // Cache
      REDIS_URL: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      
      // Message Queue
      RABBITMQ_URL: string;
      
      // Service Discovery
      CONSUL_HTTP_ADDR: string;
      
      // AWS
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      
      // Optional environment variables
      DEBUG?: string;
      LOG_LEVEL?: string;
      VERBOSE?: string;
    }
  }
  
  // Next.js specific environment variables
  interface NextPublicEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    NEXT_PUBLIC_FCM_PROJECT_ID: string;
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: string;
    NEXT_PUBLIC_SENTRY_DSN: string;
    NEXT_PUBLIC_WEB_URL: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_PWA_ENABLED: string;
    NEXT_PUBLIC_GA_TRACKING_ID?: string;
    NEXT_PUBLIC_MIXPANEL_TOKEN?: string;
    NEXT_PUBLIC_APP_ENV: string;
  }
  
  // Expo specific environment variables
  interface ExpoPublicEnv {
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
    EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: string;
    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    EXPO_PUBLIC_FCM_PROJECT_ID: string;
    EXPO_PUBLIC_SENTRY_DSN: string;
    EXPO_PUBLIC_API_URL: string;
    EXPO_PUBLIC_GA_TRACKING_ID?: string;
    EXPO_PUBLIC_MIXPANEL_TOKEN?: string;
    EXPO_PUBLIC_APP_ENV: string;
  }
}

export {};