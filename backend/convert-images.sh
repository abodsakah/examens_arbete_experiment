#!/bin/bash

# Image optimization script for frontend images
# - Converts JPG/PNG images to WebP format
# - Optimizes existing images
# - Creates multiple sizes for responsive images
# 
# Requires: cwebp, optipng, jpegoptim (can be installed via brew or apt)

# Set directories
PUBLIC_DIR="public"
IMAGES_DIR="$PUBLIC_DIR/images/products"
PRODUCT_IMAGES="$IMAGES_DIR/*.png $IMAGES_DIR/*.jpg $IMAGES_DIR/*.jpeg"

# Check dependencies
check_deps() {
  echo "Checking dependencies..."
  local missing=0
  
  for cmd in cwebp optipng jpegoptim; do
    if ! command -v $cmd &> /dev/null; then
      echo "❌ Missing dependency: $cmd"
      missing=1
    else
      echo "✅ Found dependency: $cmd"
    fi
  done
  
  if [ $missing -eq 1 ]; then
    echo "Please install missing dependencies:"
    echo "  - On macOS: brew install webp optipng jpegoptim"
    echo "  - On Ubuntu: sudo apt-get install webp optipng jpegoptim"
    exit 1
  fi
}

# Create WebP versions of all images
convert_to_webp() {
  echo "Converting images to WebP format..."
  
  # Find all images and convert to WebP
  find $IMAGES_DIR -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -print0 | 
  while IFS= read -r -d '' file; do
    base_name="${file%.*}"
    echo "Converting $file to ${base_name}.webp"
    
    # Use different quality settings based on image type
    if [[ "$file" == *banner* ]]; then
      # Banners with higher quality (85%)
      cwebp -q 85 "$file" -o "${base_name}.webp"
    else
      # Product images with good balance (80%)
      cwebp -q 80 "$file" -o "${base_name}.webp"
    fi
  done
}

# Optimize existing images
optimize_images() {
  echo "Optimizing existing JPG/PNG images..."
  
  # Optimize PNG files
  find $IMAGES_DIR -type f -name "*.png" -print0 | 
  while IFS= read -r -d '' file; do
    echo "Optimizing PNG: $file"
    optipng -quiet -strip all "$file"
  done
  
  # Optimize JPG files
  find $IMAGES_DIR -type f \( -name "*.jpg" -o -name "*.jpeg" \) -print0 | 
  while IFS= read -r -d '' file; do
    echo "Optimizing JPG: $file"
    jpegoptim --strip-all --max=85 "$file"
  done
}

# Run all optimizations
main() {
  check_deps
  optimize_images
  convert_to_webp
  
  # Uncomment if you have ImageMagick installed and want responsive images
  # create_responsive_images
  
  echo "✨ Image optimization complete!"
}

main