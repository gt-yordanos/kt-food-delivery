import express from 'express';
import {
  createOrder,
  getAllOrders,
  trackOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/create', createOrder);
router.get('/all', getAllOrders);
router.get('/track/:orderId', trackOrder);
router.put('/update-status/:orderId', updateOrderStatus);

export default router;