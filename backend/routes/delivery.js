import express from 'express';
import {
  createDelivery,
  getDeliveryDetails,
  changeDeliveryStatus,
} from '../controllers/delivery.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateUser, authorizeRoles(['admin', 'restaurantOwner']), createDelivery);
router.get('/details/:orderId', authenticateUser, authorizeRoles(['admin', 'restaurantOwner']), getDeliveryDetails);
router.put('/change-status/:deliveryId', authenticateUser, authorizeRoles(['deliveryPerson']), changeDeliveryStatus);

export default router;