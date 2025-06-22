# PWA Soundboard

A Progressive Web App (PWA) soundboard that works offline and can be installed as a standalone app.

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

### Step 1: Update ID3 Tags (Recommended)

For the best user experience, update the ID3 tags in your MP3 files before adding them to the soundboard. The generator will read these tags to create proper metadata.

#### What are ID3 Tags?

ID3 tags are metadata embedded in MP3 files that contain information like:

- **Title**: The display name for the sound
- **Artist**: Who said/created the sound

#### Tools for Editing ID3 Tags

**Free Options:**

- **Mp3tag** (Windows/Mac) - https://www.mp3tag.de/en/
- **Kid3** (Windows/Mac/Linux) - https://kid3.kde.org/
- **MusicBrainz Picard** (Windows/Mac/Linux) - https://picard.musicbrainz.org/

**Online Tools:**

- **Audio Trimmer ID3 Editor** - https://audiotrimmer.com/online-mp3-editor/
- **MP3 Tag Editor Online** - Various free online options

#### Quick Guide with Mp3tag:

1. **Download and install Mp3tag** from https://www.mp3tag.de/en/
2. **Open Mp3tag** and select your MP3 files folder
3. **Select the files** you want to edit (Ctrl+A for all)
4. **Edit the fields** in the panel below:
   - **Title**: Enter the sound's display name (e.g., "Hello there!")
   - **Artist**: Enter who said it (e.g., "Neil Rogers", "Jennifer Rehm")
   - **Album**: Optional (could be your soundboard name)
5. **Save changes** with Ctrl+S

#### Batch Editing Tips:

- **Select multiple files** to edit the Artist field for all sounds from the same person
- **Use consistent naming** for artists to group sounds properly
- **Keep titles short and descriptive** for better mobile display
- **Remove unwanted tags** (like track numbers) that aren't needed

#### Example ID3 Setup:

```
Filename: Neil-Rogers-Hello-There.mp3
Title: Hello There!
Artist: Neil Rogers
```

If you skip this step, the generator will use filenames as titles and "Unknown" as the artist.

### Step 2: Prepare Your Audio Files

1. Place your MP3 files in the `public/sounds/` directory
2. Use descriptive filenames (they'll be converted to display names)
3. Supported format: MP3 (for best browser compatibility)

### Step 3: Generate Metadata

Run the generator to create the sounds database:

```bash
npm run generate-sounds
```

This will:

- Scan all MP3 files in `public/sounds/`
- Generate `public/api/sounds.json` with metadata
- Create proper display names from filenames

### Step 4: Customize the Branding

1. Copy the example config: `cp config.example.json public/config.json`
2. Edit `public/config.json` with your details:
   - Change the title, subtitle, and description
   - Update colors to match your brand
   - Customize all UI text

### Step 5: Replace Icons (Optional)

The soundboard comes with generic retro-themed icons that match the 8-bit aesthetic. To customize:

#### Option 1: Use the Built-in Icon Generator

```bash
npm run generate-icons
```

This opens `icon-generator.html` in your browser where you can:

- Preview all icon sizes
- Download PNG files with correct names
- Customize colors by editing the HTML/Canvas code

#### Option 2: Create Your Own Icons

Replace the icons in `public/icons/` with your own:

- Use the same filenames and sizes (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512)
- PNG format recommended for best compatibility
- Start with a 512x512 source image, scale down for other sizes
- Include `apple-touch-icon.png` (180x180) for iOS

#### Option 3: Edit the Source SVG

Modify `icon-source.svg` and regenerate:

- Edit colors, shapes, or design elements
- Use the generation scripts (`generate-icons.sh` or `generate-icons.bat`)
- Requires ImageMagick or online conversion tools

### Step 6: Deploy

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
