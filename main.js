// Main soundboard application

// Fallback sounds data (first 20 sounds for offline-first experience)
window.FALLBACK_SOUNDS = [
	{
		name: "1 to 12 hour",
		artist: "Boca Britany Somers",
		duration: "0:03",
		mp3: "/sounds/1-to-12-hour.mp3",
	},
	{
		name: "2 of the Dumbest",
		artist: "Mike Reineri",
		duration: "0:07",
		mp3: "/sounds/2-of-the-Dumbest-White-Men.mp3",
	},
	{
		name: "A Lot of Spooks",
		artist: "Denis Potvin",
		duration: "0:02",
		mp3: "/sounds/A-Lot-of-Spooks-in-New-Jersey.mp3",
	},
	{
		name: "A Stench of Cow Manure...",
		artist: "Jim Mandich",
		duration: "0:08",
		mp3: "/sounds/A-Stench-of-Cow-Manure.mp3",
	},
	{
		name: "A lot of masturbation",
		artist: "Jim Mandich",
		duration: "0:02",
		mp3: "/sounds/A-lot-of-masturbation-went-on.mp3",
	},
	{
		name: "About 30 Man",
		artist: "Fake Ol' Dirty Bastard",
		duration: "0:01",
		mp3: "/sounds/About-30-man.mp3",
	},
	{
		name: "Absolutely",
		artist: "Moe Howard",
		duration: "0:01",
		mp3: "/sounds/Absolutely.mp3",
	},
	{
		name: "Absolutely Correct Sir",
		artist: "Bridgetender",
		duration: "0:02",
		mp3: "/sounds/Absolutely-Correct-Sir.mp3",
	},
	{
		name: "All the Crap",
		artist: "Neil Rogers",
		duration: "0:02",
		mp3: "/sounds/All-the-Crap.mp3",
	},
	{
		name: "Another break already?",
		artist: "Neil Rogers",
		duration: "0:02",
		mp3: "/sounds/Another-break-already_Q.mp3",
	},
	{
		name: "Anybody have a heart or a liver",
		artist: "Neil Rogers",
		duration: "0:03",
		mp3: "/sounds/Anybody-have-a-heart-or-a-liver.mp3",
	},
	{
		name: "Are You Sure",
		artist: "Neil Rogers",
		duration: "0:01",
		mp3: "/sounds/Are-You-Sure.mp3",
	},
	{
		name: "Awright",
		artist: "Neil Rogers",
		duration: "0:01",
		mp3: "/sounds/Awright.mp3",
	},
	{
		name: "Ayayayayayayayay!",
		artist: "Neil Rogers",
		duration: "0:02",
		mp3: "/sounds/Ayayayayayayayay!.mp3",
	},
	{
		name: "Big O Jingle",
		artist: "Neil Rogers",
		duration: "0:05",
		mp3: "/sounds/Big-O-Jingle.mp3",
	},
	{
		name: "Bop Bop Bop",
		artist: "Neil Rogers",
		duration: "0:02",
		mp3: "/sounds/Bop-Bop-Bop.mp3",
	},
	{
		name: "Bring Neil Back",
		artist: "Fan",
		duration: "0:03",
		mp3: "/sounds/Bring-Neil-Back.mp3",
	},
	{
		name: "Burp",
		artist: "Neil Rogers",
		duration: "0:01",
		mp3: "/sounds/Burp.mp3",
	},
	{
		name: "Bye Bye Bye",
		artist: "Neil Rogers",
		duration: "0:02",
		mp3: "/sounds/Bye-Bye-Bye.mp3",
	},
	{
		name: "Crap",
		artist: "Neil Rogers",
		duration: "0:01",
		mp3: "/sounds/Crap.mp3",
	},
];

class SoundboardApp {
	constructor() {
		this.sounds = [];
		this.filteredSounds = [];
		this.searchQuery = "";
		this.isOnline = navigator.onLine;

		this.init();
	}

	async init() {
		// Register service worker
		if ("serviceWorker" in navigator) {
			try {
				const registration = await navigator.serviceWorker.register("/sw.js");
				console.log("Service Worker registered:", registration);

				// Listen for updates
				registration.addEventListener("updatefound", () => {
					const newWorker = registration.installing;
					newWorker.addEventListener("statechange", () => {
						if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
							this.showStatus("♫ NEW SOUNDS AVAILABLE! REFRESH TO UPDATE ♫", "success");
						}
					});
				});
			} catch (error) {
				console.error("Service Worker registration failed:", error);
			}
		}

