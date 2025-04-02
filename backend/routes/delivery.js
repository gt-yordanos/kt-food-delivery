import express from 'express';
import {
  createDelivery,
  getDeliveryDetails,
  changeDeliveryStatus,
} from '../controllers/delivery.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), createDelivery);
router.get('/details/:orderId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), getDeliveryDetails);
router.put('/change-status/:deliveryId', authenticateToken, authorizeRoles(['deliveryPerson']), changeDeliveryStatus);

export default router;