import { Request, Response } from 'express';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import * as orderService from '../services/orderService';
import { Order } from '../models/Order';

// Create a new order
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderData, items } = req.body;
  
  // Validate order data
  if (!orderData || !orderData.customer_name || !orderData.customer_email || !orderData.customer_address || !orderData.total_amount) {
    throw new ApiError(400, 'Missing required order data');
  }
  
  // Validate order items
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item');
  }
  
  // Check each item has product_id and quantity
  for (const item of items) {
    if (!item.product_id || !item.quantity || item.quantity <= 0) {
      throw new ApiError(400, 'Each order item must have a valid product_id and positive quantity');
    }
  }
  
  const order = await orderService.createOrder(orderData as Order, items);
  
  res.status(201).json({
    success: true,
    data: order
  });
});

// Get order by ID
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);
  const order = await orderService.getOrderById(orderId);
  
  if (!order) {
    throw new ApiError(404, `Order not found with ID: ${orderId}`);
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// Get order tracking
export const getOrderTracking = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);
  
  // Check if order exists
  const order = await orderService.getOrderById(orderId);
  if (!order) {
    throw new ApiError(404, `Order not found with ID: ${orderId}`);
  }
  
  const tracking = await orderService.getOrderTracking(orderId);
  
  res.status(200).json({
    success: true,
    count: tracking.length,
    data: tracking,
    order: {
      id: order.id,
      status: order.status,
      tracking_number: order.tracking_number
    }
  });
});

// Get order by tracking number
export const getOrderByTrackingNumber = asyncHandler(async (req: Request, res: Response) => {
  const trackingNumber = req.params.trackingNumber;
  
  if (!trackingNumber) {
    throw new ApiError(400, 'Tracking number is required');
  }
  
  const order = await orderService.getOrderByTrackingNumber(trackingNumber);
  
  if (!order) {
    throw new ApiError(404, `Order not found with tracking number: ${trackingNumber}`);
  }
  
  // Get tracking information
  const tracking = await orderService.getOrderTracking(order.id as number);
  
  res.status(200).json({
    success: true,
    data: {
      order,
      tracking
    }
  });
});