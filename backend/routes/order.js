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
router.get('/', authenticateToken, authorizeRoles(['admin', 'manager']), getAllOrders);
router.get('/customer/:customerId', authenticateToken, authorizeRoles(['manager', 'customer']), getOrdersByCustomerId);
router.get('/status/:status', authenticateToken, authorizeRoles(['manager']), getOrdersByStatus);
router.patch('/:orderId/status', authenticateToken, authorizeRoles(['manager']), updateOrderStatus);

// Payment verification routes
router.get('/payments/chapa/verify/:tx_ref', verifyPayment);
router.post('/payments/chapa/callback', paymentCallback);

export default router;