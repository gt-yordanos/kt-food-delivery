import express from 'express';
import { 
  addDeliveryPerson, 
  loginDeliveryPerson, 
  updateDeliveryPerson, 
  deleteDeliveryPerson, 
  getAllDeliveryPersons, 
  searchDeliveryPerson,
  getDeliveryPersonsByCampusWithActiveDeliveries 
} from '../controllers/deliveryPerson.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), addDeliveryPerson);
router.post('/login', loginDeliveryPerson);
router.put('/update/:deliveryPersonId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), updateDeliveryPerson);
router.delete('/delete/:deliveryPersonId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), deleteDeliveryPerson);
router.get('/all', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), getAllDeliveryPersons);
router.get('/search', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), searchDeliveryPerson);
router.get('/campus/:campus/active-deliveries', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), getDeliveryPersonsByCampusWithActiveDeliveries);

export default router;