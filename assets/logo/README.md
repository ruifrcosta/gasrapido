# Logo Assets Documentation

## Overview
This directory contains all logo variants for GasRápido, organized by type and format.

## Logo Variants

### Wordmark Logos
Located in: `assets/logo/wordmark/`

1. **logo-wordmark-full.svg**
   - Full wordmark logo with both "Gas" and "Rápido"
   - Usage: Header desktop, landing page, official documents, marketing banners
   - Dimensions: 300x60px

2. **logo-wordmark-mini.svg**
   - Compact version of the wordmark
   - Usage: Mobile navigation, condensed spaces
   - Dimensions: 200x40px

### Symbol Logos
Located in: `assets/logo/symbol/`

1. **logo-symbol.svg**
   - Icon-only representation of the brand
   - Usage: Favicon, app icon, mobile nav icon, map marker, sidebar collapsed
   - Dimensions: 60x60px

## Color Scheme
- Primary Color: #FFB400 (Orange)
- Text Colors: #FFFFFF (White) or #111111 (Black) depending on background
- Backgrounds: #FFFFFF, #000000, #FFB400, #F8F8F8

## Technical Specifications

### SVG Requirements
- All SVGs include proper viewBox and preserveAspectRatio attributes
- Accessibility features (title, desc, aria-labelledby)
- Optimized with SVGO
- File size targets:
  - Symbol: < 20KB
  - Wordmark: < 60KB

### Responsive Behavior
- Max width 320px: Use symbol only
- Max width 768px: Use wordmark mini
- Min width 769px: Use wordmark full

## Integration Guidelines

### CSS Classes
- `.logo-symbol` for symbol logos
- `.logo-wordmark` for wordmark logos

### Fallback Handling
- If SVG is not supported, use PNG fallbacks
- If fonts don't load, use system font fallback
- If JS disables dynamic variant, show static default

## Maintenance
When updating logos:
1. Follow this guide to generate new variants
2. Update file hashes for cache invalidation
3. Test across all supported browsers and devices