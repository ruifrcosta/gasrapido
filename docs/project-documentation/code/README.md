# Documentação do Código Fonte

Documentação automática do código fonte do projeto GasRápido.

## Índice

1. [Aplicação Mobile](#aplicação-mobile)
2. [Aplicação Web](#aplicação-web)
3. [Pacotes Compartilhados](#pacotes-compartilhados)
4. [Backend Supabase](#backend-supabase)

## Aplicação Mobile

Documentação dos principais componentes e módulos da aplicação mobile.

### Estrutura Principal

```
mobile/
├── app/                 # Telas e navegação
├── components/          # Componentes específicos da mobile
├── hooks/               # Hooks personalizados
├── services/            # Serviços e integrações
└── utils/               # Funções utilitárias
```

### Documentação Detalhada

- [Documentação da Aplicação Mobile](mobile.md)

## Aplicação Web

Documentação dos principais componentes e módulos da aplicação web.

### Estrutura Principal

```
web/
├── app/                 # Páginas e rotas
├── components/          # Componentes específicos da web
├── hooks/               # Hooks personalizados
├── services/            # Serviços e integrações
└── utils/               # Funções utilitárias
```

### Documentação Detalhada

- [Documentação da Aplicação Web](web.md)

## Pacotes Compartilhados

Documentação dos pacotes compartilhados entre as aplicações.

### shared/

Contém tipos, utilitários e lógica compartilhada.

```
shared/
├── types/               # Tipos TypeScript compartilhados
├── utils/               # Funções utilitárias compartilhadas
└── services/            # Serviços compartilhados
```

### Documentação Detalhada

- [Documentação do Pacote Shared](shared.md)

### ui/

Contém o design system e componentes de interface reutilizáveis.

```
ui/
├── components/          # Componentes reutilizáveis
├── hooks/               # Hooks de interface
└── utils/               # Funções utilitárias de UI
```

### Documentação Detalhada

- [Documentação do Pacote UI](ui.md)

## Backend Supabase

Documentação das edge functions e schema do banco de dados.

### Estrutura Principal

```
supabase/
├── functions/           # Edge functions
├── migrations/          # Migrações do banco de dados
└── seed/                # Dados iniciais
```

### Documentação Detalhada

- [Documentação do Backend Supabase](supabase.md)