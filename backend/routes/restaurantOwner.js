import express from 'express';
import { 
  addRestaurantOwner, 
  loginRestaurantOwner, 
  updateRestaurantOwner, 
  getAllRestaurantOwners, 
  searchRestaurantOwner,
  deleteRestaurantOwner
} from '../controllers/restaurantOwner.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/add', authenticateToken, authorizeRoles(['admin', 'manager']), addRestaurantOwner);
router.post('/login', loginRestaurantOwner);
router.put('/update/:ownerId', authenticateToken, authorizeRoles(['admin', 'manager']), updateRestaurantOwner);
router.get('/all', authenticateToken, authorizeRoles(['admin', 'manager']), getAllRestaurantOwners);
router.get('/search', authenticateToken, authorizeRoles(['admin', 'manager']), searchRestaurantOwner);
router.delete('/delete/:ownerId', authenticateToken, authorizeRoles(['admin']), deleteRestaurantOwner);

export default router;