import express from 'express';
import { getRestaurant, addRestaurant, updateRestaurant } from '../controllers/restaurant.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getRestaurant);
router.post('/add', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), addRestaurant);
router.patch('/update', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), updateRestaurant);

export default router;