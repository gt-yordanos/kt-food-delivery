import express from 'express';
import {
  createDelivery,
  updateDeliveryStatus,
  getAllDeliveries,
  getDeliveryById,
  getDeliveriesByPerson,
  getDeliveriesByCampus,
  getDeliveriesByDay,
  getDeliveriesByHour,
  verifyDeliveryByCustomer,
  getDeliveriesByOrderId,
  getDeliveriesByStatus,
  getDeliveriesByPersonAndStatus,
  getDeliveriesByPersonStatusAndVerification,
  getDeliveriesByPersonAndCustomerVerification,
  getDeliveriesByCustomer
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

// Get all deliveries
router.get(
  '/all',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner', 'deliveryPerson']),
  getAllDeliveries
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

// Get deliveries by orderId
router.get(
  '/order/:orderId',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner']),
  getDeliveriesByOrderId
);

// Get deliveries by status
router.get(
  '/status/:status',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner', 'deliveryPerson']),
  getDeliveriesByStatus
);

// Get deliveries by delivery person ID and status
router.get('/by-person-status/:status', authenticateToken, authorizeRoles(['deliveryPerson']), getDeliveriesByPersonAndStatus);

// Get deliveries by delivery person ID, status, and customer verification status
router.get('/by-person-status-verification/:status/:customerVerified', authenticateToken, authorizeRoles(['deliveryPerson']), getDeliveriesByPersonStatusAndVerification);

// Get deliveries by delivery person ID and customer verification status
router.get('/by-person-verification/:customerVerified', authenticateToken, authorizeRoles(['deliveryPerson']), getDeliveriesByPersonAndCustomerVerification);

// Get deliveries by customer ID
router.get(
  '/by-customer',
  authenticateToken,
  authorizeRoles(['customer']),
  getDeliveriesByCustomer
);

export default router;