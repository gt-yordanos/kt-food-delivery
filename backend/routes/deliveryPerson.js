import express from 'express';
import { 
  addDeliveryPerson, 
  loginDeliveryPerson, 
  updateDeliveryPerson, 
  getDeliveryPersonById,
  deleteDeliveryPerson, 
  getAllDeliveryPersons, 
  searchDeliveryPerson,
  getDeliveryPersonsByCampusWithActiveDeliveries 
} from '../controllers/deliveryPerson.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticateToken, authorizeRoles(['admin', 'manager']), addDeliveryPerson);
router.post('/login', loginDeliveryPerson);
router.put('/update/:deliveryPersonId', authenticateToken, authorizeRoles(['admin', 'manager', 'deliveryPerson']), updateDeliveryPerson);
router.delete('/delete/:deliveryPersonId', authenticateToken, authorizeRoles(['admin', 'manager']), deleteDeliveryPerson);
router.get('/get/:deliveryPersonId', authenticateToken, authorizeRoles(['admin', 'manager', 'deliveryPerson']), getDeliveryPersonById);
router.get('/all', authenticateToken, authorizeRoles(['admin', 'manager']), getAllDeliveryPersons);
router.get('/search', authenticateToken, authorizeRoles(['admin', 'manager']), searchDeliveryPerson);
router.get('/campus/:campus/active-deliveries', authenticateToken, authorizeRoles(['admin', 'manager']), getDeliveryPersonsByCampusWithActiveDeliveries);

export default router;