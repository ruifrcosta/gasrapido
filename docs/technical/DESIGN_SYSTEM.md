# GasRápido Design System

Documentação completa do design system utilizado no projeto GasRápido.

## 🎨 Cores

### Cores Primárias
- **Primary**: `#1F3A93` (Azul)
- **Accent**: `#FFB400` (Amarelo)

### Cores de Fundo
- **Background**: `#FFFFFF` (Branco)
- **Background Alt**: `#F8F8F8` (Cinza Claro)

### Cores de Texto
- **Text Primary**: `#111111` (Preto)
- **Text Secondary**: `#666666` (Cinza Médio)

### Cores de Feedback
- **Success**: `#00C853` (Verde)
- **Error**: `#D32F2F` (Vermelho)
- **Warning**: `#FFA000` (Laranja)
- **Info**: `#1976D2` (Azul)

## 🔠 Tipografia

### Família de Fontes
- **Font Family**: Inter, Sans-serif

### Pesos
- **Regular**: 400
- **Medium**: 500
- **Bold**: 700

### Cabeçalhos
- **H1**: 32px, Bold, Line Height 40px
- **H2**: 24px, Bold, Line Height 32px
- **H3**: 20px, Medium, Line Height 28px

### Corpo do Texto
- **Large**: 18px, Regular, Line Height 26px
- **Medium**: 16px, Regular, Line Height 24px
- **Small**: 14px, Regular, Line Height 20px

## 📐 Layout

### Sistema de Grid
- **Colunas**: 12
- **Gutter**: 24px
- **Largura Máxima**: 1440px

### Espaçamento
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 40px

### Bordas Arredondadas
- **Pequena**: 8px
- **Média**: 16px
- **Grande**: 24px
- **Completa**: 50%

### Sombras
- **Light**: 0px 2px 4px rgba(0,0,0,0.08)
- **Medium**: 0px 4px 12px rgba(0,0,0,0.12)

## 🧩 Componentes

### Botões

#### Primary
- **Background**: `#1F3A93`
- **Cor do Texto**: `#FFFFFF`
- **Borda Arredondada**: 8px
- **Altura**: 40px
- **Tamanho da Fonte**: 16px
- **Peso da Fonte**: Medium

#### Secondary
- **Background**: `#FFB400`
- **Cor do Texto**: `#111111`
- **Borda Arredondada**: 8px
- **Altura**: 40px
- **Tamanho da Fonte**: 16px
- **Peso da Fonte**: Medium

#### Outline
- **Background**: Transparente
- **Borda**: 1px solid `#1F3A93`
- **Cor do Texto**: `#1F3A93`
- **Borda Arredondada**: 8px
- **Altura**: 40px
- **Tamanho da Fonte**: 16px
- **Peso da Fonte**: Medium

#### Ghost
- **Background**: Transparente
- **Cor do Texto**: `#1F3A93`
- **Borda Arredondada**: 8px
- **Altura**: 40px
- **Tamanho da Fonte**: 16px
- **Peso da Fonte**: Medium

#### Tamanhos
- **Small**: Altura 36px, Padding 12px 16px
- **Medium**: Altura 40px, Padding 16px 24px
- **Large**: Altura 44px, Padding 24px 32px

### Inputs
- **Background**: `#FFFFFF`
- **Borda**: 1px solid `#DDDDDD`
- **Borda Arredondada**: 8px
- **Padding**: 12px 16px
- **Tamanho da Fonte**: 16px
- **Cor do Texto**: `#333333`
- **Cor do Placeholder**: `#999999`

### Badges
- **Background**: `#1F3A93`
- **Cor do Texto**: `#FFFFFF`
- **Borda Arredondada**: 50px
- **Padding**: 4px 12px
- **Tamanho da Fonte**: 12px
- **Peso da Fonte**: Bold

#### Variantes de Badges
- **Default**: `#1F3A93` background, `#FFFFFF` texto
- **Secondary**: `#FFB400` background, `#111111` texto
- **Destructive**: `#D32F2F` background, `#FFFFFF` texto
- **Outline**: Transparente background, `#333333` texto, 1px solid border

### Cards
- **Background**: `#FFFFFF`
- **Borda Arredondada**: 16px
- **Sombra**: 0px 2px 8px rgba(0,0,0,0.08)
- **Padding**: 24px

### Tabelas
- **Background**: `#FFFFFF`
- **Borda**: 1px solid `#EEEEEE`
- **Cabeçalho**: `#F5F5F5` background
- **Texto do Cabeçalho**: `#666666`, 14px, Medium
- **Texto das Células**: `#333333`, 14px, Regular
- **Altura das Linhas**: 48px

### Alertas
- **Borda Arredondada**: 8px
- **Padding**: 16px
- **Margem**: 0 0 16px 0

#### Variantes de Alertas
- **Default**: `#E3F2FD` background, `#1976D2` texto
- **Success**: `#E8F5E9` background, `#388E3C` texto
- **Warning**: `#FFF8E1` background, `#FFA000` texto
- **Error**: `#FFEBEE` background, `#D32F2F` texto

### Modals
- **Background**: `#FFFFFF`
- **Borda Arredondada**: 24px
- **Padding**: 24px
- **Sombra**: 0px 8px 24px rgba(0,0,0,0.15)

## 📱 Navegação

### Mobile (Bottom Navbar)
- **Tipo**: Bottom Navbar
- **Altura**: 72px
- **Background**: `#FFFFFF`
- **Cor do Item Ativo**: `#1F3A93`
- **Cor do Item Inativo**: `#333333`
- **Tamanho dos Ícones**: 24px
- **Itens**: Início, Pedidos, Carteira, Perfil

### Web (Sidebar)
- **Tipo**: Sidebar
- **Largura**: 260px
- **Background**: `#FFFFFF`
- **Cor do Item Ativo**: `#1F3A93`
- **Cor do Item Inativo**: `#333333`
- **Tamanho dos Ícones**: 24px
- **Itens**: Dashboard, Pedidos, Carteira, Fornecedores, Entregadores, Configurações

## 📁 Estrutura de Assets

```
assets/
├── icons/          # Ícones da aplicação (SVG, PNG)
├── images/         # Imagens e ilustrações (JPG, PNG)
├── fonts/          # Fontes customizadas (OTF, TTF)
└── README.md       # Documentação dos assets
```

## 📱 Breakpoints

- **Mobile**: até 768px
- **Tablet**: 769px - 1024px
- **Desktop**: 1025px - 1440px
- **Large Desktop**: acima de 1440px

## 🎯 Diretrizes de Uso

1. **Consistência**: Manter consistência em todos os componentes e estilos
2. **Acessibilidade**: Garantir contraste adequado e tamanhos de fonte legíveis
3. **Responsividade**: Todos os componentes devem ser responsivos
4. **Performance**: Otimizar assets para carregamento rápido
5. **Manutenção**: Facilitar a atualização e manutenção do design system