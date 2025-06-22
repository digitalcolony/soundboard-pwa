// Service Worker for Neil Rogers Soundboard PWA
const CACHE_NAME = "neil-rogers-soundboard-v2";
const SOUNDS_CACHE = "neil-rogers-sounds-v2";
const API_CACHE = "neil-rogers-api-v2";

// Core app files to cache immediately
const CORE_FILES = [
	"/",
	"/index.html",
	"/main.js",
	"/manifest.json",
	"/icons/icon-192x192.png",
	"/icons/icon-512x512.png",
];

// Install event - cache core files
self.addEventListener("install", (event) => {
	console.log("Service Worker: Installing...");

	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				console.log("Service Worker: Caching core files");
				return cache.addAll(CORE_FILES);
			})
			.then(() => {
				console.log("Service Worker: Core files cached");
				return self.skipWaiting();
			})
			.catch((error) => {
				console.error("Service Worker: Failed to cache core files", error);
			})
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	console.log("Service Worker: Activating...");

	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== CACHE_NAME && cacheName !== SOUNDS_CACHE && cacheName !== API_CACHE) {
							console.log("Service Worker: Deleting old cache", cacheName);
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => {
				console.log("Service Worker: Activated");
				return self.clients.claim();
			})
	);
});

// Debug: Log all fetch events
self.addEventListener(
	"fetch",
	(event) => {
		console.log("🔍 SW Fetch intercepted:", event.request.url);
	},
	{ capture: true }
);

// Fetch event - handle requests
self.addEventListener("fetch", (event) => {
	const requestUrl = new URL(event.request.url);
	console.log("Service Worker: Intercepting request", requestUrl.pathname);

	// Handle different types of requests
	if (requestUrl.pathname === "/manifest.json") {
		console.log("Service Worker: Handling manifest request");
		event.respondWith(handleManifestRequest(event.request));
	} else if (requestUrl.pathname.startsWith("/sounds/")) {
		console.log("Service Worker: Handling audio request", requestUrl.pathname);
		// Audio files - cache with network first strategy
		event.respondWith(handleAudioRequest(event.request));
	} else if (requestUrl.pathname.startsWith("/api/")) {
		console.log("Service Worker: Handling API request", requestUrl.pathname);
		// API requests - cache with network first, fallback to cache
		event.respondWith(handleApiRequest(event.request));
	} else {
		console.log("Service Worker: Handling app shell request", requestUrl.pathname);
		// App shell - cache first strategy
		event.respondWith(handleAppShellRequest(event.request));
	}
});

// Handle manifest requests with dynamic configuration
async function handleManifestRequest(request) {
	try {
		// Try to get config from a client
		const clients = await self.clients.matchAll();
		let config = null;

		// Check if any client has the config available
		for (const client of clients) {
			try {
				// We can't directly access window.soundboardConfig from SW,
				// so we'll try to fetch the config ourselves
				const configResponse = await fetch("/config.json");
				if (configResponse.ok) {
					config = await configResponse.json();
					break;
				}
			} catch (error) {
				console.log("Config fetch failed:", error);
			}
		}

		// Fallback config if we can't get the real one
		if (!config) {
			config = {
				title: "Soundboard PWA",
				shortName: "Soundboard",
				description: "A Progressive Web App soundboard",
				themeColor: "#1a1a1a",
				backgroundColor: "#1a1a1a",
			};
		}

		// Create dynamic manifest
		const dynamicManifest = {
			name: config.title,
			short_name: config.shortName || config.title.split(" ")[0],
			description: config.description,
			start_url: "/",
			display: "standalone",
			background_color: config.backgroundColor || config.themeColor,
			theme_color: config.themeColor,
			orientation: "portrait-primary",
			scope: "/",
			icons: [
				{
					src: "/icons/icon-72x72.png",
					sizes: "72x72",
					type: "image/png",
					purpose: "maskable any",
				},
				{
					src: "/icons/icon-96x96.png",
					sizes: "96x96",
					type: "image/png",
					purpose: "maskable any",
				},
				{
					src: "/icons/icon-128x128.png",
					sizes: "128x128",
					type: "image/png",
					purpose: "maskable any",
				},
				{
					src: "/icons/icon-144x144.png",
					sizes: "144x144",
					type: "image/png",
					purpose: "maskable any",
				},
				{
					src: "/icons/icon-152x152.png",
					sizes: "152x152",
					type: "image/png",
					purpose: "maskable any",
				},
				{
					src: "/icons/icon-192x192.png",
					sizes: "192x192",
					type: "image/png",
					purpose: "maskable any",
				},
				{
					src: "/icons/icon-384x384.png",
					sizes: "384x384",
					type: "image/png",
					purpose: "maskable any",
				},
				{
					src: "/icons/icon-512x512.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "maskable any",
				},
			],
		};

		console.log("Service Worker: Generated dynamic manifest for", config.title);

		return new Response(JSON.stringify(dynamicManifest, null, 2), {
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-cache",
			},
		});
	} catch (error) {
		console.error("Service Worker: Error handling manifest request", error);
		// Fallback to static manifest
		return fetch("/manifest.json");
	}
}

