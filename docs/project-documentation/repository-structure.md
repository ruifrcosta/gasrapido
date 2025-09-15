# Estrutura do Repositório GasRápido

Documentação detalhada da estrutura do repositório do projeto GasRápido.

## Visão Geral

O projeto GasRápido segue uma arquitetura monorepo com workspaces, contendo todas as partes do sistema em um único repositório.

## Estrutura Principal

```
gasrapido/
├── .git/                    # Repositório Git
├── .gitignore               # Arquivos e pastas ignorados pelo Git
├── .eslintrc.js             # Configuração do ESLint
├── .prettierrc              # Configuração do Prettier
├── DESIGN_SYSTEM.md         # Documentação do design system
├── NEXT_STEPS.md            # Próximos passos do projeto
├── README.md                # Documentação principal do projeto
├── TYPESCRIPT_FIXES.md      # Correções e configurações do TypeScript
├── apps/                    # Aplicações principais
│   ├── mobile/              # Aplicação mobile PWA (React Native + Capacitor)
│   └── web/                 # Aplicação web PWA (Next.js)
├── docs/                    # Documentação do projeto
│   ├── README.md            # Índice da documentação
│   ├── pedido-fluxo.md      # Documentação do fluxo de pedido
│   └── project-documentation/ # Documentação completa do projeto
├── package.json             # Configuração do projeto e dependências
├── packages/                # Pacotes compartilhados
│   ├── shared/              # Lógica e tipos compartilhados
│   └── ui/                  # Componentes de interface
├── supabase/                # Configuração e código do backend Supabase
├── tsconfig.json            # Configuração do TypeScript
└── turbo.json               # Configuração do TurboRepo
```

## Detalhamento por Pasta

### apps/

Contém as aplicações principais do projeto:

#### mobile/
Aplicação mobile PWA desenvolvida com React Native e Capacitor.

#### web/
Aplicação web PWA desenvolvida com Next.js.

### packages/

Contém pacotes compartilhados entre as aplicações:

#### shared/
Contém tipos, utilitários e lógica compartilhada entre as aplicações.

#### ui/
Contém o design system e componentes de interface reutilizáveis.

### supabase/

Contém toda a configuração e código do backend Supabase:

- config.toml: Configuração do projeto Supabase
- functions/: Edge functions do Supabase
- migrations/: Migrações do banco de dados
- seed/: Dados iniciais do banco de dados

### docs/

Contém toda a documentação do projeto:

- pedido-fluxo.md: Documentação do fluxo de pedido
- project-documentation/: Documentação completa do projeto

## Arquivos de Configuração Principais

### package.json
Arquivo de configuração principal do projeto com dependências e scripts.

### tsconfig.json
Configuração do TypeScript para o projeto.

### turbo.json
Configuração do TurboRepo para gerenciamento do monorepo.

### .eslintrc.js e .prettierrc
Configurações de linting e formatação de código.

## Arquivos de Documentação

### README.md
Documentação principal do projeto com visão geral, arquitetura e instruções de execução.

### DESIGN_SYSTEM.md
Documentação do design system com componentes, cores e tipografia.

### NEXT_STEPS.md
Próximos passos e tarefas planejadas para o desenvolvimento.

### TYPESCRIPT_FIXES.md
Correções e configurações do TypeScript realizadas no projeto.

## Dependências Externas

### Frontend
- React Native
- Next.js
- Capacitor
- TailwindCSS

### Backend
- Supabase (PostgreSQL, Auth, Realtime, Storage, Edge Functions)

### Ferramentas de Desenvolvimento
- TypeScript
- ESLint
- Prettier
- TurboRepo