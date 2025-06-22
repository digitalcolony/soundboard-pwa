import fs from "fs";
import path from "path";

console.log("🎵 Generating sounds.json from existing sound files...");

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

// Generate sound data from filenames
const sounds = soundFiles.map((file) => {
	const nameWithoutExt = path.basename(file, ".mp3");
	// Convert filename to display name (replace hyphens/underscores with spaces)
	const displayName = nameWithoutExt
		.replace(/[-_]/g, " ")
		.replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before caps
		.replace(/\s+/g, " ") // Normalize multiple spaces
		.trim();

	return {
		name: displayName,
		artist: "Unknown", // Default artist - can be manually updated in the JSON file
		duration: "0:01", // Default duration - could be enhanced to read actual duration
		mp3: `/sounds/${file}`,
	};
});

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
