#!/bin/bash

echo "Building and starting the WebShop backend..."

# Build TypeScript code
echo "Compiling TypeScript..."
npm run build

# Run the server
echo "Starting server..."
npm start