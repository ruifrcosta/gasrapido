# Documentação do Pacote UI

Documentação do design system e componentes de interface reutilizáveis.

## Estrutura Principal

```
ui/
├── package.json            # Configuração do pacote
├── src/
│   ├── index.ts            # Ponto de entrada do pacote
│   ├── components/         # Componentes reutilizáveis
│   ├── hooks/              # Hooks de interface
│   └── types.d.ts          # Declarações de tipos
```

## Componentes (components/)

### Button

Componente de botão reutilizável com múltiplas variantes.

**Props:**
- `children`: Conteúdo do botão
- `variant`: Variação visual ('primary', 'secondary', 'outline', 'ghost')
- `size`: Tamanho ('sm', 'md', 'lg')
- `disabled`: Estado desabilitado
- `onClick`: Função de callback ao clicar
- `className`: Classes CSS adicionais

**Variantes:**
- `primary`: Botão principal com fundo azul
- `secondary`: Botão secundário com fundo cinza
- `outline`: Botão com borda apenas
- `ghost`: Botão sem fundo, apenas texto

### Input

Componente de campo de entrada reutilizável.

**Props:**
- `label`: Rótulo do campo
- `placeholder`: Texto de placeholder
- `value`: Valor atual
- `onChange`: Função de callback para mudança de valor
- `error`: Mensagem de erro
- `helperText`: Texto de ajuda
- `type`: Tipo de input (text, email, password, etc.)
- `disabled`: Estado desabilitado

### Card

Componente de card para agrupar conteúdo.

**Props:**
- `children`: Conteúdo do card
- `title`: Título do card
- `subtitle`: Subtítulo do card
- `actions`: Ações do card
- `className`: Classes CSS adicionais

### Badge

Componente de badge para indicadores visuais.

**Props:**
- `children`: Conteúdo do badge
- `variant`: Variação visual ('default', 'success', 'warning', 'error')
- `size`: Tamanho ('sm', 'md')
- `className`: Classes CSS adicionais

### Form

Componente de formulário estruturado.

**Props:**
- `children`: Campos do formulário
- `onSubmit`: Função de callback ao submeter
- `className`: Classes CSS adicionais

### Navbar

Componente de barra de navegação responsiva.

**Props:**
- `children`: Itens de navegação
- `brand`: Elemento da marca
- `className`: Classes CSS adicionais

### Footer

Componente de rodapé com layout em grid.

**Props:**
- `children`: Conteúdo do rodapé
- `className`: Classes CSS adicionais

## Hooks (hooks/)

### useToast

Hook personalizado para notificações toast.

**Funcionalidades:**
- `showToast`: Exibição de notificação
- `hideToast`: Ocultar notificação
- `toast`: Estado atual da notificação

## Tipos (types.d.ts)

Declarações de tipos para os componentes.

**Tipos principais:**
- `ButtonVariant`: Variantes do botão
- `ButtonSize`: Tamanhos do botão
- `BadgeVariant`: Variantes do badge
- `BadgeSize`: Tamanhos do badge

## Cores Principais

- **Primary**: Azul (#1F3A93)
- **Accent**: Amarelo (#FFB400)
- **Neutras**: Escala de cinzas para textos e backgrounds

## Tipografia

- **Fonte**: Inter (system-ui, sans-serif)
- **Hierarquia**: H1-H3 para cabeçalhos, textos grandes, médios e pequenos

## Ponto de Entrada (index.ts)

Arquivo principal que exporta todos os componentes do design system.

**Exportações:**
- `Button`: Componente de botão
- `Input`: Componente de campo de entrada
- `Card`: Componente de card
- `Badge`: Componente de badge
- `Form`: Componente de formulário
- `Navbar`: Componente de barra de navegação
- `Footer`: Componente de rodapé
- `useToast`: Hook de notificações