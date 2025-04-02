import express from 'express';
import { 
  addDeliveryPerson, 
  loginDeliveryPerson, 
  updateDeliveryPerson, 
  deleteDeliveryPerson, 
  getAllDeliveryPersons, 
  searchDeliveryPerson 
} from '../controllers/deliveryPerson.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticate, authorize(['admin', 'restaurantOwner']), addDeliveryPerson);
router.post('/login', loginDeliveryPerson);
router.put('/update/:deliveryPersonId', authenticate, authorize(['admin', 'restaurantOwner']), updateDeliveryPerson);
router.delete('/delete/:deliveryPersonId', authenticate, authorize(['admin', 'restaurantOwner']), deleteDeliveryPerson);
router.get('/all', authenticate, authorize(['admin', 'restaurantOwner']), getAllDeliveryPersons);
router.get('/search', authenticate, authorize(['admin', 'restaurantOwner']), searchDeliveryPerson);

export default router;