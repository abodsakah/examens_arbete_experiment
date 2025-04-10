#!/bin/bash

# This script converts JPG images to WebP format
# It requires the cwebp tool from the WebP package to be installed
# Mac: brew install webp
# Ubuntu: apt-get install webp

IMAGE_DIR="public/images"

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "Error: cwebp command not found."
    echo "Please install WebP tools:"
    echo "  - Mac: brew install webp"
    echo "  - Ubuntu: apt-get install webp"
    exit 1
fi

# Convert all JPG files to WebP
echo "Converting JPG images to WebP format..."
for img in "$IMAGE_DIR"/*.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename -- "$img")
        name="${filename%.*}"
        output="$IMAGE_DIR/$name.webp"
        
        echo "Converting $img to $output"
        cwebp -q 80 "$img" -o "$output"
    fi
done

echo "Conversion complete!"