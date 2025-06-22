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

2. Start development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

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
