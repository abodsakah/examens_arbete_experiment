#\!/bin/bash

echo "Starting unoptimized frontend with debugging enabled..."
VITE_HEAP_SIZE=8192 NODE_OPTIONS="--max-old-space-size=8192 --trace-warnings" npm run dev

