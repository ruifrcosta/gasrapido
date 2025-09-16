# CI/CD e Deploy

## Visão Geral

Este documento descreve a configuração do sistema de integração contínua e deploy contínuo (CI/CD) para o GasRápido, incluindo os processos de build, teste e deploy automatizados para as aplicações web e mobile, bem como a infraestrutura backend.

## Plataformas Utilizadas

### GitHub Actions
- **CI/CD Pipeline**: Automação de builds, testes e deploys
- **Workflows**: Definição de processos para diferentes ambientes
- **Secrets Management**: Armazenamento seguro de credenciais
- **Matrix Builds**: Testes em múltiplas configurações

### Vercel
- **Deploy Web**: Hospedagem da aplicação Next.js
- **Preview Deployments**: Ambientes de pré-visualização para PRs
- **Alias Management**: Gerenciamento de domínios e subdomínios
- **Performance Analytics**: Monitoramento de performance

### Expo EAS
- **Deploy Mobile**: Build e distribuição da aplicação React Native
- **Over-the-Air Updates**: Atualizações sem necessidade de store updates
- **Build Variants**: Diferentes builds para dev, staging e produção
- **App Store Integration**: Publicação automática nas stores

## Estrutura dos Workflows

### Workflow Principal (CI/CD)

```yaml
# .github/workflows/ci-cd.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Verificação de qualidade do código
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint
      - name: Run type checking
        run: npm run type-check

  # Testes automatizados
  test:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm run test:unit
      - name: Run integration tests
        run: npm run test:integration

  # Build e deploy da aplicação web
  web-deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build web app
        run: npm run web:build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_SCOPE }}

  # Build e deploy da aplicação mobile
  mobile-build:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Setup Expo
        uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Build mobile app
        run: npm run mobile:build
      - name: Submit to Expo EAS
        run: npm run mobile:submit
```

## Configuração de Ambientes

### Desenvolvimento
- **Branch**: `develop`
- **URL Web**: https://dev.gasrapido.com
- **App Mobile**: Build de desenvolvimento
- **Supabase**: Projeto de desenvolvimento

### Staging
- **Branch**: `staging` (merge da `develop`)
- **URL Web**: https://staging.gasrapido.com
- **App Mobile**: Build de staging
- **Supabase**: Projeto de staging

### Produção
- **Branch**: `main` (merge da `staging`)
- **URL Web**: https://app.gasrapido.com
- **App Mobile**: Build de produção
- **Supabase**: Projeto de produção

## Processo de Deploy

### 1. Pull Request
1. Desenvolvedor cria PR para `develop`
2. GitHub Actions executa linter e testes
3. Se passar, PR pode ser mergeado

### 2. Deploy para Desenvolvimento
1. Push para branch `develop`
2. GitHub Actions:
   - Executa linter e testes
   - Faz build da aplicação web
   - Deploy para Vercel (dev.gasrapido.com)
   - Build da aplicação mobile
   - Deploy para Expo (canal development)

### 3. Deploy para Staging
1. Merge de `develop` para `staging`
2. GitHub Actions:
   - Executa linter e testes
   - Faz build da aplicação web
   - Deploy para Vercel (staging.gasrapido.com)
   - Build da aplicação mobile
   - Deploy para Expo (canal staging)

### 4. Deploy para Produção
1. Merge de `staging` para `main`
2. GitHub Actions:
   - Executa linter e testes
   - Faz build da aplicação web
   - Deploy para Vercel (app.gasrapido.com)
   - Build da aplicação mobile
   - Deploy para Expo (canal production)
   - Cria release no GitHub

## Configuração de Secrets

### GitHub Secrets
```bash
# Supabase
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Vercel
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
VERCEL_SCOPE

# Expo
EXPO_TOKEN

# APIs externas
GOOGLE_MAPS_API_KEY
MAPBOX_ACCESS_TOKEN
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
FCM_SERVER_KEY
```

## Monitoramento e Rollback

### Monitoramento
- Verificação automática de builds e deploys
- Alertas em caso de falhas
- Métricas de performance pós-deploy
- Health checks das aplicações

### Rollback
- Reversão automática em caso de falhas críticas
- Rollback manual através de GitHub Actions
- Versionamento de código para fácil reversão
- Backup automático do estado anterior

## Práticas Recomendadas

### Commits e Versionamento
- Commits atômicos e bem descritos
- Mensagens de commit seguindo conventional commits
- Versionamento semântico (SemVer)
- Tags de release para cada versão

### Branch Strategy
- `main`: Código em produção
- `staging`: Código pronto para produção
- `develop`: Código em desenvolvimento
- `feature/*`: Branches para novas funcionalidades
- `hotfix/*`: Branches para correções urgentes

### Testes
- Testes unitários para cada nova funcionalidade
- Testes de integração para APIs e serviços
- Testes E2E para fluxos críticos
- Cobertura mínima de 80% para deploy em staging

## Próximos Passos

1. Implementar testes de performance automatizados
2. Adicionar análise de segurança no pipeline
3. Implementar aprovações manuais para deploys em produção
4. Adicionar métricas de qualidade de código
5. Configurar notificações de status do CI/CD