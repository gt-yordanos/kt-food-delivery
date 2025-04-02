import express from 'express';
import { 
  addRestaurantOwner, 
  loginRestaurantOwner, 
  updateRestaurantOwner, 
  getAllRestaurantOwners, 
  searchRestaurantOwner 
} from '../controllers/restaurantOwner.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/add', authenticate, authorize(['admin', 'restaurantOwner']), addRestaurantOwner);
router.post('/login', loginRestaurantOwner);
router.put('/update/:ownerId', authenticate, authorize(['admin', 'restaurantOwner']), updateRestaurantOwner);
router.get('/all', authenticate, authorize(['admin', 'restaurantOwner']), getAllRestaurantOwners);
router.get('/search', authenticate, authorize(['admin', 'restaurantOwner']), searchRestaurantOwner);

export default router;