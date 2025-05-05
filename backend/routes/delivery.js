import express from 'express';
import {
  createDelivery,
  updateDeliveryStatus,
  getDeliveryById,
  getDeliveriesByPerson,
  getDeliveriesByCampus,
  getDeliveriesByDay,
  getDeliveriesByHour,
} from '../controllers/delivery.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new delivery
router.post(
  '/create',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner']),
  createDelivery
);

// Update delivery status (used by delivery person)
router.put(
  '/change-status/:deliveryId',
  authenticateToken,
  authorizeRoles(['deliveryPerson']),
  updateDeliveryStatus
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
  authorizeRoles(['admin', 'restaurantOwner', 'restaurantOwner']),
  getDeliveriesByCampus
);

// Get deliveries by specific day
router.get(
  '/by-day',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner', 'restaurantOwner']),
  getDeliveriesByDay
);

// Get deliveries by specific hour
router.get(
  '/by-hour',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner', 'restaurantOwner']),
  getDeliveriesByHour
);

export default router;
