import express from 'express';
import {
  createOrder,
  getAllOrders,
  trackOrder
} from '../controllers/order.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateUser, authorizeRoles(['customer']), createOrder);
router.get('/all', authenticateUser, authorizeRoles(['admin', 'restaurantOwner']), getAllOrders);
router.get('/track/:orderId', authenticateUser, authorizeRoles(['customer']), trackOrder);

export default router;
