import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		// Enable minification for moderate optimization
		minify: 'esbuild',
		// Don't create source maps
		sourcemap: false,
		// Enable CSS code splitting for moderate optimization
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				// Enable basic code splitting for vendor libraries
				manualChunks: {
					vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux'],
					ui: ['formik', 'yup']
				},
				// Apply content hashing for better caching
				entryFileNames: "assets/[name]-[hash].js",
				chunkFileNames: "assets/[name]-[hash].js",
				assetFileNames: "assets/[name]-[hash].[ext]"
			}
		}
	},
	// Add caching headers for moderate optimization
	server: {
		headers: {
			"Cache-Control": "public, max-age=86400" // 1 day caching
		}
	}
});
