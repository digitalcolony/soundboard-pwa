import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: "index.html",
				sw: "sw.js",
			},
			output: {
				entryFileNames: (chunkInfo) => {
					return chunkInfo.name === "sw" ? "sw.js" : "[name]-[hash].js";
				},
			},
		},
	},
	server: {
		port: 3000,
	},
});
