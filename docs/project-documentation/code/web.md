# Documentação da Aplicação Web

Documentação dos principais componentes e módulos da aplicação web do GasRápido.

## Estrutura Principal

```
web/
├── next.config.js          # Configuração do Next.js
├── package.json            # Dependências e scripts
├── public/                 # Arquivos públicos estáticos
├── src/
│   ├── app/                # Páginas e rotas da aplicação
│   ├── components/         # Componentes específicos da web
│   ├── lib/                # Bibliotecas e utilitários
│   ├── types/              # Tipos TypeScript
│   └── types.d.ts          # Declarações de tipos
```

## Páginas e Rotas (app/)

### page.tsx

Página principal da aplicação web (landing page).

**Principais funcionalidades:**
- Apresentação do serviço GasRápido
- Call-to-action para inscrição
- Navegação para diferentes tipos de usuários

### landing/

Página de destino principal com informações sobre o serviço.

**Componentes:**
- Hero section
- Recursos e benefícios
- Como funciona
- Depoimentos
- FAQ
- Contato

### inscricao-clientes/

Página de inscrição para clientes.

**Principais funcionalidades:**
- Formulário de registro de clientes
- Validação de dados
- Integração com serviço de autenticação

### inscricao-entregadores/

Página de inscrição para entregadores.

**Principais funcionalidades:**
- Formulário de registro de entregadores
- Validação de dados
- Integração com serviço de autenticação

### inscricao-fornecedores/

Página de inscrição para fornecedores.

**Principais funcionalidades:**
- Formulário de registro de fornecedores
- Validação de dados
- Integração com serviço de autenticação

### contato/

Página de contato.

**Principais funcionalidades:**
- Formulário de contato
- Informações de contato da empresa
- Mapa de localização

### design-system/

Página de demonstração do design system.

**Componentes demonstrados:**
- Botões
- Inputs
- Cards
- Badges
- Tipografia
- Cores

### fornecedor/

Área restrita para fornecedores.

**Subpáginas:**
- Dashboard principal
- Gestão de produtos
- Visualização de pedidos
- Relatórios

### courier/

Área restrita para entregadores.

**Subpáginas:**
- Dashboard principal
- Lista de entregas disponíveis
- Rastreamento de entregas
- Histórico de entregas

## Componentes

### Button.tsx

Componente de botão reutilizável.

**Props:**
- `children`: Conteúdo do botão
- `variant`: Variação visual (primary, secondary, outline)
- `size`: Tamanho (sm, md, lg)
- `onClick`: Função de callback ao clicar

### Header.tsx

Componente de cabeçalho da aplicação.

**Funcionalidades:**
- Navegação principal
- Menu responsivo
- Links de autenticação

### Footer.tsx

Componente de rodapé da aplicação.

**Conteúdo:**
- Links úteis
- Informações de contato
- Redes sociais
- Copyright

## Bibliotecas (lib/)

### supabase.ts

Cliente Supabase configurado para a aplicação web.

**Funcionalidades:**
- Conexão com o backend Supabase
- Configuração de URL e chave anônima
- Exportação do cliente para uso em toda a aplicação

## Tipos (types/)

### user.ts

Definições de tipos relacionados a usuários.

**Tipos principais:**
- `UserRole`: Tipos de usuários (cliente, fornecedor, entregador, admin)
- `User`: Estrutura completa de um usuário

### order.ts

Definições de tipos relacionados a pedidos.

**Tipos principais:**
- `Order`: Estrutura de um pedido
- `OrderStatus`: Status possíveis de um pedido

## Configuração

### next.config.js

Configuração do Next.js com:
- Configurações de PWA
- Otimizações de imagem
- Configurações de ambiente

### tailwind.config.js

Configuração do TailwindCSS com:
- Cores personalizadas do design system
- Extensões de tema
- Plugins

### .env.example

Exemplo de variáveis de ambiente necessárias:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase