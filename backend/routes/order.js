import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrdersByCustomerId,
  getOrdersByStatus,
  updateOrderStatus,
  verifyPayment,
  paymentSuccessRedirect
} from '../controllers/order.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Order routes
router.post('/', authenticateToken, authorizeRoles(['customer']), createOrder);
router.get('/', authenticateToken, authorizeRoles(['admin']), getAllOrders);
router.get('/customer/:customerId', authenticateToken, authorizeRoles(['restaurantOwner', 'customer']), getOrdersByCustomerId);
router.get('/status/:status', authenticateToken, authorizeRoles(['restaurantOwner']), getOrdersByStatus);
router.patch('/:orderId/status', authenticateToken, authorizeRoles(['restaurantOwner']), updateOrderStatus);

// Payment routes
router.get('/verify-payment/:txRef', verifyPayment); // Chapa webhook
router.get('/payment-success/:orderId', paymentSuccessRedirect); // Redirect after payment

export default router;