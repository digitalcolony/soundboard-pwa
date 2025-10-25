# PWA Soundboard

A fully generic, configurable Progressive Web App (PWA) soundboard that works offline and can be installed as a standalone app. **This project is open source and free for everyone to use, modify, and customize for any purpose.**

## 🎯 Open Source & Free to Use

This soundboard is designed to be **completely generic and easily customizable** for any use case:

- ✅ **Free to use** for personal, commercial, or any other purpose
- ✅ **Easy to customize** with JSON configuration files
- ✅ **No hardcoded content** - bring your own audio files and branding
- ✅ **MIT Licensed** - modify, distribute, and use however you want

**Perfect for**: Podcast soundboards, radio show drops, gaming sounds, meme collections, educational audio, language learning, accessibility tools, or any audio collection you want to make easily accessible.

## Features

- 🔊 **Offline-capable**: All sounds are cached for offline use
- 📱 **Installable**: Can be installed as a standalone app on mobile and desktop
- 🔄 **Auto-updating**: Automatically checks for new sounds when online
- 🎵 **Fully configurable**: No hardcoded content - completely customizable via JSON
- 🔍 **Search functionality**: Search sounds by name or artist
- ⌨️ **Keyboard shortcuts**: Press 'S' to focus search box
- 🎨 **Easy theming**: Custom colors, text, and branding via config file
- 🔧 **Automatic metadata**: Generates sound data from MP3 ID3 tags

## Tech Stack

- Vite 7 for fast dev server, optimized builds, and PWA asset bundling
- Vanilla JavaScript (ES modules) for the client-side soundboard logic
- Workbox 7 libraries to power service worker caching strategies
- Web App Manifest and service worker APIs for installability/offline UX
- Node.js scripts (`sync-data.js`, `generate-sounds.js`) to prepare content at build time
- npm for dependency management and project automation scripts

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

3. (Optional) Customize the soundboard by editing the config files:

   ```bash
   # Copy the example config
   cp config.example.json public/config.json
   # Edit the configuration file for UI/branding
   nano public/config.json
   # Edit the PWA manifest for app name/installation details
   nano public/manifest.json
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
- **PWA manifest** (app name, description, colors) - _Note: The manifest requires separate editing_
- **All UI text** throughout the application
- **Theme colors** for the app and browser chrome

**Important:** The `public/config.json` file controls the UI and branding, but you'll also need to update `public/manifest.json` separately to customize the PWA installation name and app store details.

Simply edit both config files and refresh the page to see your changes!

## Creating Your Own Soundboard

This PWA is **designed from the ground up** to be easily customizable for any type of soundboard. **No programming knowledge required** - just edit a few files and you're ready to go!

### Why Use This Soundboard?

- 🚀 **Zero dependencies on external services** - runs completely offline
- 📦 **One-time setup** - configure once, works everywhere
- 🎯 **Production-ready** - used by real websites and apps
- 🔒 **Privacy-focused** - no tracking, no data collection
- 💰 **Completely free** - no licenses, subscriptions, or hidden costs
- 🌍 **Works anywhere** - any web server, any domain, any device

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

1. **Update the main config**: Copy the example config: `cp config.example.json public/config.json`
2. **Edit `public/config.json`** with your details:

   - Change the title, subtitle, and description
   - Update colors to match your brand
   - Customize all UI text

3. **Update the PWA manifest** in `public/manifest.json`:

   ```json
   {
   	"name": "Your Soundboard Name",
   	"short_name": "Your App",
   	"description": "Your custom soundboard description",
   	"background_color": "#your-color",
   	"theme_color": "#your-color"
   }
   ```

   **Important manifest fields to customize:**

   - `name`: Full app name (appears in app stores and installation prompts)
   - `short_name`: Shorter name (appears on home screen/desktop)
   - `description`: Brief description of your soundboard
   - `background_color`: Background color for splash screen
   - `theme_color`: Browser chrome color on mobile devices
   - `categories`: Update to match your content (e.g., "education", "games", "productivity")

4. **Update social media sharing meta tags** in `index.html`:

   Replace these placeholders with your actual information:

   ```html
   <!-- Update these URLs to your actual domain -->
   <meta property="og:url" content="https://yoursite.com/" />
   <meta property="twitter:url" content="https://yoursite.com/" />

   <!-- Update titles and descriptions -->
   <meta property="og:title" content="Your Soundboard Name" />
   <meta property="twitter:title" content="Your Soundboard Name" />
   <meta property="og:description" content="Your custom description" />
   <meta property="twitter:description" content="Your custom description" />

   <!-- Update image URLs (use full URLs for social media) -->
   <meta property="og:image" content="https://yoursite.com/icons/icon-512x512.png" />
   <meta property="twitter:image" content="https://yoursite.com/icons/icon-512x512.png" />

   <!-- Update site/brand name -->
   <meta property="og:site_name" content="Your Soundboard" />
   ```

   **Why this matters:** These tags control how your soundboard appears when shared on Facebook, Twitter, LinkedIn, Discord, and other social platforms.

5. **Update footer links** in `index.html`:

   Replace the GitHub repository URLs with your own:

   ```html
   <!-- Update these GitHub links to point to your repository -->
   <a href="https://github.com/your-username/your-soundboard" class="footer-link">
   	📂 SOURCE CODE
   </a>
   <a href="https://github.com/your-username/your-soundboard#readme" class="footer-link">
   	📖 DOCUMENTATION
   </a>
   <a href="https://github.com/your-username/your-soundboard/issues" class="footer-link">
   	🐛 REPORT ISSUE
   </a>
   ```

   Or customize the footer content entirely to match your branding and remove the open source references if desired.

### Step 6: Replace Icons (Optional)

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

### Step 7: Deploy

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

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**You are free to:**

- ✅ Use this project for any purpose (personal, commercial, educational, etc.)
- ✅ Modify and customize it however you want
- ✅ Distribute your modified versions
- ✅ Include it in other projects
- ✅ Sell products based on this code

**The only requirement** is to include the original MIT license notice in any copies or substantial portions of the software.