// Handle audio file requests
async function handleAudioRequest(request) {
	console.log("Service Worker: handleAudioRequest called for", request.url);
	const cache = await caches.open(SOUNDS_CACHE);

	// Try cache first for audio files (better for offline experience)
	const cachedResponse = await cache.match(request);
	if (cachedResponse) {
		console.log("Service Worker: ✅ Serving cached audio", request.url);
		return cachedResponse;
	}

	try {
		// If not in cache, try network
		console.log("Service Worker: 🌐 Fetching audio from network", request.url);
		const networkResponse = await fetch(request);
		if (networkResponse.ok) {
			// Cache successful responses for future use
			console.log("Service Worker: 💾 Caching audio file", request.url);
			await cache.put(request, networkResponse.clone());
			console.log("Service Worker: ✅ Audio file cached successfully", request.url);

			// Notify the main app that this file was cached
			self.clients.matchAll().then((clients) => {
				clients.forEach((client) => {
					client.postMessage({
						type: "AUDIO_CACHED",
						url: request.url,
					});
				});
			});
		} else {
			console.error(
				"Service Worker: ❌ Network response not ok",
				request.url,
				networkResponse.status
			);
		}
		return networkResponse;
	} catch (error) {
		// Network failed and not in cache
		console.error("Service Worker: 💥 Audio file not available", request.url, error);
		return new Response("Audio file not available offline", {
			status: 404,
			statusText: "Not Found",
		});
	}
}

// Handle API requests
async function handleApiRequest(request) {
	const cache = await caches.open(API_CACHE);

	try {
		// Try network first
		const networkResponse = await fetch(request);
		if (networkResponse.ok) {
			// Cache successful API responses
			cache.put(request, networkResponse.clone());
		}
		return networkResponse;
	} catch (error) {
		// Network failed, try cache
		console.log("Service Worker: Network failed for API, trying cache", request.url);
		const cachedResponse = await cache.match(request);
		if (cachedResponse) {
			return cachedResponse;
		}

		// Return empty response if not in cache
		return new Response(JSON.stringify({ files: [] }), {
			headers: { "Content-Type": "application/json" },
		});
	}
}

// Handle app shell requests
async function handleAppShellRequest(request) {
	const cache = await caches.open(CACHE_NAME);

	// Cache first strategy for app shell
	const cachedResponse = await cache.match(request);
	if (cachedResponse) {
		// Return cached version immediately
		updateCacheInBackground(request, cache);
		return cachedResponse;
	}

	// Not in cache, try network
	try {
		const networkResponse = await fetch(request);
		if (networkResponse.ok) {
			cache.put(request, networkResponse.clone());
		}
		return networkResponse;
	} catch (error) {
		// Network failed and not in cache
		if (request.destination === "document") {
			// Return cached index.html for navigation requests
			return cache.match("/index.html");
		}

		return new Response("Resource not available offline", {
			status: 404,
			statusText: "Not Found",
		});
	}
}

