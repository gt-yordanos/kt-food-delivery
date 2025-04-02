import express from 'express';
import { getRestaurant, addRestaurant, updateRestaurant } from '../controllers/restaurant.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getRestaurant);
router.post('/add', authenticateUser, authorizeRoles(['admin', 'restaurantOwner']), addRestaurant);
router.patch('/update', authenticateUser, authorizeRoles(['admin', 'restaurantOwner']), updateRestaurant);

export default router;