import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		// Disable minification completely
		minify: false,
		// Don't create source maps
		sourcemap: false,
		// No optimizations
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				// No code splitting
				manualChunks: undefined,
				// Don't hash filenames
				entryFileNames: "assets/[name].js",
				chunkFileNames: "assets/[name].js",
				assetFileNames: "assets/[name].[ext]"
			}
		}
	},
	// No caching headers
	server: {
		headers: {
			"Cache-Control": "no-store"
		}
	}
});
