import fs from 'fs';
import path from 'path';
import https from 'https';
import { logger } from './logger';

// Note: We're not downloading images anymore as we're using existing images
// This array is kept for reference but the downloadProductImages function will
// now just check if the images exist rather than downloading them
const productImages: string[] = [
  // We're using images that are already in the public/images/products directory
  // with filenames: product1.png, product4.png, product5.png, product6.png,
  // product7.png, product8.png, product9.png
];

// Download an image from a URL and save it to disk
const downloadImage = (url: string, filepath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle HTTP errors
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
        return;
      }

      // Create write stream
      const fileStream = fs.createWriteStream(filepath);
      
      // Pipe the response to the file
      response.pipe(fileStream);
      
      // Handle errors during download
      response.on('error', (err) => {
        fileStream.close();
        reject(err);
      });
      
      // Resolve the promise when download completes
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      // Handle write stream errors
      fileStream.on('error', (err) => {
        fileStream.close();
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Main function to check that product images exist
export const downloadProductImages = async (): Promise<void> => {
  // Create output directory if it doesn't exist
  const publicDir = path.join(__dirname, '../../public');
  const imagesDir = path.join(publicDir, 'images');
  const productsDir = path.join(imagesDir, 'products');
  
  // Ensure directories exist
  [publicDir, imagesDir, productsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  logger.info('Checking for product images...');
  
  // The expected product image files
  const expectedImages = ['product1.png', 'product4.png', 'product5.png', 'product6.png', 
                         'product7.png', 'product8.png', 'product9.png'];
  
  // Check each expected image
  for (const imageName of expectedImages) {
    const filePath = path.join(productsDir, imageName);
    
    if (fs.existsSync(filePath)) {
      logger.info(`Image ${imageName} exists.`);
    } else {
      logger.warn(`Image ${imageName} does not exist. Please ensure all product images are in place.`);
    }
  }
  
  logger.info('Image verification process completed.');
};

// Run the function directly if this script is executed directly
if (require.main === module) {
  (async () => {
    try {
      await downloadProductImages();
      process.exit(0);
    } catch (error) {
      logger.error('Error in downloadProductImages:', error);
      process.exit(1);
    }
  })();
}