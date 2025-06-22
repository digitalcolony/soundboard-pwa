import fs from "fs";
import path from "path";

console.log("🎵 Syncing soundboard data from main site...");

// Ensure public/api directory exists
const apiDir = "public/api";
if (!fs.existsSync(apiDir)) {
	fs.mkdirSync(apiDir, { recursive: true });
}

// Copy sounds JSON data
const sourceSoundsJson = "../src/data/soundboard.json";
const targetSoundsJson = "public/api/sounds.json";

if (fs.existsSync(sourceSoundsJson)) {
	console.log("📄 Copying soundboard data...");
	fs.copyFileSync(sourceSoundsJson, targetSoundsJson);
	console.log("✅ Soundboard data copied");

	// Read and display count
	const data = JSON.parse(fs.readFileSync(targetSoundsJson, "utf8"));
	console.log(`📊 Found ${data.files?.length || 0} sounds`);
} else {
	console.log("❌ Source soundboard.json not found at ../src/data/soundboard.json");
	console.log("📄 Creating empty sounds.json...");
	const emptyData = JSON.stringify({ files: [] }, null, 2);
	fs.writeFileSync(targetSoundsJson, emptyData);
}

// Copy sounds directory
const soundsSources = ["../public/sounds", "../src/sounds"];
let soundsCopied = false;

for (const source of soundsSources) {
	if (fs.existsSync(source)) {
		console.log(`🎵 Copying sounds directory from ${source}...`);

		// Create target directory
		const target = "public/sounds";
		if (!fs.existsSync(target)) {
			fs.mkdirSync(target, { recursive: true });
		}

		// Copy files recursively
		copyDir(source, target);
		console.log("✅ Sounds directory copied");
		soundsCopied = true;
		break;
	}
}

if (!soundsCopied) {
	console.log("❌ Sounds directory not found");
	console.log("📁 Creating empty sounds directory...");
	fs.mkdirSync("public/sounds", { recursive: true });
}

console.log("🎉 Data sync complete!");

// Helper function to copy directory recursively
function copyDir(src, dest) {
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest, { recursive: true });
	}

	const files = fs.readdirSync(src);

	for (const file of files) {
		const srcPath = path.join(src, file);
		const destPath = path.join(dest, file);

		if (fs.statSync(srcPath).isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}
