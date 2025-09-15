# Assets do GasRápido - Web

Este diretório contém todos os assets estáticos utilizados no dashboard web do GasRápido.

## Estrutura de Diretórios

```
assets/
├── icons/          # Ícones da aplicação (SVG, PNG)
├── images/         # Imagens e ilustrações (JPG, PNG)
├── fonts/          # Fontes customizadas (OTF, TTF)
└── README.md       # Este arquivo
```

## Convenções de Nomenclatura

- **Ícones**: `nome-funcionalidade-tamanho-cor.png` (ex: `home-24-primary.png`)
- **Imagens**: `nome-descritivo-tamanho.png` (ex: `banner-promocao-large.png`)
- **Fontes**: `NomeDaFonte-Estilo.ttf` (ex: `Inter-Regular.ttf`)

## Tamanhos Padrão

### Ícones
- Pequeno: 16x16px
- Médio: 24x24px
- Grande: 32x32px
- Extra Grande: 48x48px

### Imagens
- Miniatura: 100x100px
- Pequena: 200x200px
- Média: 400x400px
- Grande: 800x800px

## Formatos Suportados

- **Ícones**: SVG (preferencial), PNG
- **Imagens**: PNG (com transparência), JPG (fotos)
- **Fontes**: OTF, TTF

## Uso nos Componentes

```typescript
// Importando um ícone
import HomeIcon from '../public/assets/icons/home-24-primary.png';

// Importando uma imagem
import BannerImage from '../public/assets/images/banner-promocao-large.png';
```

## Otimização

- Todos os assets devem ser otimizados para web
- Ícones devem ser fornecidos em diferentes densidades (1x, 2x)
- Imagens devem ser comprimidas sem perda significativa de qualidade