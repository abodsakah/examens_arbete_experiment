import express, { RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';
import { downloadProductImages } from '../utils/downloadImages';

// Create directory for static files if it doesn't exist
const createStaticDirectories = () => {
  const publicDir = path.join(__dirname, '../../public');
  const imagesDir = path.join(publicDir, 'images');
  const productsDir = path.join(imagesDir, 'products');

  // Create directories if they don't exist
  [publicDir, imagesDir, productsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });

  // Create placeholder images for products
  createPlaceholderImages(productsDir);
};

// Create placeholder product images
const createPlaceholderImages = (productsDir: string) => {
  const imageNames = [
    'chair.jpg',
    'keyboard.jpg',
    'monitor.jpg',
    'mouse.jpg',
    'lamp.jpg',
    'laptop-stand.jpg',
    'ssd.jpg',
    'cable-organizer.jpg',
    'standing-desk.jpg',
    'headphones.jpg',
    'desk-organizer.jpg',
    'wireless-charger.jpg',
    'backpack.jpg',
    'speaker.jpg',
    'desk-mat.jpg',
    'monitor-arm.jpg',
    'webcam.jpg',
    'usb-hub.jpg',
    'chair-cushion.jpg',
    'power-bank.jpg',
  ];

  // Check if placeholder images exist
  const existingImages = fs.readdirSync(productsDir);

  if (existingImages.length >= imageNames.length) {
    logger.info('Product images already exist');
    return;
  }

  // Create simple placeholder image (1x1 pixel transparent PNG)
  const placeholderPixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    'base64'
  );

  // Create all high-resolution variations
  for (const imageName of imageNames) {
    const basePath = path.join(productsDir, imageName);
    const highPath = path.join(productsDir, imageName.replace('.jpg', '-high.jpg'));
    const ultraPath = path.join(productsDir, imageName.replace('.jpg', '-ultra.jpg'));

    if (!fs.existsSync(basePath)) {
      fs.writeFileSync(basePath, placeholderPixel);
    }

    if (!fs.existsSync(highPath)) {
      fs.writeFileSync(highPath, placeholderPixel);
    }

    if (!fs.existsSync(ultraPath)) {
      fs.writeFileSync(ultraPath, placeholderPixel);
    }
  }

  logger.info(`Created ${imageNames.length * 3} placeholder product images`);
};

// Export middleware
export const setupStaticFiles = (app: express.Application) => {
  // Create static directories and placeholder files
  createStaticDirectories();
  
  // Download actual product images from Unsplash
  downloadProductImages().catch(error => {
    logger.error('Failed to download product images:', error);
  });

  // Custom middleware to serve static files with CORS headers
  app.use('/images', ((req, res, next) => {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Pragma'
    );
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Cross-Origin-Embedder-Policy', 'credentialless');

    // For OPTIONS requests, just return 200 OK
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  }) as RequestHandler);

  // Use express.static with custom options
  const staticOptions = {
    etag: false,
    maxAge: 0,
    setHeaders: (res: express.Response) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.set('Surrogate-Control', 'no-store');
    },
  };

  // Serve static files from public directory
  app.use('/images', express.static(path.join(__dirname, '../../public/images'), staticOptions));
};