		// Listen for messages from service worker
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.addEventListener("message", (event) => {
				if (event.data && event.data.type === "AUDIO_CACHED") {
					const cachedUrl = event.data.url;
					const soundPath = new URL(cachedUrl).pathname;
					console.log("📢 Service worker notified: Audio cached -", soundPath);
					this.updateSoundCacheStatus(soundPath, true);
				}
			});
		}

		// Set up event listeners
		this.setupEventListeners();

		// Load sounds
		await this.loadSounds();

		// Monitor online/offline status
		window.addEventListener("online", () => {
			this.isOnline = true;
			this.hideOfflineIndicator();
			this.checkForUpdates();
		});

		window.addEventListener("offline", () => {
			this.isOnline = false;
			this.showOfflineIndicator();
		});

		// Show offline indicator if offline
		if (!this.isOnline) {
			this.showOfflineIndicator();
		}
	}
	setupEventListeners() {
		// Search input
		const searchInput = document.getElementById("search-input");
		searchInput.addEventListener("input", (e) => {
			this.searchQuery = e.target.value;
			this.filterSounds();
		});

		// Keyboard shortcut for search (S key)
		document.addEventListener("keydown", (e) => {
			if ((e.key === "s" || e.key === "S") && document.activeElement !== searchInput) {
				e.preventDefault();
				searchInput.focus();
				searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		});
	}

	async loadSounds() {
		try {
			// Try to load from cache first (for offline support)
			const cachedSounds = await this.getCachedSounds();
			if (cachedSounds && cachedSounds.length > 0) {
				console.log(`📦 Loaded ${cachedSounds.length} sounds from cache`);
				this.sounds = cachedSounds;
				await this.renderSounds();
			} // Always try to fetch fresh data if online
			if (this.isOnline) {
				// Try multiple possible API endpoints
				const apiUrls = ["/api/sounds.json", "/public/api/sounds.json"];
				let dataLoaded = false;

				for (const url of apiUrls) {
					try {
						console.log(`🌐 Trying to fetch from ${url}...`);
						const response = await fetch(url);
						console.log(`📡 Response from ${url}:`, response.status, response.ok);
						if (response.ok) {
							const data = await response.json();
							this.sounds = data.files || data;
							this.cacheSounds(this.sounds);
							await this.renderSounds();

							// Pre-cache popular sounds for offline use
							this.preCachePopularSounds();
							dataLoaded = true;
							console.log(`✅ Loaded ${this.sounds.length} sounds from ${url}`);
							break;
						}
					} catch (error) {
						console.log(`❌ Failed to load from ${url}:`, error);
					}
				}

				if (!dataLoaded) {
					console.warn(
						"⚠️ Could not load sounds from any API endpoint, using cached or fallback data"
					);
				}
			}
		} catch (error) {
			console.error("💥 Error loading sounds:", error);
			// Fallback to embedded data if all else fails
			await this.loadFallbackSounds();
		}
	}

	async getCachedSounds() {
		try {
			const cached = localStorage.getItem("soundboard-data");
			return cached ? JSON.parse(cached) : null;
		} catch (error) {
			console.error("Error reading cached sounds:", error);
			return null;
		}
	}

	cacheSounds(sounds) {
		try {
			localStorage.setItem("soundboard-data", JSON.stringify(sounds));
			localStorage.setItem("soundboard-data-timestamp", Date.now().toString());
		} catch (error) {
			console.error("Error caching sounds:", error);
		}
	}
	async loadFallbackSounds() {
		// Embedded fallback data - this would be populated during build
		this.sounds = window.FALLBACK_SOUNDS || [];
		await this.renderSounds();
	}
	async filterSounds() {
		if (!this.searchQuery.trim()) {
			this.filteredSounds = [...this.sounds];
		} else {
			const query = this.searchQuery.toLowerCase();
			this.filteredSounds = this.sounds.filter(
				(sound) =>
					sound.name.toLowerCase().includes(query) || sound.artist.toLowerCase().includes(query)
			);
		}
		await this.renderSounds();
	}
	async renderSounds() {
		const container = document.getElementById("sounds-container");
		const soundCount = document.getElementById("sound-count");
		if (!this.filteredSounds.length && this.searchQuery) {
			container.innerHTML = `
                <div class="loading">
                    ✗ NO SOUNDS FOUND FOR "${this.searchQuery}" ✗
                </div>
            `;
			return;
		}

		if (!this.sounds.length) {
			container.innerHTML = `
                <div class="loading">
                    ${this.isOnline ? "⟡ LOADING SOUNDS..." : "✗ NO SOUNDS AVAILABLE OFFLINE ✗"}
                </div>
            `;
			return;
		}

		// Sort sounds alphabetically
		const soundsToShow = this.filteredSounds.length ? this.filteredSounds : this.sounds;
		soundsToShow.sort((a, b) => a.name.localeCompare(b.name));

		// Update sound count
		soundCount.textContent = this.sounds.length;

		// Check which sounds are cached
		const soundsWithCacheStatus = await this.checkCachedSounds();
		const soundsToShowWithCache = soundsToShow.map((sound) => {
			const cached = soundsWithCacheStatus.find((s) => s.mp3 === sound.mp3);
			return { ...sound, isCached: cached?.isCached || false };
		});
		// Render sound buttons
		container.innerHTML = soundsToShowWithCache
			.map(
				(sound) => `
            <button 
                class="sound-button ${sound.isCached ? "cached" : ""}" 
                data-sound='${JSON.stringify(sound).replace(/'/g, "&apos;")}'
                title="${this.escapeHtml(sound.artist)}${
					sound.isCached ? " (Cached for offline)" : ""
				}"
            >
                <div class="sound-name">${this.escapeHtml(sound.name)}</div>
                <div class="sound-artist">${this.escapeHtml(sound.artist)}</div>
            </button>
        `
			)
			.join("");
		// Add click listeners to sound buttons
		container.querySelectorAll(".sound-button").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const sound = JSON.parse(e.currentTarget.dataset.sound);
				this.playSound(sound);
			});
		});
	}
	async playSound(sound) {
		try {
			console.log("🎵 Playing sound:", sound.mp3);

			// Explicitly fetch the audio file to ensure it goes through service worker
			const response = await fetch(sound.mp3);
			if (!response.ok) {
				throw new Error(`Failed to fetch audio: ${response.status}`);
			}

			// Create audio from the fetched response
			const audioBlob = await response.blob();
			const audioUrl = URL.createObjectURL(audioBlob);
			const audio = new Audio(audioUrl);

			// Clean up blob URL after playing
			audio.addEventListener("ended", () => {
				URL.revokeObjectURL(audioUrl);
			});

			audio.addEventListener("error", (e) => {
				console.error("Audio error:", e);
				URL.revokeObjectURL(audioUrl);
				throw new Error("Could not play sound");
			});
			await audio.play();

			// Update UI to show this sound is now cached
			this.updateSoundCacheStatus(sound.mp3, true);
		} catch (error) {
			if (error.name === "NotAllowedError") {
				this.showStatus("⚠ CLICK ANYWHERE TO ENABLE AUDIO ⚠", "error");
			} else {
				this.showStatus("✗ COULD NOT PLAY SOUND ✗", "error");
			}
			throw error;
		}
	}

	async cacheAudioFile(soundPath) {
		// Send message to service worker to cache this audio file
		if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage({
				type: "CACHE_AUDIO",
				url: soundPath,
			});
		}
	}

	async preCachePopularSounds() {
		// Pre-cache the first 20 sounds for better offline experience
		if (
			"serviceWorker" in navigator &&
			navigator.serviceWorker.controller &&
			this.sounds.length > 0
		) {
			const popularSounds = this.sounds.slice(0, 20);
			navigator.serviceWorker.controller.postMessage({
				type: "CACHE_SOUNDS",
				sounds: popularSounds,
			});
			console.log(`Pre-caching ${popularSounds.length} popular sounds...`);
		}
	}

	showStatus(message, type = "info") {
		const status = document.getElementById("status");
		status.textContent = message;
		status.className = `status show ${type}`;

		setTimeout(() => {
			status.classList.remove("show");
		}, 3000);
	}

	showOfflineIndicator() {
		document.getElementById("offline-indicator").classList.add("show");
	}

	hideOfflineIndicator() {
		document.getElementById("offline-indicator").classList.remove("show");
	}

	async checkForUpdates() {
		if (!this.isOnline) return;

		try {
			const timestamp = localStorage.getItem("soundboard-data-timestamp");
			const lastUpdate = timestamp ? parseInt(timestamp) : 0;
			const now = Date.now();

			// Check for updates every hour
			if (now - lastUpdate > 3600000) {
				await this.loadSounds();
			}
		} catch (error) {
			console.error("Error checking for updates:", error);
		}
	}

	async checkCachedSounds() {
		// Check which sounds are cached by the service worker
		if ("caches" in window) {
			try {
				const cache = await caches.open("neil-rogers-sounds-v2");
				const cachedRequests = await cache.keys();
				const cachedUrls = cachedRequests.map((req) => req.url);

				return this.sounds.map((sound) => ({
					...sound,
					isCached: cachedUrls.some((url) => url.endsWith(sound.mp3)),
				}));
			} catch (error) {
				console.error("Error checking cached sounds:", error);
				return this.sounds;
			}
		}
		return this.sounds;
	}

	escapeHtml(text) {
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	}

	updateSoundCacheStatus(soundPath, isCached) {
		// Find the button for this sound and update its cached status
		const buttons = document.querySelectorAll(".sound-button");
		buttons.forEach((button) => {
			try {
				const sound = JSON.parse(button.dataset.sound);
				if (sound.mp3 === soundPath) {
					if (isCached) {
						button.classList.add("cached");
						button.title = `${sound.artist} (Cached for offline)`;
						console.log("💾 UI updated: Sound cached -", soundPath);
					} else {
						button.classList.remove("cached");
						button.title = sound.artist;
					}
				}
			} catch (error) {
				console.error("Error updating cache status:", error);
			}
		});
	}
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	new SoundboardApp();
});

// Enable audio context on first user interaction
document.addEventListener(
	"click",
	function enableAudio() {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		if (AudioContext) {
			const context = new AudioContext();
			if (context.state === "suspended") {
				context.resume();
			}
		}
		document.removeEventListener("click", enableAudio);
	},
	{ once: true }
);
