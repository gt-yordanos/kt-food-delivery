import express from 'express';
import { 
  addRestaurantOwner, 
  loginRestaurantOwner, 
  updateRestaurantOwner, 
  getAllRestaurantOwners, 
  searchRestaurantOwner 
} from '../controllers/restaurantOwner.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/add', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), addRestaurantOwner);
router.post('/login', loginRestaurantOwner);
router.put('/update/:ownerId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), updateRestaurantOwner);
router.get('/all', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), getAllRestaurantOwners);
router.get('/search', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), searchRestaurantOwner);
router.delete('/delete/:ownerId', authenticateToken, authorizeRoles(['admin']), deleteRestaurantOwner);

export default router;