import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import { visualizer } from "rollup-plugin-visualizer"; // For bundle analysis
import viteCompression from 'vite-plugin-compression'; // Gzip/Brotli compression
import { VitePWA } from 'vite-plugin-pwa'; // PWA support
import legacy from '@vitejs/plugin-legacy'; // Legacy browser support
// @ts-ignore
import viteImagemin from 'vite-plugin-imagemin'; // Image optimization

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Add legacy browser support
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    // Add PWA support
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Optimized Web Shop',
        short_name: 'Shop',
        description: 'Fully optimized web shop application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Cache all assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}'],
        // Specify runtime caching policies
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          }
        ]
      }
    }),
    // Image optimization disabled due to ESM compatibility issues
    // viteImagemin({
    //   gifsicle: {
    //     optimizationLevel: 7,
    //     interlaced: false
    //   },
    //   optipng: {
    //     optimizationLevel: 7
    //   },
    //   mozjpeg: {
    //     quality: 80
    //   },
    //   pngquant: {
    //     quality: [0.7, 0.8],
    //     speed: 4
    //   },
    //   webp: {
    //     quality: 80
    //   },
    //   svgo: {
    //     multipass: true,
    //     plugins: [
    //       {
    //         name: 'removeViewBox',
    //         active: false
    //       }
    //     ]
    //   }
    // }),
    // Compress assets
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    }),
    // Bundle visualization for analysis
    // @ts-ignore - Type compatibility with Vite 5
    visualizer({
      filename: './stats.html',
      gzipSize: true,
      brotliSize: true
    }) as any
  ],
  build: {
    // Enable full minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      output: {
        comments: false
      }
    },
    // Create source maps for production debugging
    sourcemap: false,
    // Enable CSS code splitting for optimal loading
    cssCodeSplit: true,
    // Reduce chunk size
    chunkSizeWarningLimit: 800,
    // Optimize build
    rollupOptions: {
      output: {
        // Advanced code splitting strategy
        manualChunks: (id) => {
          // Create vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('redux') || id.includes('react-redux')) {
              return 'vendor-redux';
            }
            if (id.includes('formik') || id.includes('yup')) {
              return 'vendor-forms';
            }
            return 'vendor-other';
          }
          // Group common utilities
          if (id.includes('/src/utils/') || id.includes('/src/helpers/')) {
            return 'utils';
          }
          // Group components
          if (id.includes('/src/components/')) {
            return 'components';
          }
        },
        // Optimize asset naming for improved caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  // Aggressive caching strategy
  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable" // 1 year caching
    }
  },
  // Optimize preview server
  preview: {
    port: 4173,
    strictPort: true,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable" // 1 year caching
    }
  },
  // Optimize for production
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'formik', 'yup'],
    exclude: ['fsevents']
  }
});
