import mysql from 'mysql2/promise';
import config from './index';
import { logger } from '../utils/logger';

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    logger.info('Database connection established successfully');
    connection.release();
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Initialize database tables if they don't exist
const initDatabase = async (): Promise<void> => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255),
        category VARCHAR(100),
        stock INT NOT NULL DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        rating DECIMAL(3, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_address TEXT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        tracking_number VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL,
        location VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        details TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);

    logger.info('Database tables initialized successfully');
    
    // Check if products exist, if not, seed with sample data
    const [products] = await pool.query('SELECT COUNT(*) as count FROM products');
    if ((products as any)[0].count === 0) {
      await seedProducts();
    }
    
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Seed database with sample products
const seedProducts = async (): Promise<void> => {
  try {
    const sampleProducts = [
      {
        name: 'Ergonomic Chair',
        description: 'A comfortable ergonomic office chair with adjustable height and lumbar support.',
        price: 249.99,
        image_url: '/images/products/product1.png',
        category: 'furniture',
        stock: 15,
        featured: true,
        rating: 4.5
      },
      {
        name: 'Wireless Earbuds',
        description: 'High-quality wireless earbuds with noise cancellation and long battery life.',
        price: 129.99,
        image_url: '/images/products/product4.png',
        category: 'electronics',
        stock: 30,
        featured: true,
        rating: 4.8
      },
      {
        name: 'Gaming Mouse',
        description: 'Precision gaming mouse with adjustable DPI and customizable RGB lighting.',
        price: 59.99,
        image_url: '/images/products/product5.png',
        category: 'electronics',
        stock: 45,
        featured: false,
        rating: 4.3
      },
      {
        name: 'Modern Sofa',
        description: 'Contemporary sofa with comfortable cushions and durable fabric.',
        price: 699.99,
        image_url: '/images/products/product6.png',
        category: 'furniture',
        stock: 8,
        featured: true,
        rating: 4.7
      },
      {
        name: 'Lounge Chair',
        description: 'Stylish lounge chair perfect for any living room or office space.',
        price: 349.99,
        image_url: '/images/products/product7.png',
        category: 'furniture',
        stock: 12,
        featured: false,
        rating: 4.2
      },
      {
        name: 'Dining Table',
        description: 'Elegant dining table with smooth finish and sturdy construction.',
        price: 499.99,
        image_url: '/images/products/product8.png',
        category: 'furniture',
        stock: 10,
        featured: false,
        rating: 4.6
      },
      {
        name: 'Office Desk',
        description: 'Spacious office desk with drawers and cable management system.',
        price: 399.99,
        image_url: '/images/products/product9.png',
        category: 'furniture',
        stock: 18,
        featured: true,
        rating: 4.4
      },
      {
        name: 'Bookshelf',
        description: 'Modern bookshelf with adjustable shelves for versatile storage solutions.',
        price: 279.99,
        image_url: '/images/products/product1.png',
        category: 'furniture',
        stock: 15,
        featured: false,
        rating: 4.0
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with immersive sound quality and comfort.',
        price: 199.99,
        image_url: '/images/products/product4.png',
        category: 'electronics',
        stock: 25,
        featured: true,
        rating: 4.9
      }
    ];

    for (const product of sampleProducts) {
      await pool.query(
        'INSERT INTO products (name, description, price, image_url, category, stock, featured, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.image_url, product.category, product.stock, product.featured, product.rating]
      );
    }

    logger.info('Database seeded with sample products');
  } catch (error) {
    logger.error('Database seeding failed:', error);
  }
};

export { pool, testConnection, initDatabase };