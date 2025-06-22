@echo off
echo 🎵 Generating PWA icons for Soundboard...

REM Check if ImageMagick is available
where convert >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ImageMagick not found. Please install ImageMagick to generate PNG icons.
    echo    Download from https://imagemagick.org/script/download.php#windows
    echo.
    echo Alternative: Use an online SVG to PNG converter:
    echo 1. Go to https://cloudconvert.com/svg-to-png
    echo 2. Upload icon-source.svg
    echo 3. Convert to PNG at different sizes
    pause
    exit /b 1
)

REM Generate icons
echo 📱 Generating 72x72 icon...
convert icon-source.svg -resize 72x72 public\icons\icon-72x72.png

echo 📱 Generating 96x96 icon...
convert icon-source.svg -resize 96x96 public\icons\icon-96x96.png

echo 📱 Generating 128x128 icon...
convert icon-source.svg -resize 128x128 public\icons\icon-128x128.png

echo 📱 Generating 144x144 icon...
convert icon-source.svg -resize 144x144 public\icons\icon-144x144.png

echo 📱 Generating 152x152 icon...
convert icon-source.svg -resize 152x152 public\icons\icon-152x152.png

echo 📱 Generating 192x192 icon...
convert icon-source.svg -resize 192x192 public\icons\icon-192x192.png

echo 📱 Generating 384x384 icon...
convert icon-source.svg -resize 384x384 public\icons\icon-384x384.png

echo 📱 Generating 512x512 icon...
convert icon-source.svg -resize 512x512 public\icons\icon-512x512.png

echo 🍎 Generating Apple touch icon...
convert icon-source.svg -resize 180x180 public\apple-touch-icon.png

echo ✅ Icon generation complete!
echo.
echo Generated icons:
echo   • public\icons\icon-72x72.png
echo   • public\icons\icon-96x96.png
echo   • public\icons\icon-128x128.png
echo   • public\icons\icon-144x144.png
echo   • public\icons\icon-152x152.png
echo   • public\icons\icon-192x192.png
echo   • public\icons\icon-384x384.png
echo   • public\icons\icon-512x512.png
echo   • public\apple-touch-icon.png
pause
