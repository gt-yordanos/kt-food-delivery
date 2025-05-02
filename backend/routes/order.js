// routes/order.js
import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrdersByCustomerId,
  getOrdersByStatus,
  updateOrderStatus,
  verifyPayment,
  paymentCallback,
} from '../controllers/order.js';

import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles(['customer']), createOrder);
router.get('/', authenticateToken, authorizeRoles(['admin']), getAllOrders);
router.get('/customer/:customerId', authenticateToken, authorizeRoles(['restaurantOwner', 'customer']), getOrdersByCustomerId);
router.get('/status/:status', authenticateToken, authorizeRoles(['restaurantOwner']), getOrdersByStatus);
router.patch('/:orderId/status', authenticateToken, authorizeRoles(['restaurantOwner']), updateOrderStatus);

// Payment verification routes
router.get('/payments/chapa/verify/:tx_ref', verifyPayment);
router.post('/payments/chapa/callback', paymentCallback);

export default router;