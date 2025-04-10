import { faker } from '@faker-js/faker';
import { pool } from '../config/database';
import { logger } from './logger';
import { Product } from '../models/Product';

export interface FakeProduct extends Product {
  imageUrl: string;
}

/**
 * Generate a specific number of fake products
 */
export const generateFakeProducts = (count: number = 20): FakeProduct[] => {
  const categories = ['electronics', 'furniture', 'accessories'];
  const products: FakeProduct[] = [];
  
  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(categories);
    
    // Generate product data based on category
    let name: string;
    let description: string;
    
    switch (category) {
      case 'electronics':
        name = `${faker.commerce.productAdjective()} ${faker.commerce.productName()} ${faker.string.alphanumeric(3).toUpperCase()}`;
        description = `This ${category} device features ${faker.commerce.productAdjective().toLowerCase()} technology and ${faker.commerce.productMaterial().toLowerCase()} construction. ${faker.commerce.productDescription()}`;
        break;
      case 'furniture':
        name = `${faker.commerce.productAdjective()} ${faker.commerce.productName()}`;
        description = `This ${category} piece is made from premium ${faker.commerce.productMaterial().toLowerCase()} and features a ${faker.color.human()} finish. ${faker.commerce.productDescription()}`;
        break;
      default: // accessories
        name = `${faker.commerce.productAdjective()} ${faker.commerce.productName()}`;
        description = `This ${category} item comes with ${faker.commerce.productAdjective().toLowerCase()} features. ${faker.commerce.productDescription()}`;
    }
    
    // Generate price based on category (furniture tends to be more expensive)
    let basePrice = 0;
    switch (category) {
      case 'electronics':
        basePrice = faker.number.float({ min: 50, max: 1000, fractionDigits: 2 });
        break;
      case 'furniture':
        basePrice = faker.number.float({ min: 100, max: 2000, fractionDigits: 2 });
        break;
      default: // accessories
        basePrice = faker.number.float({ min: 10, max: 200, fractionDigits: 2 });
    }
    
    // Generate rating between 1 and 5, with higher probability of 4-5 star ratings
    const rating = faker.helpers.weightedArrayElement([
      { weight: 5, value: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }) },
      { weight: 3, value: faker.number.float({ min: 3.0, max: 3.9, fractionDigits: 1 }) },
      { weight: 1, value: faker.number.float({ min: 1.0, max: 2.9, fractionDigits: 1 }) }
    ]);
    
    // Create product object
    const product: FakeProduct = {
      id: i + 1,
      name,
      description,
      price: basePrice,
      image_url: '', // Will be updated later
      imageUrl: faker.image.urlLoremFlickr({ category, width: 640, height: 480 }),
      category,
      stock: faker.number.int({ min: 0, max: 100 }),
      featured: faker.datatype.boolean({ probability: 0.3 }), // 30% chance of being featured
      rating
    };
    
    products.push(product);
  }
  
  return products;
};

/**
 * Seed the database with fake product data
 */
export const seedDatabaseWithFakeProducts = async (count: number = 20): Promise<void> => {
  try {
    logger.info(`Generating ${count} fake products...`);
    
    // Generate fake products
    const fakeProducts = generateFakeProducts(count);
    
    // Clear existing products (optional, only if you want to replace everything)
    logger.info('Clearing existing products...');
    await pool.query('DELETE FROM products');
    await pool.query('ALTER TABLE products AUTO_INCREMENT = 1');
    
    // Insert products into database
    logger.info('Inserting fake products into database...');
    
    for (const product of fakeProducts) {
      await pool.query(
        'INSERT INTO products (name, description, price, image_url, category, stock, featured, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          product.name,
          product.description,
          product.price,
          product.imageUrl, // Insert the Faker URL directly
          product.category,
          product.stock,
          product.featured,
          product.rating
        ]
      );
    }
    
    logger.info(`Successfully seeded database with ${count} fake products.`);
  } catch (error) {
    logger.error('Error seeding database with fake products:', error);
    throw error;
  }
};

/**
 * Update product images for existing products in the database with Faker images
 */
export const updateProductImagesWithFaker = async (): Promise<void> => {
  try {
    logger.info('Updating product images with Faker-generated URLs...');
    
    // Get all products
    const [products] = await pool.query('SELECT id, category FROM products') as [any[], any];
    
    for (const product of products) {
      // Generate a Faker image URL for the product based on its category
      const imageUrl = faker.image.urlLoremFlickr({ 
        category: product.category, 
        width: 640, 
        height: 480 
      });
      
      // Update the product's image_url in the database
      await pool.query(
        'UPDATE products SET image_url = ? WHERE id = ?',
        [imageUrl, product.id]
      );
    }
    
    logger.info(`Successfully updated images for ${products.length} products.`);
  } catch (error) {
    logger.error('Error updating product images:', error);
    throw error;
  }
};

/**
 * Run the data generation if this script is run directly
 */
if (require.main === module) {
  (async () => {
    try {
      // Either seed the database with new products
      await seedDatabaseWithFakeProducts(20);
      
      // Or just update images for existing products
      // await updateProductImagesWithFaker();
      
      process.exit(0);
    } catch (error) {
      logger.error('Error in fake data generation:', error);
      process.exit(1);
    }
  })();
};