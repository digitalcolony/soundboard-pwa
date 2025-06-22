import fs from "fs";
import path from "path";

console.log("🎵 Checking soundboard data...");

// Ensure public/api directory exists
const apiDir = "public/api";
if (!fs.existsSync(apiDir)) {
	fs.mkdirSync(apiDir, { recursive: true });
}

// Check if sounds.json already exists
const targetSoundsJson = "public/api/sounds.json";

if (fs.existsSync(targetSoundsJson)) {
	console.log("✅ Soundboard data found");

	// Read and display count
	const data = JSON.parse(fs.readFileSync(targetSoundsJson, "utf8"));
	console.log(`📊 Found ${data.files?.length || 0} sounds`);
} else {
	console.log("📄 Creating empty sounds.json...");
	const emptyData = JSON.stringify({ files: [] }, null, 2);
	fs.writeFileSync(targetSoundsJson, emptyData);
}

// Check if sounds directory exists
const soundsDir = "public/sounds";

if (fs.existsSync(soundsDir)) {
	const soundFiles = fs.readdirSync(soundsDir).filter((file) => file.endsWith(".mp3"));
	console.log(`🎵 Found ${soundFiles.length} sound files`);
} else {
	console.log("📁 Creating sounds directory...");
	fs.mkdirSync(soundsDir, { recursive: true });
}

console.log("🎉 Setup complete!");
