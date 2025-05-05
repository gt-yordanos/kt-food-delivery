import express from 'express';
import {
  createDelivery,
  updateDeliveryStatus,
  getDeliveryById,
  getDeliveriesByPerson,
  getDeliveriesByCampus,
  getDeliveriesByDay,
  getDeliveriesByHour,
  verifyDeliveryByCustomer,
  getDeliveriesByOrderId
} from '../controllers/delivery.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create delivery
router.post(
  '/create',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner']),
  createDelivery
);

// Update delivery status
router.put(
  '/change-status/:deliveryId',
  authenticateToken,
  authorizeRoles(['deliveryPerson']),
  updateDeliveryStatus
);

// ✅ Customer verifies delivery
router.put(
  '/verify/:deliveryId',
  authenticateToken,
  authorizeRoles(['customer']),
  verifyDeliveryByCustomer
);

// Get delivery by ID
router.get(
  '/:deliveryId',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner', 'deliveryPerson']),
  getDeliveryById
);

// Get deliveries assigned to a delivery person
router.get(
  '/by-person/:deliveryPersonId',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner', 'deliveryPerson']),
  getDeliveriesByPerson
);

// Get deliveries by campus
router.get(
  '/by-campus/:campus',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner']),
  getDeliveriesByCampus
);

// Get deliveries by specific day
router.get(
  '/by-day',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner']),
  getDeliveriesByDay
);

// Get deliveries by specific hour
router.get(
  '/by-hour',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner']),
  getDeliveriesByHour
);

app.get('/deliveries/order/:orderId', authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner']), getDeliveriesByOrderId);
export default router;