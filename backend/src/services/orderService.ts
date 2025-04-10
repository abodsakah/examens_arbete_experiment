import { pool } from '../config/database';
import { Order, OrderItem, OrderTracking } from '../models/Order';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { logger } from '../utils/logger';
import { getProductById } from './productService';
import { ApiError } from '../middleware/errorHandler';

// Create a new order
export const createOrder = async (orderData: Order, items: {product_id: number, quantity: number}[]): Promise<Order> => {
  const connection = await pool.getConnection();
  
  try {
    // Start transaction
    await connection.beginTransaction();
    
    // Generate tracking number
    const trackingNumber = generateTrackingNumber();
    
    // Insert order
    const [orderResult] = await connection.query<ResultSetHeader>(
      'INSERT INTO orders (customer_name, customer_email, customer_address, total_amount, status, tracking_number) VALUES (?, ?, ?, ?, ?, ?)',
      [orderData.customer_name, orderData.customer_email, orderData.customer_address, orderData.total_amount, 'pending', trackingNumber]
    );
    
    const orderId = orderResult.insertId;
    
    // Insert order items
    for (const item of items) {
      // Check product availability and get current price
      const product = await getProductById(item.product_id);
      
      if (!product) {
        throw new ApiError(404, `Product with ID ${item.product_id} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for product: ${product.name}`);
      }
      
      // Insert order item
      await connection.query<ResultSetHeader>(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, product.price]
      );
      
      // Update product stock
      await connection.query<ResultSetHeader>(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }
    
    // Insert initial tracking entry
    await connection.query<ResultSetHeader>(
      'INSERT INTO order_tracking (order_id, status, details) VALUES (?, ?, ?)',
      [orderId, 'pending', 'Order received and pending processing']
    );
    
    // Commit transaction
    await connection.commit();
    
    // Return created order
    const createdOrder: Order = {
      ...orderData,
      id: orderId,
      tracking_number: trackingNumber,
      status: 'pending'
    };
    
    return createdOrder;
  } catch (error) {
    // Rollback transaction if error occurs
    await connection.rollback();
    logger.error('Error in createOrder service:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Get order by ID with items
export const getOrderById = async (id: number): Promise<Order | null> => {
  try {
    // Get order
    const [orderRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    
    if (orderRows.length === 0) {
      return null;
    }
    
    const order = orderRows[0] as Order;
    
    // Get order items
    const [itemRows] = await pool.query<RowDataPacket[]>(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );
    
    order.items = itemRows as OrderItem[];
    
    return order;
  } catch (error) {
    logger.error(`Error in getOrderById service for ID ${id}:`, error);
    throw new Error(`Failed to fetch order with ID ${id}`);
  }
};

// Get order tracking information
export const getOrderTracking = async (orderId: number): Promise<OrderTracking[]> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM order_tracking WHERE order_id = ? ORDER BY timestamp ASC',
      [orderId]
    );
    
    return rows as OrderTracking[];
  } catch (error) {
    logger.error(`Error in getOrderTracking service for order ID ${orderId}:`, error);
    throw new Error(`Failed to fetch tracking for order with ID ${orderId}`);
  }
};

// Update order status
export const updateOrderStatus = async (orderId: number, status: Order['status'], details?: string): Promise<boolean> => {
  const connection = await pool.getConnection();
  
  try {
    // Start transaction
    await connection.beginTransaction();
    
    // Update order status
    await connection.query<ResultSetHeader>(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    
    // Add tracking entry
    await connection.query<ResultSetHeader>(
      'INSERT INTO order_tracking (order_id, status, details) VALUES (?, ?, ?)',
      [orderId, status, details || `Order status updated to ${status}`]
    );
    
    // Commit transaction
    await connection.commit();
    
    return true;
  } catch (error) {
    // Rollback transaction if error occurs
    await connection.rollback();
    logger.error(`Error in updateOrderStatus service for order ID ${orderId}:`, error);
    throw new Error(`Failed to update status for order with ID ${orderId}`);
  } finally {
    connection.release();
  }
};

// Get order by tracking number
export const getOrderByTrackingNumber = async (trackingNumber: string): Promise<Order | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM orders WHERE tracking_number = ?',
      [trackingNumber]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Order;
  } catch (error) {
    logger.error(`Error in getOrderByTrackingNumber service for tracking number ${trackingNumber}:`, error);
    throw new Error(`Failed to fetch order with tracking number ${trackingNumber}`);
  }
};

// Helper function to generate a tracking number
const generateTrackingNumber = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TRK-${timestamp}-${random}`;
};