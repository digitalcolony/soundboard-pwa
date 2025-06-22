# Neil Rogers Soundboard PWA

A Progressive Web App (PWA) version of the Neil Rogers Soundboard that works offline and can be installed as a standalone app.

## Features

- 🔊 **Offline-capable**: All sounds are cached for offline use
- 📱 **Installable**: Can be installed as a standalone app on mobile and desktop
- 🔄 **Auto-updating**: Automatically checks for new sounds when online
- 🎵 **Full soundboard**: Includes all drops from Neil Rogers, Jennifer Rehm, Jim Mandich, Larry King, and more
- 🔍 **Search functionality**: Search sounds by name or artist
- 📋 **Multiple actions**: Play, download, or copy links to clipboard
- ⌨️ **Keyboard shortcuts**: Press 'S' to focus search box

## Installation

### For Users

1. Open the PWA in your browser
2. Look for the "Install" button in your browser's address bar or menu
3. Click "Install" to add it to your home screen/desktop

### For Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. (Optional) If you have your own sound files, place them in `public/sounds/` and generate the metadata:

   ```bash
   npm run generate-sounds
   ```

3. (Optional) Customize the soundboard by editing `public/config.json`:

   ```bash
   # Copy the example config
   cp config.example.json public/config.json
   # Edit the configuration file
   nano public/config.json
   ```

4. Start development server:

   ```bash
   npm run dev
   ```

5. Build for production:

   ```bash
   npm run build
   ```

6. Preview production build:
   ```bash
   npm run preview
   ```

## Configuration

The soundboard can be customized by editing the `public/config.json` file. This allows you to create a soundboard for any purpose without modifying the source code.

### Configuration Options

```json
{
	"title": "Your Soundboard Name",
	"shortName": "Short Name",
	"subtitle": "YOUR WEBSITE OR BRAND",
	"description": "Description for search engines and app stores",
	"headerTitle": "♫ YOUR SOUNDBOARD ♫",
	"searchPlaceholder": "SEARCH FOR SOUNDS...",
	"tipText": "↑ PRESS [S] TO SEARCH • CLICK TO PLAY ↑",
	"loadingText": "LOADING SOUNDS...",
	"offlineText": "OFFLINE MODE - USING CACHED SOUNDS",
	"soundCountText": "AUDIO DROPS",
	"themeColor": "#1a1a1a",
	"backgroundColor": "#1a1a1a"
}
```

### What gets updated:

- **Page title** and meta description for SEO
- **PWA manifest** (app name, description, colors)
- **All UI text** throughout the application
- **Theme colors** for the app and browser chrome

Simply edit the config file and refresh the page to see your changes!

## Creating Your Own Soundboard

This PWA is designed to be easily customizable for any type of soundboard. Here's how to create your own:

### Step 1: Prepare Your Audio Files

1. Place your MP3 files in the `public/sounds/` directory
2. Use descriptive filenames (they'll be converted to display names)
3. Supported format: MP3 (for best browser compatibility)

### Step 2: Generate Metadata

Run the generator to create the sounds database:

```bash
npm run generate-sounds
```

This will:

- Scan all MP3 files in `public/sounds/`
- Generate `public/api/sounds.json` with metadata
- Create proper display names from filenames

### Step 3: Customize the Branding

1. Copy the example config: `cp config.example.json public/config.json`
2. Edit `public/config.json` with your details:
   - Change the title, subtitle, and description
   - Update colors to match your brand
   - Customize all UI text

### Step 4: Replace Icons (Optional)

Replace the icons in `public/icons/` with your own:

- Use the same filenames and sizes
- Recommended: 512x512 source image, scale down for other sizes
- PNG format with transparent background

### Step 5: Deploy

The app works on any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## How It Works

### Offline Functionality

The PWA uses a service worker to cache:

- Core app files (HTML, CSS, JS)
- Soundboard data (JSON)
- Audio files (MP3s)

When you visit the PWA:

1. Core files are cached immediately
2. Soundboard data is fetched and cached
3. Audio files are cached on-demand as you use them
4. Everything works offline after initial caching

### Updates

The PWA automatically checks for updates when online:

- New sounds are detected and cached automatically
- App updates trigger a notification to refresh
- Background sync keeps the soundboard current

### Performance

- Sounds are cached on first play
- Search and filtering happen client-side for speed
- Lazy loading and efficient caching strategies
- Minimal data usage when online

## Technical Details

- **Framework**: Vanilla JavaScript (no framework dependencies)
- **Build Tool**: Vite
- **Service Worker**: Custom implementation with Workbox strategies
- **Storage**: Cache API for files, localStorage for data
- **Icons**: Progressive Web App manifest with multiple icon sizes

## Browser Support

Works in all modern browsers that support:

- Service Workers
- Cache API
- ES6+ JavaScript
- Web App Manifest

## File Structure

```
soundboard-pwa/
├── index.html          # Main app HTML
├── main.js            # App logic and functionality
├── sw.js              # Service worker for offline support
├── manifest.json      # PWA manifest
├── package.json       # Dependencies and scripts
├── vite.config.js     # Build configuration
└── public/
    ├── api/
    │   └── sounds.json # Soundboard data
    ├── icons/         # PWA icons
    └── sounds/        # Audio files
```

## Deployment

The PWA can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- Any CDN or web server

Make sure to:

1. Serve over HTTPS (required for PWA features)
2. Set proper cache headers for audio files
3. Enable compression for better performance

## License

Same as the main Neil Rogers site.