// Update cache in background
async function updateCacheInBackground(request, cache) {
	try {
		const networkResponse = await fetch(request);
		if (networkResponse.ok) {
			cache.put(request, networkResponse.clone());
		}
	} catch (error) {
		// Ignore network errors during background update
		console.log("Service Worker: Background update failed for", request.url);
	}
}

// Background sync for updating sounds
self.addEventListener("sync", (event) => {
	if (event.tag === "update-sounds") {
		event.waitUntil(updateSoundsCache());
	}
});

// Update sounds cache
async function updateSoundsCache() {
	try {
		console.log("Service Worker: Updating sounds cache...");

		// Fetch latest sounds data
		const response = await fetch("/api/sounds.json");
		if (!response.ok) {
			throw new Error("Failed to fetch sounds data");
		}

		const data = await response.json();
		const sounds = data.files || data;

		// Cache the API response
		const apiCache = await caches.open(API_CACHE);
		await apiCache.put("/api/sounds.json", response.clone());

		// Pre-cache new audio files
		const soundsCache = await caches.open(SOUNDS_CACHE);
		const cachedSounds = await soundsCache.keys();
		const cachedUrls = cachedSounds.map((req) => req.url);

		const newSounds = sounds.filter((sound) => {
			const soundUrl = new URL(sound.mp3, self.location.origin).href;
			return !cachedUrls.includes(soundUrl);
		});

		if (newSounds.length > 0) {
			console.log(`Service Worker: Caching ${newSounds.length} new sounds...`);

			// Cache new sounds (limit to prevent overwhelming the device)
			const soundsToCache = newSounds.slice(0, 50); // Limit to 50 new sounds at a time

			for (const sound of soundsToCache) {
				try {
					const soundResponse = await fetch(sound.mp3);
					if (soundResponse.ok) {
						await soundsCache.put(sound.mp3, soundResponse);
					}
				} catch (error) {
					console.error("Service Worker: Failed to cache sound", sound.mp3, error);
				}
			}

			console.log("Service Worker: New sounds cached successfully");
		}
	} catch (error) {
		console.error("Service Worker: Failed to update sounds cache", error);
	}
}

// Message handling for manual cache updates
self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "CACHE_SOUNDS") {
		event.waitUntil(cacheSounds(event.data.sounds));
	} else if (event.data && event.data.type === "CACHE_AUDIO") {
		event.waitUntil(cacheAudioFile(event.data.url));
	}
});

// Cache a single audio file
async function cacheAudioFile(url) {
	try {
		const cache = await caches.open(SOUNDS_CACHE);
		const response = await fetch(url);
		if (response.ok) {
			await cache.put(url, response);
			console.log("Service Worker: Cached audio file", url);

			// Notify the main app that this file was cached
			self.clients.matchAll().then((clients) => {
				clients.forEach((client) => {
					client.postMessage({
						type: "AUDIO_CACHED",
						url: url,
					});
				});
			});
		}
	} catch (error) {
		console.error("Service Worker: Failed to cache audio file", url, error);
	}
}

// Cache specific sounds
async function cacheSounds(sounds) {
	const cache = await caches.open(SOUNDS_CACHE);
	for (const sound of sounds) {
		try {
			const response = await fetch(sound.mp3);
			if (response.ok) {
				await cache.put(sound.mp3, response);

				// Notify the main app that this file was cached
				self.clients.matchAll().then((clients) => {
					clients.forEach((client) => {
						client.postMessage({
							type: "AUDIO_CACHED",
							url: sound.mp3,
						});
					});
				});
			}
		} catch (error) {
			console.error("Service Worker: Failed to cache sound", sound.mp3, error);
		}
	}
}

// Periodic background sync (if supported)
self.addEventListener("periodicsync", (event) => {
	if (event.tag === "update-sounds-periodic") {
		event.waitUntil(updateSoundsCache());
	}
});
