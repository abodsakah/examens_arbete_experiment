#!/bin/bash

echo "Setting up WebShop Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm and try again."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if .env file exists, copy example if not
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please update the .env file with your database credentials."
fi

# Build TypeScript
echo "Building TypeScript code..."
npm run build

# Setup database
echo "Setting up database..."
npm run setup-db

echo "Setup completed successfully! You can now start the server with:"
echo "npm start"
echo ""
echo "Or for development with hot reloading:"
echo "npm run dev"