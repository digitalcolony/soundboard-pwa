#!/bin/bash

# Icon Generation Script for Soundboard PWA
# This script generates PNG icons from the SVG source

echo "🎵 Generating PWA icons for Soundboard..."

# Check if ImageMagick is available
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Please install ImageMagick to generate PNG icons."
    echo "   On Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "   On macOS: brew install imagemagick"
    echo "   On Windows: Download from https://imagemagick.org/script/download.php#windows"
    echo ""
    echo "Alternative: Use an online SVG to PNG converter:"
    echo "1. Go to https://cloudconvert.com/svg-to-png"
    echo "2. Upload icon-source.svg"
    echo "3. Convert to PNG at different sizes"
    exit 1
fi

# Array of icon sizes needed for PWA
sizes=(72 96 128 144 152 192 384 512)

# Generate icons
for size in "${sizes[@]}"; do
    echo "📱 Generating ${size}x${size} icon..."
    convert icon-source.svg -resize ${size}x${size} public/icons/icon-${size}x${size}.png
done

# Generate apple-touch-icon (180x180)
echo "🍎 Generating Apple touch icon..."
convert icon-source.svg -resize 180x180 public/apple-touch-icon.png

echo "✅ Icon generation complete!"
echo ""
echo "Generated icons:"
for size in "${sizes[@]}"; do
    echo "  • public/icons/icon-${size}x${size}.png"
done
echo "  • public/apple-touch-icon.png"
