# Soundboard PWA Icons

This directory contains the custom icons for the Soundboard PWA, designed to match the retro 8-bit aesthetic.

## Icon Theme

The icons feature:

- **Retro 8-bit soundboard design** with a 3x4 grid of colorful buttons
- **Pastel color palette** matching the app's theme:
  - Pink (#ffb3d9), Purple (#d9b3ff), Blue (#b3d9ff), Cyan (#b3ffff)
  - Green (#b3ffb3), Yellow (#ffffb3), Orange (#ffdb7d), Coral (#ffb3b3)
- **Dark background** (#2a1b3d) for contrast
- **Speaker symbol** in the top corner to indicate audio functionality
- **Sound wave effects** and equalizer bars for visual appeal

## Files

- `icon-72x72.png` - Android Chrome, Opera Mini
- `icon-96x96.png` - Android Chrome
- `icon-128x128.png` - Chrome Web Store, Android
- `icon-144x144.png` - IE11 Metro tile
- `icon-152x152.png` - iPad touch icon
- `icon-192x192.png` - Android Chrome, PWA install
- `icon-384x384.png` - Android splash screen
- `icon-512x512.png` - PWA install, Android splash screen

## Generation

To regenerate icons from the source SVG:

### Linux/macOS:

```bash
chmod +x generate-icons.sh
./generate-icons.sh
```

### Windows:

```cmd
generate-icons.bat
```

### Manual/Online:

1. Use the `icon-source.svg` file as your base
2. Convert to PNG at the required sizes using:
   - ImageMagick: `convert icon-source.svg -resize 192x192 icon-192x192.png`
   - Online tools: https://cloudconvert.com/svg-to-png
   - Design software: Adobe Illustrator, Inkscape, Figma, etc.

## Design Notes

The soundboard icon design represents:

- A classic hardware soundboard/mixing console
- Colorful buttons that users can press to play sounds
- Audio equipment aesthetic with speaker and sound waves
- Retro gaming/8-bit style to match the app's theme
- High contrast for visibility on various backgrounds
