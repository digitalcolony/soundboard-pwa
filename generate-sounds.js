import fs from "fs";
import path from "path";
import NodeID3 from "node-id3";

console.log("🎵 Generating sounds.json from MP3 files with ID3 tag reading...");

const soundsDir = "public/sounds";
const outputFile = "public/api/sounds.json";

if (!fs.existsSync(soundsDir)) {
	console.error("❌ Sounds directory not found:", soundsDir);
	process.exit(1);
}

// Read all MP3 files from the sounds directory
const soundFiles = fs
	.readdirSync(soundsDir)
	.filter((file) => file.endsWith(".mp3"))
	.sort();

console.log(`📁 Found ${soundFiles.length} sound files`);

// Generate sound data from MP3 files with ID3 tag reading
const sounds = [];

for (const file of soundFiles) {
	const filePath = path.join(soundsDir, file);
	const nameWithoutExt = path.basename(file, ".mp3");

	console.log(`📖 Reading ID3 tags for: ${file}`);

	try {
		// Read ID3 tags from the MP3 file
		const tags = NodeID3.read(filePath); // Extract information from ID3 tags with fallbacks
		let title = tags.title || nameWithoutExt.replace(/[-_]/g, " ").trim();
		let artist = tags.artist || "";

		// Clean up the title if it came from filename
		if (!tags.title) {
			title = nameWithoutExt
				.replace(/[-_]/g, " ")
				.replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before caps
				.replace(/\s+/g, " ") // Normalize multiple spaces
				.trim();
		}
		sounds.push({
			name: title,
			artist: artist,
			mp3: `/sounds/${file}`,
		});

		console.log(`  ✅ Title: "${title}", Artist: "${artist}"`);
	} catch (error) {
		console.warn(`  ⚠️  Could not read ID3 tags for ${file}, using filename: ${error.message}`);

		// Fallback to filename parsing if ID3 reading fails
		const displayName = nameWithoutExt
			.replace(/[-_]/g, " ")
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.replace(/\s+/g, " ")
			.trim();
		sounds.push({
			name: displayName,
			artist: "",
			mp3: `/sounds/${file}`,
		});

		console.log(`  📝 Fallback - Title: "${displayName}", Artist: ""`);
	}
}

// Create the sounds data structure
const soundsData = {
	files: sounds,
};

// Ensure the api directory exists
const apiDir = path.dirname(outputFile);
if (!fs.existsSync(apiDir)) {
	fs.mkdirSync(apiDir, { recursive: true });
}

// Write the sounds.json file
fs.writeFileSync(outputFile, JSON.stringify(soundsData, null, 2));

console.log(`✅ Generated ${outputFile} with ${sounds.length} sounds`);
console.log("🎉 You can now run the soundboard!");

// Show a sample of the generated data
console.log("\n📝 Sample of generated data:");
console.log(JSON.stringify(sounds.slice(0, 3), null, 2));
