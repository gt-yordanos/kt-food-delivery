import express from 'express';
import {
  createOrder,
  getAllOrders,
  trackOrder
} from '../controllers/order.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, authorizeRoles(['customer']), createOrder);
router.get('/all', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), getAllOrders);
router.get('/track/:orderId', authenticateToken, authorizeRoles(['customer']), trackOrder);

export default router;
