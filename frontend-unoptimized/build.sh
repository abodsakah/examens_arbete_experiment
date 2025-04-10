#!/bin/bash

echo "Building unoptimized frontend..."

# Increase memory limit for build process
export NODE_OPTIONS="--max-old-space-size=8192"

# Add environment variables to disable browser cache
export VITE_DISABLE_CACHE=true

# Run the build with all optimizations disabled
npm run build

echo "Build complete! The unoptimized bundle is ready."
echo "Run 'npm run preview' to test the production build locally."