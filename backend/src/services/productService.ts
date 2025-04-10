import { pool } from '../config/database';
import { Product, ProductFilter } from '../models/Product';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { logger } from '../utils/logger';

export const getProducts = async (filters: ProductFilter = {}): Promise<{products: Product[], total: number}> => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      featured,
      sortBy = 'id',
      sortDirection = 'asc',
      limit = 10,
      offset = 0
    } = filters;

    // Build WHERE clause
    let whereClause = '';
    const whereParams: any[] = [];
    
    if (category) {
      whereClause += ' AND category = ?';
      whereParams.push(category);
    }
    
    if (minPrice !== undefined) {
      whereClause += ' AND price >= ?';
      whereParams.push(minPrice);
    }
    
    if (maxPrice !== undefined) {
      whereClause += ' AND price <= ?';
      whereParams.push(maxPrice);
    }
    
    if (featured !== undefined) {
      whereClause += ' AND featured = ?';
      whereParams.push(featured);
    }

    // Validate sortBy for SQL injection prevention
    const validSortColumns = ['id', 'name', 'price', 'rating', 'created_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';
    
    // Validate sortDirection
    const direction = sortDirection === 'desc' ? 'DESC' : 'ASC';
    
    // Calculate pagination parameters
    const limitVal = Math.min(limit, 50); // Cap at 50 items max
    const offsetVal = offset;

    // Get total count for pagination
    const [countResult] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM products WHERE 1=1${whereClause}`,
      whereParams
    );
    const total = countResult[0].total;

    // Query products with filtering, sorting and pagination
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM products 
       WHERE 1=1${whereClause} 
       ORDER BY ${sortColumn} ${direction} 
       LIMIT ? OFFSET ?`,
      [...whereParams, limitVal, offsetVal]
    );
    
    // Update image URLs for each product
    const products = rows as Product[];
    products.forEach(product => {
      // Use the product's existing image_url or assign based on ID
      if (!product.image_url || !product.image_url.includes('product')) {
        // Map to available product images (1, 4, 5, 6, 7, 8, 9)
        const availableImages = [1, 4, 5, 6, 7, 8, 9];
        const imageIndex = (product.id! - 1) % availableImages.length;
        product.image_url = `/images/products/product${availableImages[imageIndex]}.png`;
      }
    });

    return {
      products: products,
      total
    };
  } catch (error) {
    logger.error('Error in getProducts service:', error);
    throw new Error('Failed to fetch products');
  }
};

export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const product = rows[0] as Product;
    
    // Update image URL if needed
    if (!product.image_url || !product.image_url.includes('product')) {
      // Map to available product images (1, 4, 5, 6, 7, 8, 9)
      const availableImages = [1, 4, 5, 6, 7, 8, 9];
      const imageIndex = (id - 1) % availableImages.length;
      product.image_url = `/images/products/product${availableImages[imageIndex]}.png`;
    }

    return product;
  } catch (error) {
    logger.error(`Error in getProductById service for ID ${id}:`, error);
    throw new Error(`Failed to fetch product with ID ${id}`);
  }
};

export const getFeaturedProducts = async (limit: number = 5): Promise<Product[]> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE featured = true ORDER BY rating DESC LIMIT ?',
      [limit]
    );

    // Update image URLs for each product
    const products = rows as Product[];
    products.forEach(product => {
      // Use the product's existing image_url or assign based on ID
      if (!product.image_url || !product.image_url.includes('product')) {
        // Map to available product images (1, 4, 5, 6, 7, 8, 9)
        const availableImages = [1, 4, 5, 6, 7, 8, 9];
        const imageIndex = (product.id! - 1) % availableImages.length;
        product.image_url = `/images/products/product${availableImages[imageIndex]}.png`;
      }
    });

    return products;
  } catch (error) {
    logger.error('Error in getFeaturedProducts service:', error);
    throw new Error('Failed to fetch featured products');
  }
};

export const searchProducts = async (searchTerm: string, limit: number = 10): Promise<Product[]> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? LIMIT ?',
      [`%${searchTerm}%`, `%${searchTerm}%`, limit]
    );

    // Update image URLs for each product
    const products = rows as Product[];
    products.forEach(product => {
      // Use the product's existing image_url or assign based on ID
      if (!product.image_url || !product.image_url.includes('product')) {
        // Map to available product images (1, 4, 5, 6, 7, 8, 9)
        const availableImages = [1, 4, 5, 6, 7, 8, 9];
        const imageIndex = (product.id! - 1) % availableImages.length;
        product.image_url = `/images/products/product${availableImages[imageIndex]}.png`;
      }
    });

    return products;
  } catch (error) {
    logger.error(`Error in searchProducts service for term '${searchTerm}':`, error);
    throw new Error('Failed to search products');
  }
};

export const getProductCategories = async (): Promise<string[]> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT DISTINCT category FROM products'
    );

    return rows.map(row => row.category);
  } catch (error) {
    logger.error('Error in getProductCategories service:', error);
    throw new Error('Failed to fetch product categories');
  }
};