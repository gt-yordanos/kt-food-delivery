import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrdersByCustomerId,
  getOrdersByStatus,
  updateOrderStatus,
} from '../controllers/order.js';

import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles(['customer']), createOrder);
router.get('/', authenticateToken, authorizeRoles(['admin']), getAllOrders);
router.get('/customer/:customerId', authenticateToken, authorizeRoles(['restaurantOwner', 'customer']), getOrdersByCustomerId);
router.get('/status/:status', authenticateToken, authorizeRoles(['restaurantOwner']), getOrdersByStatus);
router.patch('/:orderId/status', authenticateToken, authorizeRoles(['restaurantOwner']), updateOrderStatus);

export default router;
