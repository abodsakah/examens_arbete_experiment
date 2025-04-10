#!/bin/bash

echo "🛠️ Building moderately optimized frontend..."

# Increase memory limit for build process
export NODE_OPTIONS="--max-old-space-size=8192"

# Display optimization info
echo "🔹 Code splitting enabled"
echo "🔹 Image optimization with WebP enabled"
echo "🔹 Minification and tree-shaking enabled"
echo "🔹 Cache optimization enabled"

# Run the build with moderate optimizations
npm run build

echo "✅ Build complete! The moderately optimized bundle is ready."
echo "👉 View optimization details in optimization-readme.md"
echo "Run 'npm run preview' to test the production build locally."