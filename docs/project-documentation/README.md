# Documentação Completa do Projeto GasRápido

Documentação técnica abrangente do projeto GasRápido, incluindo arquitetura, código, infraestrutura, fluxos de negócio, segurança e sistema de tickets.

## Índice

1. [Resumo Executivo](#resumo-executivo)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Documentação do Código](#documentação-do-código)
4. [Documentação da Infraestrutura](#documentação-da-infraestrutura)
5. [Documentação de UI/UX](#documentação-de-uiux)
6. [Fluxos de Negócio](#fluxos-de-negócio)
7. [Segurança](#segurança)
8. [Sistema de Tickets](#sistema-de-tickets)
9. [Anexos Técnicos](#anexos-técnicos)

---

## Resumo Executivo

O GasRápido é uma plataforma logística para entrega segura e rápida de botijas de gás em Luanda, conectando clientes, fornecedores e entregadores. O sistema é composto por uma aplicação mobile PWA para clientes e entregadores, um dashboard web PWA para fornecedores e administradores, e um backend baseado em Supabase com PostgreSQL, autenticação, realtime e storage.

## Arquitetura do Sistema

O projeto segue uma arquitetura monorepo com workspaces, contendo:

```
gasrapido/
├── apps/
│   ├── mobile/          # PWA Mobile (React Native + Capacitor)
│   └── web/             # PWA Web (Next.js)
├── packages/
│   ├── shared/          # Tipos, utils e lógica compartilhada
│   └── ui/              # Design system e componentes
└── supabase/            # Database schema e edge functions
```

## Documentação do Código

- [Documentação do Código Fonte](code/README.md)

## Documentação da Infraestrutura

- [Documentação da Infraestrutura](infrastructure/README.md)

## Documentação de UI/UX

- [Documentação de Componentes Visuais e Fluxos de Navegação](ui-ux/README.md)

## Fluxos de Negócio

- [Fluxos de Negócio](business-flows/README.md)

## Segurança

- [Documentação de Segurança](security/README.md)

## Sistema de Tickets

- [Documentação do Sistema de Tickets](ticketing/README.md)

## Anexos Técnicos

- [Estrutura do Repositório](repository-structure.md)
- [Design System](../../DESIGN_SYSTEM.md)
- [Fluxo de Pedido](../pedido-fluxo.md)
- [Próximos Passos](../../NEXT_STEPS.md)