import express from 'express';
import * as orderController from '../controllers/orderController';

const router = express.Router();

// Order routes
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.get('/:id/tracking', orderController.getOrderTracking);
router.get('/tracking/:trackingNumber', orderController.getOrderByTrackingNumber);

export default router;