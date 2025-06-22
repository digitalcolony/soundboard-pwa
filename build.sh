#!/bin/bash

# Build script for Neil Rogers Soundboard PWA
# This script syncs data from the main site and builds the PWA

echo "🔊 Building Neil Rogers Soundboard PWA..."

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAIN_SITE_DIR="$(dirname "$SCRIPT_DIR")"

echo "📁 Script directory: $SCRIPT_DIR"
echo "📁 Main site directory: $MAIN_SITE_DIR"

# Sync soundboard data
echo "📊 Syncing soundboard data..."
cp "$MAIN_SITE_DIR/src/data/soundboard.json" "$SCRIPT_DIR/public/api/sounds.json"

# Sync sounds directory (create symlink if possible, copy if not)
echo "🎵 Syncing sounds directory..."
if [ -d "$SCRIPT_DIR/public/sounds" ]; then
    rm -rf "$SCRIPT_DIR/public/sounds"
fi

# Try to create symlink first (works on Unix-like systems)
if ln -s "$MAIN_SITE_DIR/public/sounds" "$SCRIPT_DIR/public/sounds" 2>/dev/null; then
    echo "✅ Created symlink to sounds directory"
else
    # Fallback to copying
    echo "📂 Copying sounds directory..."
    cp -r "$MAIN_SITE_DIR/public/sounds" "$SCRIPT_DIR/public/sounds"
    echo "✅ Copied sounds directory"
fi

# Sync icons
echo "🎨 Syncing icons..."
mkdir -p "$SCRIPT_DIR/public/icons"

# Copy icons with fallbacks
declare -A icon_map=(
    ["icon-72x72.png"]="mstile-70x70.png"
    ["icon-96x96.png"]="favicon-96x96.png"
    ["icon-128x128.png"]="favicon-128.png"
    ["icon-144x144.png"]="mstile-144x144.png"
    ["icon-152x152.png"]="apple-touch-icon-152x152.png"
    ["icon-192x192.png"]="android-chrome-192x192.png"
    ["icon-384x384.png"]="android-chrome-192x192.png"  # Use 192 as fallback
    ["icon-512x512.png"]="android-chrome-512x512.png"
)

for target in "${!icon_map[@]}"; do
    source="${icon_map[$target]}"
    if [ -f "$MAIN_SITE_DIR/public/$source" ]; then
        cp "$MAIN_SITE_DIR/public/$source" "$SCRIPT_DIR/public/icons/$target"
        echo "✅ Copied $source -> $target"
    else
        echo "⚠️  Warning: $source not found, skipping $target"
    fi
done

# Copy favicon
if [ -f "$MAIN_SITE_DIR/public/favicon.svg" ]; then
    cp "$MAIN_SITE_DIR/public/favicon.svg" "$SCRIPT_DIR/public/favicon.svg"
    echo "✅ Copied favicon.svg"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd "$SCRIPT_DIR"
    npm install
fi

# Build the PWA
echo "🔨 Building PWA..."
cd "$SCRIPT_DIR"
npm run build

echo "✅ PWA build complete!"
echo "🚀 Run 'npm run preview' to test the built PWA"
echo "📱 The PWA is ready for deployment from the 'dist' directory"
