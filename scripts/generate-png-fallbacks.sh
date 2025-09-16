#!/bin/bash

# Script to generate PNG fallbacks for GasRápido logos
# This script assumes you have ImageMagick installed

echo "Generating PNG fallbacks for GasRápido logos..."

# Create directories for PNG fallbacks
mkdir -p ../assets/logo/png/wordmark
mkdir -p ../assets/logo/png/symbol

# Generate PNG fallbacks for wordmark logos
echo "Generating wordmark PNGs..."

# Full wordmark
convert -background none ../assets/logo/wordmark/logo-wordmark-full.svg -resize 300x60 ../assets/logo/png/wordmark/logo-wordmark-full@1x.png
convert -background none ../assets/logo/wordmark/logo-wordmark-full.svg -resize 600x120 ../assets/logo/png/wordmark/logo-wordmark-full@2x.png
convert -background none ../assets/logo/wordmark/logo-wordmark-full.svg -resize 900x180 ../assets/logo/png/wordmark/logo-wordmark-full@3x.png

# Mini wordmark
convert -background none ../assets/logo/wordmark/logo-wordmark-mini.svg -resize 200x40 ../assets/logo/png/wordmark/logo-wordmark-mini@1x.png
convert -background none ../assets/logo/wordmark/logo-wordmark-mini.svg -resize 400x80 ../assets/logo/png/wordmark/logo-wordmark-mini@2x.png
convert -background none ../assets/logo/wordmark/logo-wordmark-mini.svg -resize 600x120 ../assets/logo/png/wordmark/logo-wordmark-mini@3x.png

# Generate PNG fallbacks for symbol logos
echo "Generating symbol PNGs..."

convert -background none ../assets/logo/symbol/logo-symbol.svg -resize 60x60 ../assets/logo/png/symbol/logo-symbol@1x.png
convert -background none ../assets/logo/symbol/logo-symbol.svg -resize 120x120 ../assets/logo/png/symbol/logo-symbol@2x.png
convert -background none ../assets/logo/symbol/logo-symbol.svg -resize 180x180 ../assets/logo/png/symbol/logo-symbol@3x.png

# Generate favicon sizes
echo "Generating favicon PNGs..."
mkdir -p ../assets/icons/favicon

convert -background none ../assets/logo/symbol/logo-symbol.svg -resize 16x16 ../assets/icons/favicon/favicon-16x16.png
convert -background none ../assets/logo/symbol/logo-symbol.svg -resize 32x32 ../assets/icons/favicon/favicon-32x32.png
convert -background none ../assets/logo/symbol/logo-symbol.svg -resize 48x48 ../assets/icons/favicon/favicon-48x48.png

# Generate app launcher icons
echo "Generating app launcher PNGs..."
mkdir -p ../assets/icons/app-launcher

convert -background none ../assets/logo/symbol/logo-symbol.svg -resize 180x180 ../assets/icons/app-launcher/app-icon-180x180.png
convert -background none ../assets/logo/symbol/logo-symbol.svg -resize 192x192 ../assets/icons/app-launcher/app-icon-192x192.png
convert -background none ../assets/logo/symbol/logo-symbol.svg -resize 512x512 ../assets/icons/app-launcher/app-icon-512x512.png

echo "PNG fallback generation complete!"
echo "Generated files are in:"
echo "- assets/logo/png/wordmark/"
echo "- assets/logo/png/symbol/"
echo "- assets/icons/favicon/"
echo "- assets/icons/app-launcher/"