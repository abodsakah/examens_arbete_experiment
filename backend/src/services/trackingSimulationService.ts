import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { logger } from '../utils/logger';
import { getOrderById, updateOrderStatus } from './orderService';
import { OrderTracking } from '../models/Order';

// Set of predefined tracking locations
const LOCATIONS = [
  'Central Warehouse, Stockholm',
  'Distribution Center, Gothenburg',
  'Regional Sorting Facility, Malmö',
  'Local Delivery Center, Uppsala',
  'Transit Hub, Linköping',
  'Export Processing Center, Helsingborg',
  'Import Processing Center, Norrköping',
  'Cross-dock Facility, Örebro',
  'Delivery Station, Västerås',
  'Customer Delivery Point, Jönköping',
];

// Set of predefined tracking messages for each status
const STATUS_MESSAGES: Record<OrderTracking['status'], string[]> = {
  pending: [
    'Order has been received and is pending processing',
    'Payment verification in progress',
    'Order is being prepared for warehouse processing',
    'Awaiting inventory allocation',
  ],
  processing: [
    'Order is being processed at our warehouse',
    'Items are being picked from inventory',
    'Order items are being packed',
    'Quality check in progress',
    'Final packaging and labeling',
  ],
  shipped: [
    'Order has been shipped from our warehouse',
    'In transit to distribution center',
    'Package has arrived at distribution hub',
    'Package is being sorted for delivery route',
    'Package has departed from regional facility',
  ],
  out_for_delivery: [
    'Package is out for delivery today',
    'Last mile delivery in progress',
    'Package is on the delivery vehicle',
    'Delivery attempt will be made today',
    'Driver is approaching your location',
  ],
  delivered: [
    'Package has been delivered',
    'Package was handed directly to recipient',
    'Package was left at the front door',
    'Package was delivered to mailbox',
    'Package was delivered to a neighbor with permission',
  ],
  cancelled: [
    'Order has been cancelled',
    'Cancellation requested by customer',
    'Order cancelled due to payment issues',
    'Items out of stock, order cancelled',
    'Order cancelled due to shipping restrictions',
  ],
};

// Order status progression for simulation
const STATUS_PROGRESSION: OrderTracking['status'][] = [
  'pending',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
];

/**
 * Add a simulated tracking update for an order
 */
export const addTrackingUpdate = async (orderId: number): Promise<OrderTracking | null> => {
  try {
    // Get the order
    const order = await getOrderById(orderId);
    if (!order) {
      logger.error(`Cannot add tracking update: Order ${orderId} not found`);
      return null;
    }

    // If order is already delivered or cancelled, don't add updates
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return null;
    }

    // Get current tracking entries
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM order_tracking WHERE order_id = ? ORDER BY timestamp DESC LIMIT 1',
      [orderId]
    );

    let currentStatus = rows.length > 0 ? rows[0].status : 'pending';

    // Determine next status
    let nextStatus: OrderTracking['status'] = currentStatus;
    const currentIndex = STATUS_PROGRESSION.indexOf(currentStatus as OrderTracking['status']);

    // 70% chance to progress to next status if not yet delivered
    if (currentIndex < STATUS_PROGRESSION.length - 1 && Math.random() < 0.7) {
      nextStatus = STATUS_PROGRESSION[currentIndex + 1];
    }

    // Select a random location and message
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const statusMessages = STATUS_MESSAGES[nextStatus];
    const details = statusMessages[Math.floor(Math.random() * statusMessages.length)];

    // Add tracking entry
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO order_tracking (order_id, status, location, details) VALUES (?, ?, ?, ?)',
      [orderId, nextStatus, location, details]
    );

    // Update order status if it changed
    if (nextStatus !== currentStatus) {
      await updateOrderStatus(orderId, nextStatus as any, details);
    }

    // Return the created tracking entry
    const newTracking: OrderTracking = {
      id: result.insertId,
      order_id: orderId,
      status: nextStatus,
      location,
      details,
      timestamp: new Date(),
    };

    return newTracking;
  } catch (error) {
    logger.error(`Error in addTrackingUpdate service for order ID ${orderId}:`, error);
    return null;
  }
};

/**
 * Initialize the tracking simulation process
 * This will update active orders' tracking information every minute
 */
export const initTrackingSimulation = (): void => {
  logger.info('Starting order tracking simulation service');

  // Run simulation every minute
  setInterval(async () => {
    try {
      // Get all active orders (not delivered or cancelled)
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id FROM orders WHERE status NOT IN ('delivered', 'cancelled')"
      );

      // Skip if no active orders
      if (rows.length === 0) {
        return;
      }

      // Add tracking updates to some random orders
      const ordersToUpdate = Math.min(rows.length, 3);
      const shuffled = rows.sort(() => 0.5 - Math.random());

      for (let i = 0; i < ordersToUpdate; i++) {
        await addTrackingUpdate(shuffled[i].id);
      }

      logger.debug(`Updated tracking for ${ordersToUpdate} orders`);
    } catch (error) {
      logger.error('Error in tracking simulation:', error);
    }
  }, 60000); // Every minute
};
