# Deployment Guide for Neil Rogers Soundboard PWA

## Quick Start

1. **Build the PWA:**

   ```bash
   cd soundboard-pwa
   npm install
   npm run build
   ```

2. **Deploy the `dist` folder** to any static hosting service

3. **Ensure HTTPS** - PWAs require HTTPS to work properly

## Hosting Options

### Netlify (Recommended)

1. Connect your repository to Netlify
2. Set build directory to `soundboard-pwa/dist`
3. Deploy automatically on push

### Vercel

1. Import project in Vercel
2. Set root directory to `soundboard-pwa`
3. Build command: `npm run build`
4. Output directory: `dist`

### GitHub Pages

1. Build locally: `npm run build`
2. Push `dist` contents to `gh-pages` branch
3. Enable GitHub Pages on the branch

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Set public directory to `dist`
4. Deploy: `firebase deploy`

### Apache/Nginx

Copy the `dist` folder contents to your web server root.

**Apache .htaccess example:**

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE audio/mpeg
</IfModule>

# Cache audio files for 1 year
<FilesMatch "\.(mp3|wav|ogg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>

# Cache other assets for 1 month
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**Nginx example:**

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json audio/mpeg;

    # Cache headers
    location ~* \.(mp3|wav|ogg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1M;
        add_header Cache-Control "public";
    }

    # Serve PWA
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

## Performance Optimization

### Audio File Optimization

The PWA caches audio files on-demand. To optimize:

1. Ensure audio files are compressed efficiently
2. Use appropriate bitrates (128kbps recommended for voice)
3. Consider using modern formats (WebM) with MP3 fallbacks

### CDN Setup

For better global performance:

1. Use a CDN for audio files
2. Update paths in `sounds.json` to CDN URLs
3. Configure proper CORS headers

### Build Optimization

The build process automatically:

- Minifies JavaScript and CSS
- Optimizes images
- Generates service worker
- Creates Web App Manifest

## Monitoring

### PWA Analytics

Track PWA usage with:

```javascript
// Add to main.js
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.ready.then((registration) => {
		// Track install events
		registration.addEventListener("updatefound", () => {
			// Analytics: PWA update available
		});
	});
}

// Track install prompt
window.addEventListener("beforeinstallprompt", (e) => {
	// Analytics: PWA install prompt shown
});
```

### Performance Monitoring

Monitor key metrics:

- Time to first contentful paint
- Audio loading times
- Cache hit rates
- Offline usage

## Updating Content

### Adding New Sounds

1. Add audio files to the main site's `public/sounds/` directory
2. Update `src/data/soundboard.json` in the main site
3. Run the sync script: `./build.sh` or `build.bat`
4. Deploy the updated PWA

### Automatic Updates

The PWA automatically:

- Checks for new sounds when online
- Caches new audio files in the background
- Shows update notifications to users

## Troubleshooting

### Common Issues

**PWA not installing:**

- Ensure HTTPS is enabled
- Check Web App Manifest is valid
- Verify service worker is registered

**Audio not playing:**

- Check CORS headers on audio files
- Ensure files are accessible
- Test audio file URLs directly

**Offline not working:**

- Verify service worker registration
- Check browser developer tools → Application → Storage
- Clear cache and reload

**Icons not showing:**

- Verify icon files exist and are accessible
- Check manifest.json icon paths
- Use proper icon sizes and formats

### Browser DevTools

Test PWA features:

1. Open DevTools → Application
2. Check Manifest, Service Workers, Storage
3. Use Network tab to test offline functionality
4. Use Lighthouse audit for PWA best practices

## Browser Support

### Minimum Requirements

- Chrome 40+
- Firefox 44+
- Safari 11.1+
- Edge 17+

### Feature Support

- **Service Workers**: All modern browsers
- **Web App Manifest**: All modern browsers
- **Cache API**: All modern browsers
- **Background Sync**: Chrome, Edge (others gracefully degrade)

## Security Considerations

### Content Security Policy

Add CSP headers for security:

```html
<meta
	http-equiv="Content-Security-Policy"
	content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    media-src 'self' data:;
    img-src 'self' data:;
    connect-src 'self';
"
/>
```

### HTTPS Only

PWAs require HTTPS. Ensure:

- Valid SSL certificate
- Redirect HTTP to HTTPS
- Use HSTS headers

## License and Legal

Ensure compliance with:

- Audio content licensing
- Neil Rogers estate permissions
- Third-party content rights
- Local privacy laws (GDPR, CCPA)
