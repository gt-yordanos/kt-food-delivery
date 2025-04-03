import express from 'express';
import { getRestaurant, updateRestaurant } from '../controllers/restaurant.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getRestaurant);
router.patch('/update', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), updateRestaurant);

export default router;