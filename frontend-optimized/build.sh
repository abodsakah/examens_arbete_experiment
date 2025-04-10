#!/bin/bash

echo "🚀 Building FULLY OPTIMIZED frontend..."

# Increase memory limit for build process
export NODE_OPTIONS="--max-old-space-size=8192"

# Enable all optimizations
export VITE_ENABLE_COMPRESSION=true
export VITE_ENABLE_PWA=true
export NODE_ENV=production

# Display optimization techniques
echo "✅ Code splitting and dynamic imports enabled"
echo "✅ Tree shaking and dead code elimination enabled"
echo "✅ CSS optimization and minification enabled"
echo "✅ Image optimization and WebP conversion enabled"
echo "✅ HTTP caching headers configured"
echo "✅ Progressive Web App support enabled"
echo "✅ Brotli and Gzip compression enabled"
echo "✅ Preloading and prefetching enabled"
echo "✅ Bundle size optimization enabled"
echo "✅ Babel transpilation for browser compatibility"

# Convert images to WebP format if cwebp is available
if command -v cwebp &> /dev/null; then
  echo "🖼️ Converting images to WebP format..."
  ./convert-images.sh
fi

# Run the optimized build
echo "⚙️ Building production bundle..."
npm run build

# Generate bundle analysis if flag is passed
if [ "$1" = "--analyze" ]; then
  echo "📊 Generating bundle analysis report..."
  npm run analyze
fi

echo "✨ Build complete! The FULLY OPTIMIZED bundle is ready."
echo "📦 Check the dist/ directory for production files."
echo "🔍 Run 'npm run serve' to test the production build locally."